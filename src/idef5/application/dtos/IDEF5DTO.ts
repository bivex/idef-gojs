import { OntologyRelationType } from '../../domain/models/IDEF5Relation';
import { SchematicType } from '../../domain/models/IDEF5Diagram';

export interface PropertyDTO {
  name: string;
  valueType?: string;
  isMandatory?: boolean;
  defaultValue?: string;
}

export interface KindDTO {
  id: string;
  name: string;
  description?: string;
  isIndividual: boolean;
  properties: PropertyDTO[];
  x: number;
  y: number;
}

export interface RelationDTO {
  id: string;
  sourceKindId: string;
  targetKindId: string;
  type: OntologyRelationType;
  name?: string;
  isTransitive?: boolean;
  isSymmetric?: boolean;
  isReflexive?: boolean;
}

export interface DiagramDTO {
  id: string;
  name: string;
  schematicType: SchematicType;
  kinds: KindDTO[];
  relations: RelationDTO[];
}

export interface ModelDTO {
  id: string;
  name: string;
  rootDiagramId: string;
  activeDiagramId: string;
  diagrams: DiagramDTO[];
}
