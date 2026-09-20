import {
  IIDEF5EditorUseCase,
  CreateKindCommand,
  CreateRelationCommand,
} from '../ports/inbound/IIDEF5EditorUseCase';
import { IIDEF5DiagramRendererPort } from '../ports/outbound/IIDEF5DiagramRendererPort';
import { IIDEF5ModelRepositoryPort } from '../ports/outbound/IIDEF5ModelRepositoryPort';
import { KindDTO, RelationDTO, DiagramDTO, ModelDTO } from '../dtos/IDEF5DTO';
import { IDEF5Model } from '../../domain/models/IDEF5Model';
import { IDEF5Diagram } from '../../domain/models/IDEF5Diagram';
import { IDEF5Kind } from '../../domain/models/IDEF5Kind';
import { IDEF5Property } from '../../domain/models/IDEF5Property';
import { IDEF5Relation } from '../../domain/models/IDEF5Relation';
import { Position } from '../../../domain/models/Position';
import { IDEF5Rules, IDEF5ValidationIssue } from '../../domain/rules/IDEF5Rules';

export class IDEF5ApplicationService implements IIDEF5EditorUseCase {
  private _model: IDEF5Model;

  constructor(
    private readonly _renderer: IIDEF5DiagramRendererPort,
    private readonly _repository?: IIDEF5ModelRepositoryPort
  ) {
    this._model = new IDEF5Model({
      id: 'default-idef5-model',
      name: 'Default IDEF5 Ontology Model',
    });
  }

  public get model(): IDEF5Model {
    return this._model;
  }

  public createModel(id: string, name: string): void {
    this._model = new IDEF5Model({ id, name });
    this.syncRenderer();
  }

  public async loadModel(modelId: string): Promise<ModelDTO> {
    if (!this._repository) throw new Error('Repository port not provided');
    const loaded = await this._repository.findById(modelId);
    if (!loaded) throw new Error(`Model ${modelId} not found`);
    this._model = loaded;
    this.syncRenderer();
    return this.toModelDTO(this._model);
  }

  public async saveModel(): Promise<void> {
    if (this._repository) {
      await this._repository.save(this._model);
    }
  }

  public getActiveDiagram(): DiagramDTO {
    return this.toDiagramDTO(this._model.activeDiagram);
  }

  public setActiveDiagram(diagramId: string): void {
    this._model.setActiveDiagram(diagramId);
    this.syncRenderer();
  }

  public addKind(command: CreateKindCommand): KindDTO {
    const diag = this._model.activeDiagram;
    const id = `kind-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const properties = (command.properties || []).map(
      (p) =>
        new IDEF5Property({
          name: p.name,
          valueType: p.valueType,
          isMandatory: p.isMandatory,
          defaultValue: p.defaultValue,
        })
    );

    const kind = new IDEF5Kind({
      id,
      name: command.name,
      description: command.description,
      isIndividual: command.isIndividual,
      properties,
      position:
        command.x !== undefined && command.y !== undefined
          ? new Position(command.x, command.y)
          : Position.origin(),
    });

    diag.addKind(kind);
    this.syncRenderer();
    return this.toKindDTO(kind);
  }

  public updateKind(kindId: string, name: string): void {
    const diag = this._model.activeDiagram;
    const kind = diag.getKind(kindId);
    kind.rename(name);
    this.syncRenderer();
  }

  public removeKind(kindId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeKind(kindId);
    this.syncRenderer();
  }

  public addRelation(command: CreateRelationCommand): RelationDTO {
    const diag = this._model.activeDiagram;
    const id = `rel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const rel = new IDEF5Relation({
      id,
      sourceKindId: command.sourceKindId,
      targetKindId: command.targetKindId,
      type: command.type,
      name: command.name,
      isTransitive: command.isTransitive,
      isSymmetric: command.isSymmetric,
      isReflexive: command.isReflexive,
    });

    diag.addRelation(rel);
    this.syncRenderer();
    return this.toRelationDTO(rel);
  }

  public removeRelation(relationId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeRelation(relationId);
    this.syncRenderer();
  }

  public validateCurrentDiagram(): IDEF5ValidationIssue[] {
    return IDEF5Rules.validateDiagram(this._model.activeDiagram);
  }

  public autoLayout(): void {
    this._renderer.autoLayout();
  }

  public exportJSON(): string {
    return JSON.stringify(this._model.toJSON(), null, 2);
  }

  public importJSON(jsonString: string): void {
    const json = JSON.parse(jsonString);
    this._model = IDEF5Model.fromJSON(json);
    this.syncRenderer();
  }

  public syncRenderer(): void {
    this._renderer.render(this.getActiveDiagram());
  }

  private toKindDTO(kind: IDEF5Kind): KindDTO {
    return {
      id: kind.id,
      name: kind.name,
      description: kind.description,
      isIndividual: kind.isIndividual,
      properties: kind.properties.map((p) => ({
        name: p.name,
        valueType: p.valueType,
        isMandatory: p.isMandatory,
        defaultValue: p.defaultValue,
      })),
      x: kind.position.x,
      y: kind.position.y,
    };
  }

  private toRelationDTO(rel: IDEF5Relation): RelationDTO {
    return {
      id: rel.id,
      sourceKindId: rel.sourceKindId,
      targetKindId: rel.targetKindId,
      type: rel.type,
      name: rel.name,
      isTransitive: rel.isTransitive,
      isSymmetric: rel.isSymmetric,
      isReflexive: rel.isReflexive,
    };
  }

  private toDiagramDTO(diag: IDEF5Diagram): DiagramDTO {
    return {
      id: diag.id,
      name: diag.name,
      schematicType: diag.schematicType,
      kinds: diag.kinds.map((k) => this.toKindDTO(k)),
      relations: diag.relations.map((r) => this.toRelationDTO(r)),
    };
  }

  private toModelDTO(model: IDEF5Model): ModelDTO {
    return {
      id: model.id,
      name: model.name,
      rootDiagramId: model.rootDiagramId,
      activeDiagramId: model.activeDiagramId,
      diagrams: model.diagrams.map((d) => this.toDiagramDTO(d)),
    };
  }
}
