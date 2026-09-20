import { GoJSIDEF10Adapter } from '../outbound/gojs/GoJSIDEF10Adapter';
import { IDEF10ApplicationService } from '../../../application/services/IDEF10ApplicationService';
import type {
  CreateComponentCommand,
  CreateExecutionNodeCommand,
  CreateInterfaceCommand,
  CreateArtifactCommand,
  CreateIDEF10LinkCommand,
} from '../../../application/ports/inbound/IIDEF10EditorUseCase';
import type {
  DiagramDTO,
  ComponentDTO,
  ExecutionNodeDTO,
  InterfaceDTO,
  ArtifactDTO,
  LinkDTO,
} from '../../../application/dtos/IDEF10DTO';
import type { IDEF10ValidationIssue } from '../../../domain/rules/IDEF10Rules';
import { ComponentLifecycle } from '../../../domain/models/IDEF10Component';

export class IDEF10Editor {
  private readonly _adapter: GoJSIDEF10Adapter;
  private readonly _service: IDEF10ApplicationService;
  private _onDiagramChanged?: (diagram: DiagramDTO) => void;

  constructor() {
    this._adapter = new GoJSIDEF10Adapter();
    this._service = new IDEF10ApplicationService(this._adapter);
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

  public addComponent(cmd: CreateComponentCommand): ComponentDTO {
    const res = this._service.addComponent(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public updateComponent(id: string, name: string, lifecycle?: ComponentLifecycle): void {
    this._service.updateComponent(id, name, lifecycle);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public removeComponent(id: string): void {
    this._service.removeComponent(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addExecutionNode(cmd: CreateExecutionNodeCommand): ExecutionNodeDTO {
    const res = this._service.addExecutionNode(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeExecutionNode(id: string): void {
    this._service.removeExecutionNode(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addInterface(cmd: CreateInterfaceCommand): InterfaceDTO {
    const res = this._service.addInterface(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeInterface(id: string): void {
    this._service.removeInterface(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addArtifact(cmd: CreateArtifactCommand): ArtifactDTO {
    const res = this._service.addArtifact(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeArtifact(id: string): void {
    this._service.removeArtifact(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addLink(cmd: CreateIDEF10LinkCommand): LinkDTO {
    const res = this._service.addLink(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeLink(id: string): void {
    this._service.removeLink(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public validate(): IDEF10ValidationIssue[] {
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
