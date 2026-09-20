import { ConstraintType, ConstraintSeverity, ConstraintStatus } from '../../domain/models/IDEF9Constraint';
import { ControlledObjectType } from '../../domain/models/IDEF9ControlledObject';
import { MechanismType } from '../../domain/models/IDEF9EnforcementMechanism';
import { DocumentType } from '../../domain/models/IDEF9SourceDocument';
import { ConstraintLinkType } from '../../domain/models/IDEF9Link';

export interface ConstraintDTO {
  id: string;
  code: string;
  name: string;
  statement: string;
  constraintType: ConstraintType;
  severity: ConstraintSeverity;
  status: ConstraintStatus;
  x: number;
  y: number;
}

export interface ControlledObjectDTO {
  id: string;
  name: string;
  objectType: ControlledObjectType;
  description?: string;
  x: number;
  y: number;
}

export interface EnforcementMechanismDTO {
  id: string;
  name: string;
  mechanismType: MechanismType;
  description?: string;
  x: number;
  y: number;
}

export interface SourceDocumentDTO {
  id: string;
  code: string;
  name: string;
  documentType: DocumentType;
  description?: string;
  x: number;
  y: number;
}

export interface LinkDTO {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConstraintLinkType;
  label?: string;
}

export interface DiagramDTO {
  id: string;
  name: string;
  description?: string;
  constraints: ConstraintDTO[];
  controlledObjects: ControlledObjectDTO[];
  enforcementMechanisms: EnforcementMechanismDTO[];
  sourceDocuments: SourceDocumentDTO[];
  links: LinkDTO[];
}

export interface ModelDTO {
  id: string;
  name: string;
  version: string;
  activeDiagramId: string;
  diagrams: DiagramDTO[];
}
