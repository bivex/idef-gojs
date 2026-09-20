import {
  IIDEF1EditorUseCase,
  CreateEntityParams,
  AddAttributeParams,
  AddRelationshipParams,
  AddCategorizationParams,
} from '../ports/inbound/IIDEF1EditorUseCase';
import { IDiagramRendererPort } from '../ports/outbound/IDiagramRendererPort';
import { IModelRepositoryPort } from '../ports/outbound/IModelRepositoryPort';
import { IEventPublisherPort } from '../ports/outbound/IEventPublisherPort';
import { ModelDTO } from '../dtos/ModelDTO';
import { IDEF1Model } from '../../domain/models/IDEF1Model';
import { Entity } from '../../domain/models/Entity';
import { Attribute } from '../../domain/models/Attribute';
import { Relationship, RelationshipType, Cardinality } from '../../domain/models/Relationship';
import { CategorizationCluster } from '../../domain/models/Categorization';
import { Position } from '../../domain/models/Position';

export class IDEF1ApplicationService implements IIDEF1EditorUseCase {
  private model: IDEF1Model;
  private nextEntityNumber: number = 1;

  constructor(
    initialModel: IDEF1Model,
    private readonly rendererPort?: IDiagramRendererPort,
    private readonly repositoryPort?: IModelRepositoryPort,
    private readonly eventPublisher?: IEventPublisherPort
  ) {
    this.model = initialModel;
    this.calculateNextEntityNumber();
    this.wireRendererHooks();
  }

  private calculateNextEntityNumber(): void {
    const maxNum = this.model.entities.reduce((max, e) => Math.max(max, e.number), 0);
    this.nextEntityNumber = maxNum + 1;
  }

  private wireRendererHooks(): void {
    if (!this.rendererPort) return;

    this.rendererPort.onEntityMoved(async (entityId, pos) => {
      await this.updateEntityPosition(entityId, pos);
    });

    this.rendererPort.onRelationshipCreated(async (parentId, childId) => {
      await this.addRelationship({
        parentEntityId: parentId,
        childEntityId: childId,
        type: RelationshipType.IDENTIFYING,
        cardinality: Cardinality.ZERO_OR_MORE,
      });
    });

    this.rendererPort.onEntityDeleted(async (entityId) => {
      await this.removeEntity(entityId);
    });
  }

  private async dispatchEvents(): Promise<void> {
    const events = this.model.pullEvents();
    if (this.eventPublisher && events.length > 0) {
      await this.eventPublisher.publishAll(events);
    }
  }

  public getModel(): ModelDTO {
    return this.model.toJSON() as ModelDTO;
  }

  public getDomainModel(): IDEF1Model {
    return this.model;
  }

  public async createEntity(params: CreateEntityParams): Promise<string> {
    const id = params.id || `entity_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const num = params.number ?? this.nextEntityNumber++;
    const pos = params.position
      ? new Position(params.position.x, params.position.y)
      : new Position(100 + Math.random() * 200, 100 + Math.random() * 200);

    const entity = new Entity({
      id,
      name: params.name,
      number: num,
      isDependent: params.isDependent ?? false,
      position: pos,
    });

    this.model.addEntity(entity);
    this.rendererPort?.renderEntity(entity);
    await this.dispatchEvents();

    return id;
  }

  public async renameEntity(entityId: string, newName: string): Promise<void> {
    const entity = this.model.getEntity(entityId);
    entity.rename(newName);
    this.rendererPort?.renderEntity(entity);
    await this.dispatchEvents();
  }

  public async setEntityDependent(entityId: string, isDependent: boolean): Promise<void> {
    const entity = this.model.getEntity(entityId);
    entity.setDependent(isDependent);
    this.rendererPort?.renderEntity(entity);
    await this.dispatchEvents();
  }

  public async updateEntityPosition(entityId: string, position: { x: number; y: number }): Promise<void> {
    const pos = new Position(position.x, position.y);
    this.model.updateEntityPosition(entityId, pos);
    // Entity moved via renderer or external command
    await this.dispatchEvents();
  }

  public async removeEntity(entityId: string): Promise<void> {
    this.model.removeEntity(entityId);
    this.rendererPort?.removeEntity(entityId);
    await this.dispatchEvents();
  }

  public async addAttribute(params: AddAttributeParams): Promise<void> {
    const attr = new Attribute(
      params.name,
      params.isPrimaryKey ?? false,
      false,
      params.dataType || 'VARCHAR(50)',
      undefined,
      params.roleName,
      params.isOptional ?? false,
      params.alternateKeyIndex
    );

    this.model.addAttributeToEntity(params.entityId, attr);
    const entity = this.model.getEntity(params.entityId);
    this.rendererPort?.renderEntity(entity);

    // If key migrated to children, refresh affected child entities in renderer
    for (const childEntity of this.model.entities) {
      this.rendererPort?.renderEntity(childEntity);
    }

    await this.dispatchEvents();
  }

  public async removeAttribute(entityId: string, attributeName: string): Promise<void> {
    this.model.removeAttributeFromEntity(entityId, attributeName);
    const entity = this.model.getEntity(entityId);
    this.rendererPort?.renderEntity(entity);

    for (const childEntity of this.model.entities) {
      this.rendererPort?.renderEntity(childEntity);
    }

    await this.dispatchEvents();
  }

  public async addRelationship(params: AddRelationshipParams): Promise<string> {
    const id = params.id || `rel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const rel = new Relationship({
      id,
      name: params.name || '',
      inverseName: params.inverseName,
      roleName: params.roleName,
      parentEntityId: params.parentEntityId,
      childEntityId: params.childEntityId,
      type: params.type ?? RelationshipType.IDENTIFYING,
      cardinality: params.cardinality ?? Cardinality.ZERO_OR_MORE,
      cardinalityValue: params.cardinalityValue,
      isOptional: params.isOptional,
    });

    this.model.addRelationship(rel);
    this.rendererPort?.renderRelationship(rel);

    // Child entity might have become dependent and received migrated keys
    const child = this.model.getEntity(rel.childEntityId);
    this.rendererPort?.renderEntity(child);

    await this.dispatchEvents();
    return id;
  }

