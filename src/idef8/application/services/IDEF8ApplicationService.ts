import {
  IIDEF8EditorUseCase,
  CreateScreenCommand,
  CreateUserActionCommand,
  CreateSystemResponseCommand,
  CreateUserRoleCommand,
  CreateIDEF8LinkCommand,
} from '../ports/inbound/IIDEF8EditorUseCase';
import {
  ScreenDTO,
  UserActionDTO,
  SystemResponseDTO,
  UserRoleDTO,
  LinkDTO,
  DiagramDTO,
  ModelDTO,
} from '../dtos/IDEF8DTO';
import { IIDEF8DiagramRendererPort } from '../ports/outbound/IIDEF8DiagramRendererPort';
import { IIDEF8ModelRepositoryPort } from '../ports/outbound/IIDEF8ModelRepositoryPort';
import { IDEF8Model } from '../../domain/models/IDEF8Model';
import { IDEF8Diagram } from '../../domain/models/IDEF8Diagram';
import { IDEF8Screen, ScreenState } from '../../domain/models/IDEF8Screen';
import { IDEF8UserAction } from '../../domain/models/IDEF8UserAction';
import { IDEF8SystemResponse } from '../../domain/models/IDEF8SystemResponse';
import { IDEF8UserRole } from '../../domain/models/IDEF8UserRole';
import { IDEF8Link } from '../../domain/models/IDEF8Link';
import { Position } from '../../../domain/models/Position';
import { IDEF8Rules, IDEF8ValidationIssue } from '../../domain/rules/IDEF8Rules';
import { ScreenNotFoundError } from '../../domain/errors/IDEF8Error';

export class IDEF8ApplicationService implements IIDEF8EditorUseCase {
  private _model: IDEF8Model;
  private readonly _renderer?: IIDEF8DiagramRendererPort;
  private readonly _repository?: IIDEF8ModelRepositoryPort;

  constructor(
    renderer?: IIDEF8DiagramRendererPort,
    repository?: IIDEF8ModelRepositoryPort
  ) {
    this._renderer = renderer;
    this._repository = repository;
    this._model = new IDEF8Model({
      id: 'hmi-model-default',
      name: 'Default HMI Interaction Model',
    });
  }

  public createModel(id: string, name: string): void {
    this._model = new IDEF8Model({ id, name });
    this.syncRenderer();
  }

  public async loadModel(modelId: string): Promise<ModelDTO> {
    if (!this._repository) throw new Error('Repository port not configured.');
    const loaded = await this._repository.findById(modelId);
    if (!loaded) throw new Error(`IDEF8 Model "${modelId}" not found.`);
    this._model = loaded;
    this.syncRenderer();
    return this.toModelDTO(this._model);
  }

  public async saveModel(): Promise<void> {
    if (this._repository) {
      await this._repository.save(this._model);
    }
  }

  public getActiveDiagram(): DiagramDTO {
    return this.toDiagramDTO(this._model.activeDiagram);
  }

  public setActiveDiagram(diagramId: string): void {
    this._model.setActiveDiagram(diagramId);
    this.syncRenderer();
  }

  public addScreen(cmd: CreateScreenCommand): ScreenDTO {
    const id = `screen-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const screen = new IDEF8Screen({
      id,
      name: cmd.name,
      description: cmd.description,
      screenType: cmd.screenType,
      state: cmd.state,
      widgets: cmd.widgets,
      position: new Position(cmd.x ?? 100, cmd.y ?? 100),
    });
    this._model.activeDiagram.addScreen(screen);
    this.syncRenderer();
    return this.toScreenDTO(screen);
  }

  public updateScreen(id: string, name: string, state?: ScreenState): void {
    const screen = this._model.activeDiagram.getScreen(id);
    if (!screen) throw new ScreenNotFoundError(id);
    screen.rename(name);
    if (state) screen.setState(state);
    this.syncRenderer();
  }

  public removeScreen(id: string): void {
    this._model.activeDiagram.removeScreen(id);
    this.syncRenderer();
  }

  public addUserAction(cmd: CreateUserActionCommand): UserActionDTO {
    const id = `action-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const action = new IDEF8UserAction({
      id,
      name: cmd.name,
      modality: cmd.modality,
      targetWidgetId: cmd.targetWidgetId,
      description: cmd.description,
      position: new Position(cmd.x ?? 300, cmd.y ?? 100),
    });
    this._model.activeDiagram.addUserAction(action);
    this.syncRenderer();
    return this.toUserActionDTO(action);
  }

  public removeUserAction(id: string): void {
    this._model.activeDiagram.removeUserAction(id);
    this.syncRenderer();
  }

