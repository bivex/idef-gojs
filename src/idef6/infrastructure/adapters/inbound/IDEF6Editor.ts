import { GoJSIDEF6Adapter } from '../outbound/gojs/GoJSIDEF6Adapter';
import { IDEF6ApplicationService } from '../../../application/services/IDEF6ApplicationService';
import type {
  CreateIssueCommand,
  CreateAlternativeCommand,
  CreateCriterionCommand,
  CreateArgumentCommand,
  CreateLinkCommand,
} from '../../../application/ports/inbound/IIDEF6EditorUseCase';
import type {
  DiagramDTO,
  IssueDTO,
  AlternativeDTO,
  CriterionDTO,
  ArgumentDTO,
  LinkDTO,
} from '../../../application/dtos/IDEF6DTO';
import type { IDEF6ValidationIssue } from '../../../domain/rules/IDEF6Rules';
import { IssueStatus } from '../../../domain/models/IDEF6Issue';
import { AlternativeStatus } from '../../../domain/models/IDEF6Alternative';

export class IDEF6Editor {
  private readonly _adapter: GoJSIDEF6Adapter;
  private readonly _service: IDEF6ApplicationService;
  private _onDiagramChanged?: (diagram: DiagramDTO) => void;

  constructor() {
    this._adapter = new GoJSIDEF6Adapter();
    this._service = new IDEF6ApplicationService(this._adapter);
  }

  public initialize(container: HTMLElement | string): void {
    this._adapter.initialize(container);
    this._service.syncRenderer();
  }

  public setOnDiagramChanged(cb: (diagram: DiagramDTO) => void): void {
    this._onDiagramChanged = cb;
  }

  public createModel(id: string, name: string): void {
    this._service.createModel(id, name);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public getActiveDiagram(): DiagramDTO {
    return this._service.getActiveDiagram();
  }

  public setActiveDiagram(id: string): void {
    this._service.setActiveDiagram(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addIssue(cmd: CreateIssueCommand): IssueDTO {
    const res = this._service.addIssue(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public updateIssue(id: string, name: string, status?: IssueStatus): void {
    this._service.updateIssue(id, name, status);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public removeIssue(id: string): void {
    this._service.removeIssue(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addAlternative(cmd: CreateAlternativeCommand): AlternativeDTO {
    const res = this._service.addAlternative(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public updateAlternative(id: string, name: string, status?: AlternativeStatus): void {
    this._service.updateAlternative(id, name, status);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public removeAlternative(id: string): void {
    this._service.removeAlternative(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addCriterion(cmd: CreateCriterionCommand): CriterionDTO {
    const res = this._service.addCriterion(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeCriterion(id: string): void {
    this._service.removeCriterion(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addArgument(cmd: CreateArgumentCommand): ArgumentDTO {
    const res = this._service.addArgument(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeArgument(id: string): void {
    this._service.removeArgument(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addLink(cmd: CreateLinkCommand): LinkDTO {
    const res = this._service.addLink(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeLink(id: string): void {
    this._service.removeLink(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public validate(): IDEF6ValidationIssue[] {
    return this._service.validateCurrentDiagram();
  }

  public autoLayout(): void {
    this._adapter.autoLayout();
  }

  public zoomToFit(): void {
    this._adapter.zoomToFit();
  }

  public exportJSON(): string {
    return this._service.exportJSON();
  }

  public importJSON(json: string): void {
    this._service.importJSON(json);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public destroy(): void {
    this._adapter.destroy();
  }
}
