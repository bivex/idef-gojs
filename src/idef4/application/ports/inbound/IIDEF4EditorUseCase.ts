import type { ClassDTO, RelationshipDTO, DiagramDTO, ModelDTO, AttributeDTO, MethodDTO } from '../../dtos/IDEF4DTO';
import { RelationshipKind } from '../../../domain/models/IDEF4Relationship';
import type { IDEF4ValidationIssue } from '../../../domain/rules/IDEF4Rules';

export interface CreateClassCommand {
  name: string;
  isAbstract?: boolean;
  isInterface?: boolean;
  attributes?: AttributeDTO[];
  methods?: MethodDTO[];
  x?: number;
  y?: number;
}

export interface CreateRelationshipCommand {
  sourceClassId: string;
  targetClassId: string;
  kind: RelationshipKind;
  name?: string;
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
  roleName?: string;
}

export interface IIDEF4EditorUseCase {
  createModel(id: string, name: string): void;
  loadModel(modelId: string): Promise<ModelDTO>;
  saveModel(): Promise<void>;

  getActiveDiagram(): DiagramDTO;
  setActiveDiagram(diagramId: string): void;

  addClass(command: CreateClassCommand): ClassDTO;
  updateClass(classId: string, name: string): void;
  removeClass(classId: string): void;

  addRelationship(command: CreateRelationshipCommand): RelationshipDTO;
  removeRelationship(relationshipId: string): void;

  validateCurrentDiagram(): IDEF4ValidationIssue[];
  autoLayout(): void;
  exportJSON(): string;
  importJSON(jsonString: string): void;
}
