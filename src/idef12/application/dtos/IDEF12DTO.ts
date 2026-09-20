import { OrgUnitType } from '../../domain/models/IDEF12OrgUnit';
import { PositionLevel } from '../../domain/models/IDEF12Position';
import { OrgRoleType } from '../../domain/models/IDEF12OrgRole';
import { CompetencyCriticality } from '../../domain/models/IDEF12Competency';
import { OrgLinkType } from '../../domain/models/IDEF12Link';

export interface OrgUnitDTO {
  id: string;
  code: string;
  name: string;
  unitType: OrgUnitType;
  headPositionName?: string;
  headCount: number;
  location?: string;
  x: number;
  y: number;
}

export interface PositionDTO {
  id: string;
  code: string;
  name: string;
  positionLevel: PositionLevel;
  responsibilities: string[];
  grade?: string;
  x: number;
  y: number;
}

export interface OrgRoleDTO {
  id: string;
  code: string;
  name: string;
  roleType: OrgRoleType;
  scope?: string;
  x: number;
  y: number;
}

export interface CompetencyDTO {
  id: string;
  code: string;
  name: string;
  criticality: CompetencyCriticality;
  certificationBody?: string;
  validityMonths?: number;
  x: number;
  y: number;
}

export interface OrgLinkDTO {
  id: string;
  sourceId: string;
  targetId: string;
  type: OrgLinkType;
  label?: string;
}

export interface IDEF12DiagramDTO {
  id: string;
  name: string;
  description?: string;
  orgUnits: OrgUnitDTO[];
  positions: PositionDTO[];
  roles: OrgRoleDTO[];
  competencies: CompetencyDTO[];
  links: OrgLinkDTO[];
}

export interface IDEF12ModelDTO {
  id: string;
  name: string;
  version: string;
  activeDiagramId: string;
  diagrams: IDEF12DiagramDTO[];
}
