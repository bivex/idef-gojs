import { GoJSIDEF4Adapter } from '../outbound/gojs/GoJSIDEF4Adapter';
import { IDEF4ApplicationService } from '../../../application/services/IDEF4ApplicationService';
import type {
  CreateClassCommand,
  CreateRelationshipCommand,
} from '../../../application/ports/inbound/IIDEF4EditorUseCase';
import type { DiagramDTO, ClassDTO, RelationshipDTO } from '../../../application/dtos/IDEF4DTO';
import type { IDEF4ValidationIssue } from '../../../domain/rules/IDEF4Rules';

export class IDEF4Editor {
  private readonly _adapter: GoJSIDEF4Adapter;
  private readonly _service: IDEF4ApplicationService;
  private _onDiagramChanged?: (diagram: DiagramDTO) => void;

  constructor() {
    this._adapter = new GoJSIDEF4Adapter();
    this._service = new IDEF4ApplicationService(this._adapter);
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

  public addClass(cmd: CreateClassCommand): ClassDTO {
    return this._service.addClass(cmd);
  }

  public removeClass(classId: string): void {
    this._service.removeClass(classId);
  }

  public addRelationship(cmd: CreateRelationshipCommand): RelationshipDTO {
    return this._service.addRelationship(cmd);
  }

  public removeRelationship(relationshipId: string): void {
    this._service.removeRelationship(relationshipId);
  }

  public validate(): IDEF4ValidationIssue[] {
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
