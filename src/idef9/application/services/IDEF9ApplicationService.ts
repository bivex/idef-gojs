import {
  IIDEF9EditorUseCase,
  CreateConstraintCommand,
  CreateControlledObjectCommand,
  CreateEnforcementMechanismCommand,
  CreateSourceDocumentCommand,
  CreateIDEF9LinkCommand,
} from '../ports/inbound/IIDEF9EditorUseCase';
import {
  ConstraintDTO,
  ControlledObjectDTO,
  EnforcementMechanismDTO,
  SourceDocumentDTO,
  LinkDTO,
  DiagramDTO,
  ModelDTO,
} from '../dtos/IDEF9DTO';
import { IIDEF9DiagramRendererPort } from '../ports/outbound/IIDEF9DiagramRendererPort';
import { IIDEF9ModelRepositoryPort } from '../ports/outbound/IIDEF9ModelRepositoryPort';
import { IDEF9Model } from '../../domain/models/IDEF9Model';
import { IDEF9Diagram } from '../../domain/models/IDEF9Diagram';
import { IDEF9Constraint, ConstraintStatus } from '../../domain/models/IDEF9Constraint';
import { IDEF9ControlledObject } from '../../domain/models/IDEF9ControlledObject';
import { IDEF9EnforcementMechanism } from '../../domain/models/IDEF9EnforcementMechanism';
import { IDEF9SourceDocument } from '../../domain/models/IDEF9SourceDocument';
import { IDEF9Link } from '../../domain/models/IDEF9Link';
import { Position } from '../../../domain/models/Position';
import { IDEF9Rules, IDEF9ValidationIssue } from '../../domain/rules/IDEF9Rules';
import { ConstraintNotFoundError } from '../../domain/errors/IDEF9Error';

export class IDEF9ApplicationService implements IIDEF9EditorUseCase {
  private _model: IDEF9Model;
  private readonly _renderer?: IIDEF9DiagramRendererPort;
  private readonly _repository?: IIDEF9ModelRepositoryPort;

  constructor(
    renderer?: IIDEF9DiagramRendererPort,
    repository?: IIDEF9ModelRepositoryPort
  ) {
    this._renderer = renderer;
    this._repository = repository;
    this._model = new IDEF9Model({
      id: 'constraints-model-default',
      name: 'Default Business Rules & Constraints Model',
    });
  }

  public createModel(id: string, name: string): void {
    this._model = new IDEF9Model({ id, name });
    this.syncRenderer();
  }

