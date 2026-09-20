import { GoJSIDEF5Adapter } from '../outbound/gojs/GoJSIDEF5Adapter';
import { IDEF5ApplicationService } from '../../../application/services/IDEF5ApplicationService';
import type {
  CreateKindCommand,
  CreateRelationCommand,
} from '../../../application/ports/inbound/IIDEF5EditorUseCase';
import type { DiagramDTO, KindDTO, RelationDTO } from '../../../application/dtos/IDEF5DTO';
import type { IDEF5ValidationIssue } from '../../../domain/rules/IDEF5Rules';

export class IDEF5Editor {
  private readonly _adapter: GoJSIDEF5Adapter;
  private readonly _service: IDEF5ApplicationService;
  private _onDiagramChanged?: (diagram: DiagramDTO) => void;

  constructor() {
    this._adapter = new GoJSIDEF5Adapter();
    this._service = new IDEF5ApplicationService(this._adapter);
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

  public addKind(cmd: CreateKindCommand): KindDTO {
    const res = this._service.addKind(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public updateKind(kindId: string, name: string): void {
    this._service.updateKind(kindId, name);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public removeKind(kindId: string): void {
    this._service.removeKind(kindId);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public addRelation(cmd: CreateRelationCommand): RelationDTO {
    const res = this._service.addRelation(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public removeRelation(relationId: string): void {
    this._service.removeRelation(relationId);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
  }

  public validate(): IDEF5ValidationIssue[] {
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
