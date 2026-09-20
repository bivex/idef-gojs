import {
  IIDEF6EditorUseCase,
  CreateIssueCommand,
  CreateAlternativeCommand,
  CreateCriterionCommand,
  CreateArgumentCommand,
  CreateLinkCommand,
} from '../ports/inbound/IIDEF6EditorUseCase';
import { IIDEF6DiagramRendererPort } from '../ports/outbound/IIDEF6DiagramRendererPort';
import { IIDEF6ModelRepositoryPort } from '../ports/outbound/IIDEF6ModelRepositoryPort';
import {
  IssueDTO,
  AlternativeDTO,
  CriterionDTO,
  ArgumentDTO,
  LinkDTO,
  DiagramDTO,
  ModelDTO,
} from '../dtos/IDEF6DTO';
import { IDEF6Model } from '../../domain/models/IDEF6Model';
import { IDEF6Diagram } from '../../domain/models/IDEF6Diagram';
import { IDEF6Issue, IssueStatus } from '../../domain/models/IDEF6Issue';
import { IDEF6Alternative, AlternativeStatus } from '../../domain/models/IDEF6Alternative';
import { IDEF6Criterion } from '../../domain/models/IDEF6Criterion';
import { IDEF6Argument } from '../../domain/models/IDEF6Argument';
import { IDEF6Link } from '../../domain/models/IDEF6Link';
import { Position } from '../../../domain/models/Position';
import { IDEF6Rules, IDEF6ValidationIssue } from '../../domain/rules/IDEF6Rules';

export class IDEF6ApplicationService implements IIDEF6EditorUseCase {
  private _model: IDEF6Model;

  constructor(
    private readonly _renderer: IIDEF6DiagramRendererPort,
    private readonly _repository?: IIDEF6ModelRepositoryPort
  ) {
    this._model = new IDEF6Model({
      id: 'default-idef6-model',
      name: 'Default IDEF6 Design Rationale Model',
    });
  }

  public get model(): IDEF6Model {
    return this._model;
  }

