import { GoJSIDEF9Adapter } from '../outbound/gojs/GoJSIDEF9Adapter';
import { IDEF9ApplicationService } from '../../../application/services/IDEF9ApplicationService';
import type {
  CreateConstraintCommand,
  CreateControlledObjectCommand,
  CreateEnforcementMechanismCommand,
  CreateSourceDocumentCommand,
  CreateIDEF9LinkCommand,
} from '../../../application/ports/inbound/IIDEF9EditorUseCase';
import type {
  DiagramDTO,
  ConstraintDTO,
  ControlledObjectDTO,
  EnforcementMechanismDTO,
  SourceDocumentDTO,
  LinkDTO,
} from '../../../application/dtos/IDEF9DTO';
import type { IDEF9ValidationIssue } from '../../../domain/rules/IDEF9Rules';
import { ConstraintStatus } from '../../../domain/models/IDEF9Constraint';

export class IDEF9Editor {
  private readonly _adapter: GoJSIDEF9Adapter;
  private readonly _service: IDEF9ApplicationService;
  private _onDiagramChanged?: (diagram: DiagramDTO) => void;

  constructor() {
    this._adapter = new GoJSIDEF9Adapter();
    this._service = new IDEF9ApplicationService(this._adapter);
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

  public addConstraint(cmd: CreateConstraintCommand): ConstraintDTO {
    const res = this._service.addConstraint(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public updateConstraint(id: string, name: string, status?: ConstraintStatus): void {
    this._service.updateConstraint(id, name, status);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public removeConstraint(id: string): void {
    this._service.removeConstraint(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addControlledObject(cmd: CreateControlledObjectCommand): ControlledObjectDTO {
    const res = this._service.addControlledObject(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeControlledObject(id: string): void {
    this._service.removeControlledObject(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addEnforcementMechanism(cmd: CreateEnforcementMechanismCommand): EnforcementMechanismDTO {
    const res = this._service.addEnforcementMechanism(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeEnforcementMechanism(id: string): void {
    this._service.removeEnforcementMechanism(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addSourceDocument(cmd: CreateSourceDocumentCommand): SourceDocumentDTO {
    const res = this._service.addSourceDocument(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeSourceDocument(id: string): void {
    this._service.removeSourceDocument(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addLink(cmd: CreateIDEF9LinkCommand): LinkDTO {
    const res = this._service.addLink(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeLink(id: string): void {
    this._service.removeLink(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public validate(): IDEF9ValidationIssue[] {
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
