import { IDEF1Model } from '../../../domain/models/IDEF1Model';
import { IDEF1ApplicationService } from '../../../application/services/IDEF1ApplicationService';
import { GoJSDiagramAdapter, GoJSDiagramOptions } from '../outbound/gojs/GoJSDiagramAdapter';
import { InMemoryOrJsonRepository } from '../outbound/persistence/InMemoryOrJsonRepository';
import { SimpleEventPublisher } from '../../events/SimpleEventPublisher';
import { RelationshipType, Cardinality } from '../../../domain/models/Relationship';
import { ModelDTO } from '../../../application/dtos/ModelDTO';
import { IDomainEvent } from '../../../domain/events/DomainEvents';

export interface IDEF1EditorConfig {
  container?: HTMLElement | string;
  modelId?: string;
  modelName?: string;
  diagramOptions?: GoJSDiagramOptions;
}

/**
 * IDEF1Editor - Primary Inbound Adapter / Public Facade
 * Provides an easy-to-use API orchestrating Domain, Application Services, and GoJS Adapter.
 */
export class IDEF1Editor {
  private readonly appService: IDEF1ApplicationService;
  private readonly diagramAdapter: GoJSDiagramAdapter;
  private readonly repository: InMemoryOrJsonRepository;
  private readonly eventPublisher: SimpleEventPublisher;

  constructor(config: IDEF1EditorConfig = {}) {
    const model = new IDEF1Model({
      id: config.modelId || `idef1_model_${Date.now()}`,
      name: config.modelName || 'IDEF1X Information Model',
    });

    this.diagramAdapter = new GoJSDiagramAdapter(config.diagramOptions);
    this.repository = new InMemoryOrJsonRepository();
    this.eventPublisher = new SimpleEventPublisher();

    this.appService = new IDEF1ApplicationService(
      model,
      this.diagramAdapter,
      this.repository,
      this.eventPublisher
    );

    if (config.container) {
      this.mount(config.container);
    }
  }

  /**
   * Mounts the editor into a DOM element
   */
  public mount(container: HTMLElement | string): void {
    this.diagramAdapter.initialize(container);
    this.diagramAdapter.renderModel(this.appService.getDomainModel());
  }

  public getModel(): ModelDTO {
    return this.appService.getModel();
  }

  public async addEntity(
    name: string,
    options: {
      id?: string;
      isDependent?: boolean;
      position?: { x: number; y: number };
      primaryKeys?: Array<{ name: string; dataType?: string }>;
      nonKeys?: Array<{ name: string; dataType?: string; isOptional?: boolean }>;
    } = {}
  ): Promise<string> {
    const entityId = await this.appService.createEntity({
      id: options.id,
      name,
      isDependent: options.isDependent,
      position: options.position,
    });

    if (options.primaryKeys) {
      for (const pk of options.primaryKeys) {
        await this.appService.addAttribute({
          entityId,
          name: pk.name,
          isPrimaryKey: true,
          dataType: pk.dataType,
        });
      }
    }

    if (options.nonKeys) {
      for (const nk of options.nonKeys) {
        await this.appService.addAttribute({
          entityId,
          name: nk.name,
          isPrimaryKey: false,
          dataType: nk.dataType,
          isOptional: nk.isOptional,
        });
      }
    }

    return entityId;
  }

  public async addRelationship(
    parentEntityId: string,
    childEntityId: string,
    options: {
      id?: string;
      name?: string;
      type?: RelationshipType;
      cardinality?: Cardinality;
      cardinalityValue?: string;
      isOptional?: boolean;
    } = {}
  ): Promise<string> {
    return await this.appService.addRelationship({
      id: options.id,
      name: options.name,
      parentEntityId,
      childEntityId,
      type: options.type ?? RelationshipType.IDENTIFYING,
      cardinality: options.cardinality ?? Cardinality.ZERO_OR_MORE,
      cardinalityValue: options.cardinalityValue,
      isOptional: options.isOptional,
    });
  }

  public async addCategorization(
    genericEntityId: string,
    discriminatorAttributeName: string,
    specificEntityIds: string[],
    isComplete: boolean = false
  ): Promise<string> {
    return await this.appService.addCategorization({
      genericEntityId,
      discriminatorAttributeName,
      specificEntityIds,
      isComplete,
    });
  }

  public async addAttribute(
    entityId: string,
    name: string,
    isPrimaryKey: boolean = false,
    dataType: string = 'VARCHAR(50)',
    isOptional: boolean = false
  ): Promise<void> {
    await this.appService.addAttribute({
      entityId,
      name,
      isPrimaryKey,
      dataType,
      isOptional,
    });
  }

  public async removeAttribute(entityId: string, attributeName: string): Promise<void> {
    await this.appService.removeAttribute(entityId, attributeName);
  }

  public async removeEntity(entityId: string): Promise<void> {
    await this.appService.removeEntity(entityId);
  }

  public async removeRelationship(relationshipId: string): Promise<void> {
    await this.appService.removeRelationship(relationshipId);
  }

  public onEvent<T extends IDomainEvent>(eventName: string, handler: (event: T) => void): () => void {
    return this.eventPublisher.subscribe(eventName, handler);
  }

  public onEntitySelected(callback: (entityId: string | null) => void): void {
    this.diagramAdapter.onEntitySelected(callback);
  }

  public exportJson(): string {
    return this.appService.exportJson();
  }

  public async importJson(json: string): Promise<void> {
    await this.appService.importJson(json);
  }

  public exportSvg(): string {
    return this.diagramAdapter.makeSvg();
  }

  public exportImageDataUrl(): string {
    return this.diagramAdapter.makeImageDataUrl();
  }

  public getGoJSDiagram() {
    return this.diagramAdapter.getGoJSDiagram();
  }

  public destroy(): void {
    this.diagramAdapter.destroy();
  }
}
