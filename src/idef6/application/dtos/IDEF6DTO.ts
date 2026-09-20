import { IssueStatus, IssuePriority } from '../../domain/models/IDEF6Issue';
import { AlternativeStatus } from '../../domain/models/IDEF6Alternative';
import { CriterionType, CriterionWeight } from '../../domain/models/IDEF6Criterion';
import { ArgumentType, ArgumentStrength } from '../../domain/models/IDEF6Argument';
import { RationaleLinkType } from '../../domain/models/IDEF6Link';

export interface IssueDTO {
  id: string;
  name: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  x: number;
  y: number;
}

export interface AlternativeDTO {
  id: string;
  name: string;
  description?: string;
  status: AlternativeStatus;
  x: number;
  y: number;
}

export interface CriterionDTO {
  id: string;
  name: string;
  description?: string;
  type: CriterionType;
  weight: CriterionWeight;
  x: number;
  y: number;
}

export interface ArgumentDTO {
  id: string;
  name: string;
  type: ArgumentType;
  strength: ArgumentStrength;
  description?: string;
  x: number;
  y: number;
}

export interface LinkDTO {
  id: string;
  sourceId: string;
  targetId: string;
  type: RationaleLinkType;
  label?: string;
  weight?: number;
}

export interface DiagramDTO {
  id: string;
  name: string;
  issues: IssueDTO[];
  alternatives: AlternativeDTO[];
  criteria: CriterionDTO[];
  arguments: ArgumentDTO[];
  links: LinkDTO[];
}

export interface ModelDTO {
  id: string;
  name: string;
  rootDiagramId: string;
  activeDiagramId: string;
  diagrams: DiagramDTO[];
}
