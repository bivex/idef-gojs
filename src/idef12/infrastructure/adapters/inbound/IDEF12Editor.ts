import { GoJSIDEF12Adapter } from '../outbound/gojs/GoJSIDEF12Adapter';
import { IDEF12ApplicationService } from '../../../application/services/IDEF12ApplicationService';
import { IDEF12OrgUnitProps, IDEF12OrgUnit } from '../../../domain/models/IDEF12OrgUnit';
import { IDEF12PositionProps, IDEF12Position } from '../../../domain/models/IDEF12Position';
import { IDEF12OrgRoleProps, IDEF12OrgRole } from '../../../domain/models/IDEF12OrgRole';
import { IDEF12CompetencyProps, IDEF12Competency } from '../../../domain/models/IDEF12Competency';
import { IDEF12LinkProps, IDEF12Link } from '../../../domain/models/IDEF12Link';
import { IDEF12ValidationIssue } from '../../../domain/rules/IDEF12Rules';
import { IDEF12Diagram } from '../../../domain/models/IDEF12Diagram';

export class IDEF12Editor {
  private readonly _adapter: GoJSIDEF12Adapter;
  private readonly _service: IDEF12ApplicationService;

  constructor() {
    this._adapter = new GoJSIDEF12Adapter();
    this._service = new IDEF12ApplicationService(this._adapter);
  }

  public initialize(container: HTMLElement | string): void {
    this._adapter.initialize(container);
    this._service.setRenderer(this._adapter);
  }

  public setOnDiagramChanged(cb: (diagram: IDEF12Diagram) => void): () => void {
    return this._service.onDiagramChanged(cb);
  }

  public createModel(id: string, name: string): void {
    this._service.createModel(id, name);
  }

  public getActiveDiagram(): IDEF12Diagram {
    return this._service.getActiveDiagram();
  }

  public setActiveDiagram(id: string): void {
    this._service.setActiveDiagram(id);
  }

  public addOrgUnit(props: IDEF12OrgUnitProps): IDEF12OrgUnit {
    return this._service.addOrgUnit(props);
  }

  public removeOrgUnit(id: string): void {
    this._service.removeOrgUnit(id);
  }

  public addPosition(props: IDEF12PositionProps): IDEF12Position {
    return this._service.addPosition(props);
  }

  public removePosition(id: string): void {
    this._service.removePosition(id);
  }

  public addRole(props: IDEF12OrgRoleProps): IDEF12OrgRole {
    return this._service.addRole(props);
  }

  public removeRole(id: string): void {
    this._service.removeRole(id);
  }

  public addCompetency(props: IDEF12CompetencyProps): IDEF12Competency {
    return this._service.addCompetency(props);
  }

  public removeCompetency(id: string): void {
    this._service.removeCompetency(id);
  }

  public addLink(props: IDEF12LinkProps): IDEF12Link {
    return this._service.addLink(props);
  }

  public removeLink(id: string): void {
    this._service.removeLink(id);
  }

  public autoLayout(): void {
    this._adapter.autoLayout();
  }

  public zoomToFit(): void {
    this._adapter.zoomToFit();
  }

  public exportSVG(): string {
    return this._adapter.exportSVG();
  }

  public validate(): IDEF12ValidationIssue[] {
    return this._service.validate();
  }

  public exportJSON(): string {
    return this._service.exportJSON();
  }

  public importJSON(jsonString: string): void {
    this._service.importJSON(jsonString);
  }

  public destroy(): void {
    this._adapter.destroy();
  }
}
