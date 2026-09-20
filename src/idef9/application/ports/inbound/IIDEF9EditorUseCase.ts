import {
  ConstraintDTO,
  ControlledObjectDTO,
  EnforcementMechanismDTO,
  SourceDocumentDTO,
  LinkDTO,
  DiagramDTO,
  ModelDTO,
} from '../../dtos/IDEF9DTO';
import { ConstraintType, ConstraintSeverity, ConstraintStatus } from '../../../domain/models/IDEF9Constraint';
import { ControlledObjectType } from '../../../domain/models/IDEF9ControlledObject';
import { MechanismType } from '../../../domain/models/IDEF9EnforcementMechanism';
import { DocumentType } from '../../../domain/models/IDEF9SourceDocument';
import { ConstraintLinkType } from '../../../domain/models/IDEF9Link';
import { IDEF9ValidationIssue } from '../../../domain/rules/IDEF9Rules';

export interface CreateConstraintCommand {
  code: string;
  name: string;
  statement: string;
  constraintType?: ConstraintType;
  severity?: ConstraintSeverity;
  status?: ConstraintStatus;
  x?: number;
  y?: number;
}

export interface CreateControlledObjectCommand {
  name: string;
  objectType?: ControlledObjectType;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateEnforcementMechanismCommand {
  name: string;
  mechanismType?: MechanismType;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateSourceDocumentCommand {
  code: string;
  name: string;
  documentType?: DocumentType;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateIDEF9LinkCommand {
  sourceId: string;
  targetId: string;
  type: ConstraintLinkType;
  label?: string;
}

export interface IIDEF9EditorUseCase {
  createModel(id: string, name: string): void;
  loadModel(modelId: string): Promise<ModelDTO>;
  saveModel(): Promise<void>;
  getActiveDiagram(): DiagramDTO;
  setActiveDiagram(diagramId: string): void;

  addConstraint(cmd: CreateConstraintCommand): ConstraintDTO;
  updateConstraint(id: string, name: string, status?: ConstraintStatus): void;
  removeConstraint(id: string): void;

  addControlledObject(cmd: CreateControlledObjectCommand): ControlledObjectDTO;
  removeControlledObject(id: string): void;

  addEnforcementMechanism(cmd: CreateEnforcementMechanismCommand): EnforcementMechanismDTO;
  removeEnforcementMechanism(id: string): void;

  addSourceDocument(cmd: CreateSourceDocumentCommand): SourceDocumentDTO;
  removeSourceDocument(id: string): void;

  addLink(cmd: CreateIDEF9LinkCommand): LinkDTO;
  removeLink(id: string): void;

  validateCurrentDiagram(): IDEF9ValidationIssue[];
  autoLayout(): void;
  exportJSON(): string;
  importJSON(jsonString: string): void;
}