  public async loadModel(modelId: string): Promise<ModelDTO> {
    if (!this._repository) throw new Error('Repository port not configured.');
    const loaded = await this._repository.findById(modelId);
    if (!loaded) throw new Error(`IDEF9 Model "${modelId}" not found.`);
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

  // Constraints
  public addConstraint(cmd: CreateConstraintCommand): ConstraintDTO {
    const id = `constraint-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const constraint = new IDEF9Constraint({
      id,
      code: cmd.code,
      name: cmd.name,
      statement: cmd.statement,
      constraintType: cmd.constraintType,
      severity: cmd.severity,
      status: cmd.status,
      position: new Position(cmd.x ?? 100, cmd.y ?? 100),
    });
    this._model.activeDiagram.addConstraint(constraint);
    this.syncRenderer();
    return this.toConstraintDTO(constraint);
  }

  public updateConstraint(id: string, name: string, status?: ConstraintStatus): void {
    const constraint = this._model.activeDiagram.getConstraint(id);
    if (!constraint) throw new ConstraintNotFoundError(id);
    constraint.rename(name);
    if (status) constraint.setStatus(status);
    this.syncRenderer();
  }

  public removeConstraint(id: string): void {
    this._model.activeDiagram.removeConstraint(id);
    this.syncRenderer();
  }

  // Controlled Objects
  public addControlledObject(cmd: CreateControlledObjectCommand): ControlledObjectDTO {
    const id = `obj-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const obj = new IDEF9ControlledObject({
      id,
      name: cmd.name,
      objectType: cmd.objectType,
      description: cmd.description,
      position: new Position(cmd.x ?? 300, cmd.y ?? 100),
    });
    this._model.activeDiagram.addControlledObject(obj);
    this.syncRenderer();
    return this.toControlledObjectDTO(obj);
  }

  public removeControlledObject(id: string): void {
    this._model.activeDiagram.removeControlledObject(id);
    this.syncRenderer();
  }

  // Enforcement Mechanisms
  public addEnforcementMechanism(cmd: CreateEnforcementMechanismCommand): EnforcementMechanismDTO {
    const id = `mech-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const mech = new IDEF9EnforcementMechanism({
      id,
      name: cmd.name,
      mechanismType: cmd.mechanismType,
      description: cmd.description,
      position: new Position(cmd.x ?? 550, cmd.y ?? 100),
    });
    this._model.activeDiagram.addEnforcementMechanism(mech);
    this.syncRenderer();
    return this.toEnforcementMechanismDTO(mech);
  }

  public removeEnforcementMechanism(id: string): void {
    this._model.activeDiagram.removeEnforcementMechanism(id);
    this.syncRenderer();
  }

  // Source Documents
  public addSourceDocument(cmd: CreateSourceDocumentCommand): SourceDocumentDTO {
    const id = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const doc = new IDEF9SourceDocument({
      id,
      code: cmd.code,
      name: cmd.name,
      documentType: cmd.documentType,
      description: cmd.description,
      position: new Position(cmd.x ?? 50, cmd.y ?? 300),
    });
    this._model.activeDiagram.addSourceDocument(doc);
    this.syncRenderer();
    return this.toSourceDocumentDTO(doc);
  }

  public removeSourceDocument(id: string): void {
    this._model.activeDiagram.removeSourceDocument(id);
    this.syncRenderer();
  }

  // Links
  public addLink(cmd: CreateIDEF9LinkCommand): LinkDTO {
    const id = `link-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const link = new IDEF9Link({
      id,
      sourceId: cmd.sourceId,
      targetId: cmd.targetId,
      type: cmd.type,
      label: cmd.label,
    });
    this._model.activeDiagram.addLink(link);
    this.syncRenderer();
    return this.toLinkDTO(link);
  }

  public removeLink(id: string): void {
    this._model.activeDiagram.removeLink(id);
    this.syncRenderer();
  }

  public validateCurrentDiagram(): IDEF9ValidationIssue[] {
    return IDEF9Rules.validate(this._model.activeDiagram);
  }

  public autoLayout(): void {
    if (this._renderer) {
      this._renderer.autoLayout();
    }
  }

  public exportJSON(): string {
    return JSON.stringify(this._model.toJSON(), null, 2);
  }

  public importJSON(jsonString: string): void {
    const parsed = JSON.parse(jsonString);
    this._model = IDEF9Model.fromJSON(parsed);
    this.syncRenderer();
  }

  public syncRenderer(): void {
    if (this._renderer) {
      this._renderer.renderDiagram(this.getActiveDiagram());
    }
  }

  // DTO Mappings
  private toConstraintDTO(c: IDEF9Constraint): ConstraintDTO {
    return {
      id: c.id,
      code: c.code,
      name: c.name,
      statement: c.statement,
      constraintType: c.constraintType,
      severity: c.severity,
      status: c.status,
      x: c.position.x,
      y: c.position.y,
    };
  }

  private toControlledObjectDTO(o: IDEF9ControlledObject): ControlledObjectDTO {
    return {
      id: o.id,
      name: o.name,
      objectType: o.objectType,
      description: o.description,
      x: o.position.x,
      y: o.position.y,
    };
  }

  private toEnforcementMechanismDTO(m: IDEF9EnforcementMechanism): EnforcementMechanismDTO {
    return {
      id: m.id,
      name: m.name,
      mechanismType: m.mechanismType,
      description: m.description,
      x: m.position.x,
      y: m.position.y,
    };
  }

  private toSourceDocumentDTO(d: IDEF9SourceDocument): SourceDocumentDTO {
    return {
      id: d.id,
      code: d.code,
      name: d.name,
      documentType: d.documentType,
      description: d.description,
      x: d.position.x,
      y: d.position.y,
    };
  }

  private toLinkDTO(l: IDEF9Link): LinkDTO {
    return {
      id: l.id,
      sourceId: l.sourceId,
      targetId: l.targetId,
      type: l.type,
      label: l.label,
    };
  }

  private toDiagramDTO(d: IDEF9Diagram): DiagramDTO {
    return {
      id: d.id,
      name: d.name,
      description: d.description,
      constraints: d.constraints.map((c) => this.toConstraintDTO(c)),
      controlledObjects: d.controlledObjects.map((o) => this.toControlledObjectDTO(o)),
      enforcementMechanisms: d.enforcementMechanisms.map((m) => this.toEnforcementMechanismDTO(m)),
      sourceDocuments: d.sourceDocuments.map((doc) => this.toSourceDocumentDTO(doc)),
      links: d.links.map((l) => this.toLinkDTO(l)),
    };
  }

  private toModelDTO(m: IDEF9Model): ModelDTO {
    return {
      id: m.id,
      name: m.name,
      version: m.version,
      activeDiagramId: m.activeDiagram.id,
      diagrams: m.diagrams.map((d) => this.toDiagramDTO(d)),
    };
  }
}
