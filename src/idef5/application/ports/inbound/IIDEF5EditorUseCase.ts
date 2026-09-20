import { KindDTO, RelationDTO, DiagramDTO, ModelDTO, PropertyDTO } from '../../dtos/IDEF5DTO';
import { OntologyRelationType } from '../../../domain/models/IDEF5Relation';
import { IDEF5ValidationIssue } from '../../../domain/rules/IDEF5Rules';

export interface CreateKindCommand {
  name: string;
  description?: string;
  isIndividual?: boolean;
  properties?: PropertyDTO[];
  x?: number;
  y?: number;
}

export interface CreateRelationCommand {
  sourceKindId: string;
  targetKindId: string;
  type: OntologyRelationType;
  name?: string;
  isTransitive?: boolean;
  isSymmetric?: boolean;
  isReflexive?: boolean;
}

export interface IIDEF5EditorUseCase {
  createModel(id: string, name: string): void;
  loadModel(modelId: string): Promise<ModelDTO>;
  saveModel(): Promise<void>;
  getActiveDiagram(): DiagramDTO;
  setActiveDiagram(diagramId: string): void;
  addKind(command: CreateKindCommand): KindDTO;
  updateKind(kindId: string, name: string): void;
  removeKind(kindId: string): void;
  addRelation(command: CreateRelationCommand): RelationDTO;
  removeRelation(relationId: string): void;
  validateCurrentDiagram(): IDEF5ValidationIssue[];
  autoLayout(): void;
  exportJSON(): string;
  importJSON(jsonString: string): void;
}
