import {
  ScreenDTO,
  UserActionDTO,
  SystemResponseDTO,
  UserRoleDTO,
  LinkDTO,
  DiagramDTO,
  ModelDTO,
} from '../../dtos/IDEF8DTO';
import { ScreenType, ScreenState, UIWidget } from '../../../domain/models/IDEF8Screen';
import { ActionModality } from '../../../domain/models/IDEF8UserAction';
import { ResponseType } from '../../../domain/models/IDEF8SystemResponse';
import { PrivilegeLevel } from '../../../domain/models/IDEF8UserRole';
import { InteractionLinkType } from '../../../domain/models/IDEF8Link';
import { IDEF8ValidationIssue } from '../../../domain/rules/IDEF8Rules';

export interface CreateScreenCommand {
  name: string;
  description?: string;
  screenType?: ScreenType;
  state?: ScreenState;
  widgets?: UIWidget[];
  x?: number;
  y?: number;
}

export interface CreateUserActionCommand {
  name: string;
  modality?: ActionModality;
  targetWidgetId?: string;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateSystemResponseCommand {
  name: string;
  responseType?: ResponseType;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateUserRoleCommand {
  name: string;
  privilegeLevel?: PrivilegeLevel;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateIDEF8LinkCommand {
  sourceId: string;
  targetId: string;
  type: InteractionLinkType;
  label?: string;
}

export interface IIDEF8EditorUseCase {
  createModel(id: string, name: string): void;
  loadModel(modelId: string): Promise<ModelDTO>;
  saveModel(): Promise<void>;
  getActiveDiagram(): DiagramDTO;
  setActiveDiagram(diagramId: string): void;

  addScreen(cmd: CreateScreenCommand): ScreenDTO;
  updateScreen(id: string, name: string, state?: ScreenState): void;
  removeScreen(id: string): void;

  addUserAction(cmd: CreateUserActionCommand): UserActionDTO;
  removeUserAction(id: string): void;

  addSystemResponse(cmd: CreateSystemResponseCommand): SystemResponseDTO;
  removeSystemResponse(id: string): void;

  addUserRole(cmd: CreateUserRoleCommand): UserRoleDTO;
  removeUserRole(id: string): void;

  addLink(cmd: CreateIDEF8LinkCommand): LinkDTO;
  removeLink(id: string): void;

  validateCurrentDiagram(): IDEF8ValidationIssue[];
  autoLayout(): void;
  exportJSON(): string;
  importJSON(jsonString: string): void;
}
