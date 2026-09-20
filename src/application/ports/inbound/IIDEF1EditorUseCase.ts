import { ModelDTO } from '../../dtos/ModelDTO';
import { RelationshipType, Cardinality } from '../../../domain/models/Relationship';

export interface CreateEntityParams {
  id?: string;
  name: string;
  number?: number;
  isDependent?: boolean;
  position?: { x: number; y: number };
}

export interface AddAttributeParams {
  entityId: string;
  name: string;
  isPrimaryKey?: boolean;
  dataType?: string;
  roleName?: string;
  isOptional?: boolean;
  alternateKeyIndex?: number | number[];
}

export interface AddRelationshipParams {
  id?: string;
  name?: string;
  inverseName?: string;
  roleName?: string;
  parentEntityId: string;
  childEntityId: string;
  type?: RelationshipType;
  cardinality?: Cardinality;
  cardinalityValue?: string;
  isOptional?: boolean;
}

export interface AddCategorizationParams {
  id?: string;
  genericEntityId: string;
  discriminatorAttributeName: string;
  specificEntityIds: string[];
  isComplete?: boolean;
}

export interface IIDEF1EditorUseCase {
  getModel(): ModelDTO;
  createEntity(params: CreateEntityParams): Promise<string>;
  renameEntity(entityId: string, newName: string): Promise<void>;
  setEntityDependent(entityId: string, isDependent: boolean): Promise<void>;
  updateEntityPosition(entityId: string, position: { x: number; y: number }): Promise<void>;
  removeEntity(entityId: string): Promise<void>;

  addAttribute(params: AddAttributeParams): Promise<void>;
  removeAttribute(entityId: string, attributeName: string): Promise<void>;

  addRelationship(params: AddRelationshipParams): Promise<string>;
  removeRelationship(relationshipId: string): Promise<void>;

  addCategorization(params: AddCategorizationParams): Promise<string>;

  save(): Promise<void>;
  load(modelId: string): Promise<void>;
  exportJson(): string;
  importJson(jsonString: string): Promise<void>;
}
