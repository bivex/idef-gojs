import {
  IIDEF4EditorUseCase,
  CreateClassCommand,
  CreateRelationshipCommand,
} from '../ports/inbound/IIDEF4EditorUseCase';
import { IIDEF4DiagramRendererPort } from '../ports/outbound/IIDEF4DiagramRendererPort';
import { IIDEF4ModelRepositoryPort } from '../ports/outbound/IIDEF4ModelRepositoryPort';
import { ClassDTO, RelationshipDTO, DiagramDTO, ModelDTO } from '../dtos/IDEF4DTO';
import { IDEF4Model } from '../../domain/models/IDEF4Model';
import { IDEF4Diagram } from '../../domain/models/IDEF4Diagram';
import { IDEF4Class } from '../../domain/models/IDEF4Class';
import { IDEF4Attribute } from '../../domain/models/IDEF4Attribute';
import { IDEF4Method } from '../../domain/models/IDEF4Method';
import { IDEF4Relationship } from '../../domain/models/IDEF4Relationship';
import { Position } from '../../../domain/models/Position';
import { IDEF4Rules, IDEF4ValidationIssue } from '../../domain/rules/IDEF4Rules';

export class IDEF4ApplicationService implements IIDEF4EditorUseCase {
  private _model: IDEF4Model;

  constructor(
    private readonly _renderer: IIDEF4DiagramRendererPort,
    private readonly _repository?: IIDEF4ModelRepositoryPort
  ) {
    this._model = new IDEF4Model({
      id: 'default-idef4-model',
      name: 'Default IDEF4 OO Model',
    });
  }

  public get model(): IDEF4Model {
    return this._model;
  }

  public createModel(id: string, name: string): void {
    this._model = new IDEF4Model({ id, name });
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

  public addClass(command: CreateClassCommand): ClassDTO {
    const diag = this._model.activeDiagram;
    const id = `cls-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const attributes = (command.attributes || []).map(
      (a) =>
        new IDEF4Attribute({
          name: a.name,
          dataType: a.dataType,
          visibility: a.visibility,
          defaultValue: a.defaultValue,
          isStatic: a.isStatic,
        })
    );

    const methods = (command.methods || []).map(
      (m) =>
        new IDEF4Method({
          name: m.name,
          returnType: m.returnType,
          parameters: m.parameters,
          visibility: m.visibility,
          isAbstract: m.isAbstract,
          isStatic: m.isStatic,
        })
    );

    const cls = new IDEF4Class({
      id,
      name: command.name,
      isAbstract: command.isAbstract,
      isInterface: command.isInterface,
      attributes,
      methods,
      position: command.x !== undefined && command.y !== undefined
        ? new Position(command.x, command.y)
        : Position.origin(),
    });

    diag.addClass(cls);
    this.syncRenderer();
    return this.toClassDTO(cls);
  }

  public updateClass(classId: string, name: string): void {
    const diag = this._model.activeDiagram;
    const cls = diag.getClass(classId);
    cls.rename(name);
    this.syncRenderer();
  }

  public removeClass(classId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeClass(classId);
    this.syncRenderer();
  }

  public addRelationship(command: CreateRelationshipCommand): RelationshipDTO {
    const diag = this._model.activeDiagram;
    const id = `rel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const rel = new IDEF4Relationship({
      id,
      sourceClassId: command.sourceClassId,
      targetClassId: command.targetClassId,
      kind: command.kind,
      name: command.name,
      sourceMultiplicity: command.sourceMultiplicity,
      targetMultiplicity: command.targetMultiplicity,
      roleName: command.roleName,
    });

    diag.addRelationship(rel);
    this.syncRenderer();
    return this.toRelationshipDTO(rel);
  }

  public removeRelationship(relationshipId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeRelationship(relationshipId);
    this.syncRenderer();
  }

  public validateCurrentDiagram(): IDEF4ValidationIssue[] {
    return IDEF4Rules.validateDiagram(this._model.activeDiagram);
  }

  public autoLayout(): void {
    this._renderer.autoLayout();
  }

  public exportJSON(): string {
    return JSON.stringify(this._model.toJSON(), null, 2);
  }

  public importJSON(jsonString: string): void {
    const json = JSON.parse(jsonString);
    this._model = IDEF4Model.fromJSON(json);
    this.syncRenderer();
  }

  public syncRenderer(): void {
    this._renderer.render(this.getActiveDiagram());
  }

  private toClassDTO(cls: IDEF4Class): ClassDTO {
    return {
      id: cls.id,
      name: cls.name,
      isAbstract: cls.isAbstract,
      isInterface: cls.isInterface,
      attributes: cls.attributes.map((a) => ({
        name: a.name,
        dataType: a.dataType,
        visibility: a.visibility,
        defaultValue: a.defaultValue,
        isStatic: a.isStatic,
      })),
      methods: cls.methods.map((m) => ({
        name: m.name,
        returnType: m.returnType,
        parameters: m.parameters,
        visibility: m.visibility,
        isAbstract: m.isAbstract,
        isStatic: m.isStatic,
      })),
      x: cls.position.x,
      y: cls.position.y,
    };
  }

  private toRelationshipDTO(rel: IDEF4Relationship): RelationshipDTO {
    return {
      id: rel.id,
      sourceClassId: rel.sourceClassId,
      targetClassId: rel.targetClassId,
      kind: rel.kind,
      name: rel.name,
      sourceMultiplicity: rel.sourceMultiplicity,
      targetMultiplicity: rel.targetMultiplicity,
      roleName: rel.roleName,
    };
  }

  private toDiagramDTO(diag: IDEF4Diagram): DiagramDTO {
    return {
      id: diag.id,
      name: diag.name,
      classes: diag.classes.map((c) => this.toClassDTO(c)),
      relationships: diag.relationships.map((r) => this.toRelationshipDTO(r)),
    };
  }

  private toModelDTO(model: IDEF4Model): ModelDTO {
    return {
      id: model.id,
      name: model.name,
      rootDiagramId: model.rootDiagramId,
      activeDiagramId: model.activeDiagramId,
      diagrams: model.diagrams.map((d) => this.toDiagramDTO(d)),
    };
  }
}