  public createModel(id: string, name: string): void {
    this._model = new IDEF6Model({ id, name });
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

  public addIssue(cmd: CreateIssueCommand): IssueDTO {
    const diag = this._model.activeDiagram;
    const id = `iss-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const issue = new IDEF6Issue({
      id,
      name: cmd.name,
      description: cmd.description,
      status: cmd.status,
      priority: cmd.priority,
      position: cmd.x !== undefined && cmd.y !== undefined ? new Position(cmd.x, cmd.y) : Position.origin(),
    });

    diag.addIssue(issue);
    this.syncRenderer();
    return this.toIssueDTO(issue);
  }

  public updateIssue(id: string, name: string, status?: IssueStatus): void {
    const diag = this._model.activeDiagram;
    const item = diag.getIssue(id);
    item.rename(name);
    if (status) item.setStatus(status);
    this.syncRenderer();
  }

  public removeIssue(id: string): void {
    const diag = this._model.activeDiagram;
    diag.removeIssue(id);
    this.syncRenderer();
  }

  public addAlternative(cmd: CreateAlternativeCommand): AlternativeDTO {
    const diag = this._model.activeDiagram;
    const id = `alt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const alt = new IDEF6Alternative({
      id,
      name: cmd.name,
      description: cmd.description,
      status: cmd.status,
      position: cmd.x !== undefined && cmd.y !== undefined ? new Position(cmd.x, cmd.y) : Position.origin(),
    });

    diag.addAlternative(alt);
    this.syncRenderer();
    return this.toAlternativeDTO(alt);
  }

  public updateAlternative(id: string, name: string, status?: AlternativeStatus): void {
    const diag = this._model.activeDiagram;
    const item = diag.getAlternative(id);
    item.rename(name);
    if (status) item.setStatus(status);
    this.syncRenderer();
  }

  public removeAlternative(id: string): void {
    const diag = this._model.activeDiagram;
    diag.removeAlternative(id);
    this.syncRenderer();
  }

  public addCriterion(cmd: CreateCriterionCommand): CriterionDTO {
    const diag = this._model.activeDiagram;
    const id = `crt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const crit = new IDEF6Criterion({
      id,
      name: cmd.name,
      description: cmd.description,
      type: cmd.type,
      weight: cmd.weight,
      position: cmd.x !== undefined && cmd.y !== undefined ? new Position(cmd.x, cmd.y) : Position.origin(),
    });

    diag.addCriterion(crit);
    this.syncRenderer();
    return this.toCriterionDTO(crit);
  }

  public removeCriterion(id: string): void {
    const diag = this._model.activeDiagram;
    diag.removeCriterion(id);
    this.syncRenderer();
  }

  public addArgument(cmd: CreateArgumentCommand): ArgumentDTO {
    const diag = this._model.activeDiagram;
    const id = `arg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const arg = new IDEF6Argument({
      id,
      name: cmd.name,
      type: cmd.type,
      strength: cmd.strength,
      description: cmd.description,
      position: cmd.x !== undefined && cmd.y !== undefined ? new Position(cmd.x, cmd.y) : Position.origin(),
    });

    diag.addArgument(arg);
    this.syncRenderer();
    return this.toArgumentDTO(arg);
  }

  public removeArgument(id: string): void {
    const diag = this._model.activeDiagram;
    diag.removeArgument(id);
    this.syncRenderer();
  }

  public addLink(cmd: CreateLinkCommand): LinkDTO {
    const diag = this._model.activeDiagram;
    const id = `lnk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const link = new IDEF6Link({
      id,
      sourceId: cmd.sourceId,
      targetId: cmd.targetId,
      type: cmd.type,
      label: cmd.label,
      weight: cmd.weight,
    });

    diag.addLink(link);
    this.syncRenderer();
    return this.toLinkDTO(link);
  }

  public removeLink(id: string): void {
    const diag = this._model.activeDiagram;
    diag.removeLink(id);
    this.syncRenderer();
  }

  public validateCurrentDiagram(): IDEF6ValidationIssue[] {
    return IDEF6Rules.validateDiagram(this._model.activeDiagram);
  }

  public autoLayout(): void {
    this._renderer.autoLayout();
  }

  public exportJSON(): string {
    return JSON.stringify(this._model.toJSON(), null, 2);
  }

  public importJSON(jsonString: string): void {
    const json = JSON.parse(jsonString);
    this._model = IDEF6Model.fromJSON(json);
    this.syncRenderer();
  }

  public syncRenderer(): void {
    this._renderer.render(this.getActiveDiagram());
  }

  private toIssueDTO(i: IDEF6Issue): IssueDTO {
    return {
      id: i.id,
      name: i.name,
      description: i.description,
      status: i.status,
      priority: i.priority,
      x: i.position.x,
      y: i.position.y,
    };
  }

  private toAlternativeDTO(a: IDEF6Alternative): AlternativeDTO {
    return {
      id: a.id,
      name: a.name,
      description: a.description,
      status: a.status,
      x: a.position.x,
      y: a.position.y,
    };
  }

  private toCriterionDTO(c: IDEF6Criterion): CriterionDTO {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      type: c.type,
      weight: c.weight,
      x: c.position.x,
      y: c.position.y,
    };
  }

  private toArgumentDTO(arg: IDEF6Argument): ArgumentDTO {
    return {
      id: arg.id,
      name: arg.name,
      type: arg.type,
      strength: arg.strength,
      description: arg.description,
      x: arg.position.x,
      y: arg.position.y,
    };
  }

  private toLinkDTO(l: IDEF6Link): LinkDTO {
    return {
      id: l.id,
      sourceId: l.sourceId,
      targetId: l.targetId,
      type: l.type,
      label: l.label,
      weight: l.weight,
    };
  }

  private toDiagramDTO(diag: IDEF6Diagram): DiagramDTO {
    return {
      id: diag.id,
      name: diag.name,
      issues: diag.issues.map((i) => this.toIssueDTO(i)),
      alternatives: diag.alternatives.map((a) => this.toAlternativeDTO(a)),
      criteria: diag.criteria.map((c) => this.toCriterionDTO(c)),
      arguments: diag.arguments.map((arg) => this.toArgumentDTO(arg)),
      links: diag.links.map((l) => this.toLinkDTO(l)),
    };
  }

  private toModelDTO(model: IDEF6Model): ModelDTO {
    return {
      id: model.id,
      name: model.name,
      rootDiagramId: model.rootDiagramId,
      activeDiagramId: model.activeDiagramId,
      diagrams: model.diagrams.map((d) => this.toDiagramDTO(d)),
    };
  }
}
