import { GoJSIDEF0Adapter } from '../outbound/gojs/GoJSIDEF0Adapter';
import { IDEF0ApplicationService } from '../../../application/services/IDEF0ApplicationService';
import type {
  CreateActivityCommand,
  CreateArrowCommand,
  DecomposeActivityCommand,
} from '../../../application/ports/inbound/IIDEF0EditorUseCase';
import type { DiagramDTO, ActivityDTO, ArrowDTO } from '../../../application/dtos/IDEF0DTO';
import type { IDEF0ValidationIssue } from '../../../domain/rules/IDEF0Rules';

export class IDEF0Editor {
  private readonly _adapter: GoJSIDEF0Adapter;
  private readonly _service: IDEF0ApplicationService;
  private _onDiagramChanged?: (diagram: DiagramDTO) => void;

  constructor() {
    this._adapter = new GoJSIDEF0Adapter();
    this._service = new IDEF0ApplicationService(this._adapter);
  }

  public initialize(container: HTMLElement | string): void {
    this._adapter.initialize(container);

    // Double-click on activity: automatic drill-down if decomposed
    this._adapter.setSelectionListeners({
      onActivityDoubleClicked: (activityId: string) => {
        const drilled = this.drillDown(activityId);
        if (drilled && this._onDiagramChanged) {
          this._onDiagramChanged(this.getActiveDiagram());
        }
      },
    });

    this._service.syncRenderer();
  }

  public setOnDiagramChanged(callback: (diagram: DiagramDTO) => void): void {
    this._onDiagramChanged = callback;
  }

  public createModel(id: string, name: string): void {
    this._service.createModel(id, name);
    if (this._onDiagramChanged) {
      this._onDiagramChanged(this.getActiveDiagram());
    }
  }

  public getActiveDiagram(): DiagramDTO {
    return this._service.getActiveDiagram();
  }

  public setActiveDiagram(diagramId: string): void {
    this._service.setActiveDiagram(diagramId);
    if (this._onDiagramChanged) {
      this._onDiagramChanged(this.getActiveDiagram());
    }
  }

  public drillDown(activityId: string): boolean {
    const res = this._service.drillDown(activityId);
    if (res && this._onDiagramChanged) {
      this._onDiagramChanged(this.getActiveDiagram());
    }
    return res;
  }

  public drillUp(): boolean {
    const res = this._service.drillUp();
    if (res && this._onDiagramChanged) {
      this._onDiagramChanged(this.getActiveDiagram());
    }
    return res;
  }

  public addActivity(cmd: CreateActivityCommand): ActivityDTO {
    return this._service.addActivity(cmd);
  }

  public removeActivity(activityId: string): void {
    this._service.removeActivity(activityId);
  }

  public addArrow(cmd: CreateArrowCommand): ArrowDTO {
    return this._service.addArrow(cmd);
  }

  public removeArrow(arrowId: string): void {
    this._service.removeArrow(arrowId);
  }

  public decomposeActivity(cmd: DecomposeActivityCommand): DiagramDTO {
    const child = this._service.decomposeActivity(cmd);
    if (this._onDiagramChanged) {
      this._onDiagramChanged(this.getActiveDiagram());
    }
    return child;
  }

  public validate(): IDEF0ValidationIssue[] {
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

  public importJSON(jsonString: string): void {
    this._service.importJSON(jsonString);
    if (this._onDiagramChanged) {
      this._onDiagramChanged(this.getActiveDiagram());
    }
  }

  public destroy(): void {
    this._adapter.destroy();
  }
}