  public addSystemResponse(cmd: CreateSystemResponseCommand): SystemResponseDTO {
    const id = `resp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const response = new IDEF8SystemResponse({
      id,
      name: cmd.name,
      responseType: cmd.responseType,
      description: cmd.description,
      position: new Position(cmd.x ?? 550, cmd.y ?? 100),
    });
    this._model.activeDiagram.addSystemResponse(response);
    this.syncRenderer();
    return this.toSystemResponseDTO(response);
  }

  public removeSystemResponse(id: string): void {
    this._model.activeDiagram.removeSystemResponse(id);
    this.syncRenderer();
  }

  public addUserRole(cmd: CreateUserRoleCommand): UserRoleDTO {
    const id = `role-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const role = new IDEF8UserRole({
      id,
      name: cmd.name,
      privilegeLevel: cmd.privilegeLevel,
      description: cmd.description,
      position: new Position(cmd.x ?? 50, cmd.y ?? 50),
    });
    this._model.activeDiagram.addUserRole(role);
    this.syncRenderer();
    return this.toUserRoleDTO(role);
  }

  public removeUserRole(id: string): void {
    this._model.activeDiagram.removeUserRole(id);
    this.syncRenderer();
  }

  public addLink(cmd: CreateIDEF8LinkCommand): LinkDTO {
    const id = `link-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const link = new IDEF8Link({
      id,
      sourceId: cmd.sourceId,
      targetId: cmd.targetId,
      type: cmd.type,
      label: cmd.label,
    });
    this._model.activeDiagram.addLink(link);
    this.syncRenderer();
    return this.toLinkDTO(link);
  }

  public removeLink(id: string): void {
    this._model.activeDiagram.removeLink(id);
    this.syncRenderer();
  }

  public validateCurrentDiagram(): IDEF8ValidationIssue[] {
    return IDEF8Rules.validate(this._model.activeDiagram);
  }

  public autoLayout(): void {
    if (this._renderer) {
      this._renderer.autoLayout();
    }
  }

  public exportJSON(): string {
    return JSON.stringify(this._model.toJSON(), null, 2);
  }

  public importJSON(jsonString: string): void {
    const parsed = JSON.parse(jsonString);
    this._model = IDEF8Model.fromJSON(parsed);
    this.syncRenderer();
  }

  public syncRenderer(): void {
    if (this._renderer) {
      this._renderer.renderDiagram(this.getActiveDiagram());
    }
  }

  // DTO Mappings
  private toScreenDTO(s: IDEF8Screen): ScreenDTO {
    return {
      id: s.id,
      name: s.name,
      description: s.description,
      screenType: s.screenType,
      state: s.state,
      widgets: [...s.widgets],
      x: s.position.x,
      y: s.position.y,
    };
  }

  private toUserActionDTO(a: IDEF8UserAction): UserActionDTO {
    return {
      id: a.id,
      name: a.name,
      modality: a.modality,
      targetWidgetId: a.targetWidgetId,
      description: a.description,
      x: a.position.x,
      y: a.position.y,
    };
  }

  private toSystemResponseDTO(r: IDEF8SystemResponse): SystemResponseDTO {
    return {
      id: r.id,
      name: r.name,
      responseType: r.responseType,
      description: r.description,
      x: r.position.x,
      y: r.position.y,
    };
  }

  private toUserRoleDTO(role: IDEF8UserRole): UserRoleDTO {
    return {
      id: role.id,
      name: role.name,
      privilegeLevel: role.privilegeLevel,
      description: role.description,
      x: role.position.x,
      y: role.position.y,
    };
  }

  private toLinkDTO(l: IDEF8Link): LinkDTO {
    return {
      id: l.id,
      sourceId: l.sourceId,
      targetId: l.targetId,
      type: l.type,
      label: l.label,
    };
  }

  private toDiagramDTO(d: IDEF8Diagram): DiagramDTO {
    return {
      id: d.id,
      name: d.name,
      description: d.description,
      screens: d.screens.map((s) => this.toScreenDTO(s)),
      userActions: d.userActions.map((a) => this.toUserActionDTO(a)),
      systemResponses: d.systemResponses.map((r) => this.toSystemResponseDTO(r)),
      userRoles: d.userRoles.map((role) => this.toUserRoleDTO(role)),
      links: d.links.map((l) => this.toLinkDTO(l)),
    };
  }

  private toModelDTO(m: IDEF8Model): ModelDTO {
    return {
      id: m.id,
      name: m.name,
      version: m.version,
      activeDiagramId: m.activeDiagram.id,
      diagrams: m.diagrams.map((d) => this.toDiagramDTO(d)),
    };
  }
}
