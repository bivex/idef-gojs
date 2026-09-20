import { GoJSIDEF3Adapter } from '../outbound/gojs/GoJSIDEF3Adapter';
import { IDEF3ApplicationService } from '../../../application/services/IDEF3ApplicationService';
import type {
  CreateUOBCommand,
  CreateJunctionCommand,
  CreateLinkCommand,
  CreateReferentCommand,
  DecomposeUOBCommand,
} from '../../../application/ports/inbound/IIDEF3EditorUseCase';
import type {
  DiagramDTO,
  UOBDTO,
  JunctionDTO,
  LinkDTO,
  ReferentDTO,
} from '../../../application/dtos/IDEF3DTO';
import type { IDEF3ValidationIssue } from '../../../domain/rules/IDEF3Rules';

export class IDEF3Editor {
  private readonly _adapter: GoJSIDEF3Adapter;
  private readonly _service: IDEF3ApplicationService;
  private _onDiagramChanged?: (diagram: DiagramDTO) => void;

  constructor() {
    this._adapter = new GoJSIDEF3Adapter();
    this._service = new IDEF3ApplicationService(this._adapter);
  }

  public initialize(container: HTMLElement | string): void {
    this._adapter.initialize(container);

    this._adapter.setSelectionListeners({
      onUOBDoubleClicked: (uobId: string) => {
        const ok = this.drillDown(uobId);
        if (ok && this._onDiagramChanged) {
          this._onDiagramChanged(this.getActiveDiagram());
        }
      },
    });

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

  public drillDown(uobId: string): boolean {
    const res = this._service.drillDown(uobId);
    if (res && this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public drillUp(): boolean {
    const res = this._service.drillUp();
    if (res && this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public addUOB(cmd: CreateUOBCommand): UOBDTO {
    return this._service.addUOB(cmd);
  }

  public removeUOB(uobId: string): void {
    this._service.removeUOB(uobId);
  }

  public addJunction(cmd: CreateJunctionCommand): JunctionDTO {
    return this._service.addJunction(cmd);
  }

  public removeJunction(junctionId: string): void {
    this._service.removeJunction(junctionId);
  }

  public addLink(cmd: CreateLinkCommand): LinkDTO {
    return this._service.addLink(cmd);
  }

  public removeLink(linkId: string): void {
    this._service.removeLink(linkId);
  }

  public addReferent(cmd: CreateReferentCommand): ReferentDTO {
    return this._service.addReferent(cmd);
  }

  public removeReferent(referentId: string): void {
    this._service.removeReferent(referentId);
  }

  public decomposeUOB(cmd: DecomposeUOBCommand): DiagramDTO {
    const res = this._service.decomposeUOB(cmd);
    if (this._onDiagramChanged) this._onDiagramChanged(this.getActiveDiagram());
    return res;
  }

  public validate(): IDEF3ValidationIssue[] {
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
