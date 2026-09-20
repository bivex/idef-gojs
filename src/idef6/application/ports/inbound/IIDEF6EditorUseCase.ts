import {
  IssueDTO,
  AlternativeDTO,
  CriterionDTO,
  ArgumentDTO,
  LinkDTO,
  DiagramDTO,
  ModelDTO,
} from '../../dtos/IDEF6DTO';
import { IssueStatus, IssuePriority } from '../../../domain/models/IDEF6Issue';
import { AlternativeStatus } from '../../../domain/models/IDEF6Alternative';
import { CriterionType, CriterionWeight } from '../../../domain/models/IDEF6Criterion';
import { ArgumentType, ArgumentStrength } from '../../../domain/models/IDEF6Argument';
import { RationaleLinkType } from '../../../domain/models/IDEF6Link';
import { IDEF6ValidationIssue } from '../../../domain/rules/IDEF6Rules';

export interface CreateIssueCommand {
  name: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  x?: number;
  y?: number;
}

export interface CreateAlternativeCommand {
  name: string;
  description?: string;
  status?: AlternativeStatus;
  x?: number;
  y?: number;
}

export interface CreateCriterionCommand {
  name: string;
  description?: string;
  type?: CriterionType;
  weight?: CriterionWeight;
  x?: number;
  y?: number;
}

export interface CreateArgumentCommand {
  name: string;
  type: ArgumentType;
  strength?: ArgumentStrength;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateLinkCommand {
  sourceId: string;
  targetId: string;
  type: RationaleLinkType;
  label?: string;
  weight?: number;
}

export interface IIDEF6EditorUseCase {
  createModel(id: string, name: string): void;
  loadModel(modelId: string): Promise<ModelDTO>;
  saveModel(): Promise<void>;
  getActiveDiagram(): DiagramDTO;
  setActiveDiagram(diagramId: string): void;
  addIssue(cmd: CreateIssueCommand): IssueDTO;
  updateIssue(id: string, name: string, status?: IssueStatus): void;
  removeIssue(id: string): void;
  addAlternative(cmd: CreateAlternativeCommand): AlternativeDTO;
  updateAlternative(id: string, name: string, status?: AlternativeStatus): void;
  removeAlternative(id: string): void;
  addCriterion(cmd: CreateCriterionCommand): CriterionDTO;
  removeCriterion(id: string): void;
  addArgument(cmd: CreateArgumentCommand): ArgumentDTO;
  removeArgument(id: string): void;
  addLink(cmd: CreateLinkCommand): LinkDTO;
  removeLink(id: string): void;
  validateCurrentDiagram(): IDEF6ValidationIssue[];
  autoLayout(): void;
  exportJSON(): string;
  importJSON(jsonString: string): void;
}
