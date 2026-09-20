import { RelationshipType, Cardinality } from '../../domain/models/Relationship';

export interface AttributeDTO {
  name: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  dataType: string;
  roleName?: string;
  isOptional?: boolean;
  alternateKeyIndex?: number | number[];
}

export interface EntityDTO {
  id: string;
  name: string;
  number: number;
  isDependent: boolean;
  position: { x: number; y: number };
  attributes: AttributeDTO[];
}

export interface RelationshipDTO {
  id: string;
  name: string;
  inverseName?: string;
  roleName?: string;
  parentEntityId: string;
  childEntityId: string;
  type: RelationshipType;
  cardinality: Cardinality;
  cardinalityValue?: string;
  isOptional?: boolean;
}

export interface CategorizationDTO {
  id: string;
  genericEntityId: string;
  discriminatorAttributeName: string;
  specificEntityIds: string[];
  isComplete: boolean;
}

export interface ModelDTO {
  id: string;
  name: string;
  entities: EntityDTO[];
  relationships: RelationshipDTO[];
  categorizations: CategorizationDTO[];
}
