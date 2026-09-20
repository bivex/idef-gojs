import { ScreenType, ScreenState, UIWidget } from '../../domain/models/IDEF8Screen';
import { ActionModality } from '../../domain/models/IDEF8UserAction';
import { ResponseType } from '../../domain/models/IDEF8SystemResponse';
import { PrivilegeLevel } from '../../domain/models/IDEF8UserRole';
import { InteractionLinkType } from '../../domain/models/IDEF8Link';

export interface ScreenDTO {
  id: string;
  name: string;
  description?: string;
  screenType: ScreenType;
  state: ScreenState;
  widgets: UIWidget[];
  x: number;
  y: number;
}

export interface UserActionDTO {
  id: string;
  name: string;
  modality: ActionModality;
  targetWidgetId?: string;
  description?: string;
  x: number;
  y: number;
}

export interface SystemResponseDTO {
  id: string;
  name: string;
  responseType: ResponseType;
  description?: string;
  x: number;
  y: number;
}

export interface UserRoleDTO {
  id: string;
  name: string;
  privilegeLevel: PrivilegeLevel;
  description?: string;
  x: number;
  y: number;
}

export interface LinkDTO {
  id: string;
  sourceId: string;
  targetId: string;
  type: InteractionLinkType;
  label?: string;
}

export interface DiagramDTO {
  id: string;
  name: string;
  description?: string;
  screens: ScreenDTO[];
  userActions: UserActionDTO[];
  systemResponses: SystemResponseDTO[];
  userRoles: UserRoleDTO[];
  links: LinkDTO[];
}

export interface ModelDTO {
  id: string;
  name: string;
  version: string;
  activeDiagramId: string;
  diagrams: DiagramDTO[];
}
