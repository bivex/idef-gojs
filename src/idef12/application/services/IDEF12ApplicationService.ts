import { IIDEF12EditorUseCase } from '../ports/inbound/IIDEF12EditorUseCase';
import { IIDEF12DiagramRendererPort } from '../ports/outbound/IIDEF12DiagramRendererPort';
import { IIDEF12ModelRepositoryPort } from '../ports/outbound/IIDEF12ModelRepositoryPort';
import { IDEF12Model } from '../../domain/models/IDEF12Model';
import { IDEF12Diagram } from '../../domain/models/IDEF12Diagram';
import { IDEF12OrgUnit, IDEF12OrgUnitProps } from '../../domain/models/IDEF12OrgUnit';
import { IDEF12Position, IDEF12PositionProps } from '../../domain/models/IDEF12Position';
import { IDEF12OrgRole, IDEF12OrgRoleProps } from '../../domain/models/IDEF12OrgRole';
import { IDEF12Competency, IDEF12CompetencyProps } from '../../domain/models/IDEF12Competency';
import { IDEF12Link, IDEF12LinkProps } from '../../domain/models/IDEF12Link';
import { IDEF12Rules, IDEF12ValidationIssue } from '../../domain/rules/IDEF12Rules';

export class IDEF12ApplicationService implements IIDEF12EditorUseCase {
  private _model: IDEF12Model;
  private _renderer?: IIDEF12DiagramRendererPort;
  private _repository?: IIDEF12ModelRepositoryPort;
  private _onDiagramChangedCallbacks: Array<(diagram: IDEF12Diagram) => void> = [];

  constructor(renderer?: IIDEF12DiagramRendererPort, repository?: IIDEF12ModelRepositoryPort) {
    this._renderer = renderer;
    this._repository = repository;
    this._model = new IDEF12Model({
      id: 'default-idef12-model',
      name: 'Новая организационная модель (IDEF12)',
    });
  }

  public setRenderer(renderer: IIDEF12DiagramRendererPort): void {
    this._renderer = renderer;
    this.refreshRenderer();
  }

  public get repository(): IIDEF12ModelRepositoryPort | undefined {
    return this._repository;
  }

  public setRepository(repo: IIDEF12ModelRepositoryPort): void {
    this._repository = repo;
  }

  public onDiagramChanged(cb: (diagram: IDEF12Diagram) => void): () => void {
    this._onDiagramChangedCallbacks.push(cb);
    return () => {
      this._onDiagramChangedCallbacks = this._onDiagramChangedCallbacks.filter((c) => c !== cb);
    };
  }

  private notifyDiagramChanged(): void {
    const diag = this.getActiveDiagram();
    this.refreshRenderer();
    for (const cb of this._onDiagramChangedCallbacks) {
      cb(diag);
    }
  }

  private refreshRenderer(): void {
    if (this._renderer) {
      this._renderer.renderDiagram(this.getActiveDiagram());
    }
  }

  public createModel(id: string, name: string): IDEF12Model {
    this._model = new IDEF12Model({ id, name });
    this.notifyDiagramChanged();
    return this._model;
  }

  public getModel(): IDEF12Model {
    return this._model;
  }

  public getActiveDiagram(): IDEF12Diagram {
    return this._model.activeDiagram;
  }

  public setActiveDiagram(diagramId: string): void {
    this._model.setActiveDiagram(diagramId);
    this.notifyDiagramChanged();
  }

  public addOrgUnit(props: IDEF12OrgUnitProps): IDEF12OrgUnit {
    const unit = new IDEF12OrgUnit(props);
    this.getActiveDiagram().addOrgUnit(unit);
    this.notifyDiagramChanged();
    return unit;
  }

  public removeOrgUnit(id: string): void {
    this.getActiveDiagram().removeOrgUnit(id);
    this.notifyDiagramChanged();
  }

  public addPosition(props: IDEF12PositionProps): IDEF12Position {
    const pos = new IDEF12Position(props);
    this.getActiveDiagram().addPosition(pos);
    this.notifyDiagramChanged();
    return pos;
  }

  public removePosition(id: string): void {
    this.getActiveDiagram().removePosition(id);
    this.notifyDiagramChanged();
  }

  public addRole(props: IDEF12OrgRoleProps): IDEF12OrgRole {
    const role = new IDEF12OrgRole(props);
    this.getActiveDiagram().addRole(role);
    this.notifyDiagramChanged();
    return role;
  }

  public removeRole(id: string): void {
    this.getActiveDiagram().removeRole(id);
    this.notifyDiagramChanged();
  }

  public addCompetency(props: IDEF12CompetencyProps): IDEF12Competency {
    const comp = new IDEF12Competency(props);
    this.getActiveDiagram().addCompetency(comp);
    this.notifyDiagramChanged();
    return comp;
  }

  public removeCompetency(id: string): void {
    this.getActiveDiagram().removeCompetency(id);
    this.notifyDiagramChanged();
  }

  public addLink(props: IDEF12LinkProps): IDEF12Link {
    const link = new IDEF12Link(props);
    this.getActiveDiagram().addLink(link);
    this.notifyDiagramChanged();
    return link;
  }

  public removeLink(id: string): void {
    this.getActiveDiagram().removeLink(id);
    this.notifyDiagramChanged();
  }

  public validate(): IDEF12ValidationIssue[] {
    return IDEF12Rules.validateDiagram(this.getActiveDiagram());
  }

  public exportJSON(): string {
    return JSON.stringify(this._model.toJSON(), null, 2);
  }

  public importJSON(jsonString: string): void {
    const parsed = JSON.parse(jsonString);
    this._model = IDEF12Model.fromJSON(parsed);
    this.notifyDiagramChanged();
  }
}
