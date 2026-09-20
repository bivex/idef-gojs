import { GoJSIDEF8Adapter } from '../outbound/gojs/GoJSIDEF8Adapter';
import { IDEF8ApplicationService } from '../../../application/services/IDEF8ApplicationService';
import type {
  CreateScreenCommand,
  CreateUserActionCommand,
  CreateSystemResponseCommand,
  CreateUserRoleCommand,
  CreateIDEF8LinkCommand,
} from '../../../application/ports/inbound/IIDEF8EditorUseCase';
import type {
  DiagramDTO,
  ScreenDTO,
  UserActionDTO,
  SystemResponseDTO,
  UserRoleDTO,
  LinkDTO,
} from '../../../application/dtos/IDEF8DTO';
import type { IDEF8ValidationIssue } from '../../../domain/rules/IDEF8Rules';
import { ScreenState } from '../../../domain/models/IDEF8Screen';

export class IDEF8Editor {
  private readonly _adapter: GoJSIDEF8Adapter;
  private readonly _service: IDEF8ApplicationService;
  private _onDiagramChanged?: (diagram: DiagramDTO) => void;

  constructor() {
    this._adapter = new GoJSIDEF8Adapter();
    this._service = new IDEF8ApplicationService(this._adapter);
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

  public addScreen(cmd: CreateScreenCommand): ScreenDTO {
    const res = this._service.addScreen(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public updateScreen(id: string, name: string, state?: ScreenState): void {
    this._service.updateScreen(id, name, state);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public removeScreen(id: string): void {
    this._service.removeScreen(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addUserAction(cmd: CreateUserActionCommand): UserActionDTO {
    const res = this._service.addUserAction(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeUserAction(id: string): void {
    this._service.removeUserAction(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addSystemResponse(cmd: CreateSystemResponseCommand): SystemResponseDTO {
    const res = this._service.addSystemResponse(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeSystemResponse(id: string): void {
    this._service.removeSystemResponse(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addUserRole(cmd: CreateUserRoleCommand): UserRoleDTO {
    const res = this._service.addUserRole(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeUserRole(id: string): void {
    this._service.removeUserRole(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addLink(cmd: CreateIDEF8LinkCommand): LinkDTO {
    const res = this._service.addLink(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeLink(id: string): void {
    this._service.removeLink(id);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public validate(): IDEF8ValidationIssue[] {
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