  public async removeRelationship(relationshipId: string): Promise<void> {
    const rel = this.model.getRelationship(relationshipId);
    const childId = rel.childEntityId;

    this.model.removeRelationship(relationshipId);
    this.rendererPort?.removeRelationship(relationshipId);

    const child = this.model.getEntity(childId);
    this.rendererPort?.renderEntity(child);

    await this.dispatchEvents();
  }

  public async addCategorization(params: AddCategorizationParams): Promise<string> {
    const id = params.id || `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cluster = new CategorizationCluster({
      id,
      genericEntityId: params.genericEntityId,
      discriminatorAttributeName: params.discriminatorAttributeName,
      specificEntityIds: params.specificEntityIds,
      isComplete: params.isComplete ?? false,
    });

    this.model.addCategorization(cluster);

    // Refresh affected specific entities
    for (const specId of params.specificEntityIds) {
      this.rendererPort?.renderEntity(this.model.getEntity(specId));
    }

    // Refresh model
    this.rendererPort?.renderModel(this.model);

    await this.dispatchEvents();
    return id;
  }

  public async save(): Promise<void> {
    if (this.repositoryPort) {
      await this.repositoryPort.save(this.model);
    }
  }

  public async load(modelId: string): Promise<void> {
    if (!this.repositoryPort) {
      throw new Error('Repository port is not configured.');
    }
    const loaded = await this.repositoryPort.findById(modelId);
    if (!loaded) {
      throw new Error(`Model with id "${modelId}" could not be found.`);
    }
    this.model = loaded;
    this.calculateNextEntityNumber();
    this.rendererPort?.renderModel(this.model);
  }

  public exportJson(): string {
    return JSON.stringify(this.model.toJSON(), null, 2);
  }

  public async importJson(jsonString: string): Promise<void> {
    const data = JSON.parse(jsonString);
    const newModel = new IDEF1Model({ id: data.id, name: data.name });

    for (const entData of data.entities || []) {
      const attrs = (entData.attributes || []).map(
        (a: any) =>
          new Attribute(
            a.name,
            a.isPrimaryKey,
            a.isForeignKey,
            a.dataType,
            a.foreignKeyRef,
            a.roleName,
            a.isOptional,
            a.alternateKeyIndex
          )
      );
      const entity = new Entity({
        id: entData.id,
        name: entData.name,
        number: entData.number,
        isDependent: entData.isDependent,
        position: new Position(entData.position?.x ?? 0, entData.position?.y ?? 0),
        attributes: attrs,
      });
      newModel.addEntity(entity);
    }

    for (const relData of data.relationships || []) {
      const rel = new Relationship({
        id: relData.id,
        name: relData.name,
        inverseName: relData.inverseName,
        roleName: relData.roleName,
        parentEntityId: relData.parentEntityId,
        childEntityId: relData.childEntityId,
        type: relData.type,
        cardinality: relData.cardinality,
        cardinalityValue: relData.cardinalityValue,
        isOptional: relData.isOptional,
      });
      newModel.addRelationship(rel);
    }

    for (const catData of data.categorizations || []) {
      const cluster = new CategorizationCluster({
        id: catData.id,
        genericEntityId: catData.genericEntityId,
        discriminatorAttributeName: catData.discriminatorAttributeName,
        specificEntityIds: catData.specificEntityIds,
        isComplete: catData.isComplete,
      });
      newModel.addCategorization(cluster);
    }

    this.model = newModel;
    this.calculateNextEntityNumber();
    this.rendererPort?.renderModel(this.model);
    await this.dispatchEvents();
  }
}
