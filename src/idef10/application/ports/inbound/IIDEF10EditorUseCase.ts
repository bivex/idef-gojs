import {
  ComponentDTO,
  ExecutionNodeDTO,
  InterfaceDTO,
  ArtifactDTO,
  LinkDTO,
  DiagramDTO,
  ModelDTO,
} from '../../dtos/IDEF10DTO';
import { ComponentType, ComponentLifecycle } from '../../../domain/models/IDEF10Component';
import { NodeType } from '../../../domain/models/IDEF10ExecutionNode';
import { InterfaceProtocol, InterfaceRole } from '../../../domain/models/IDEF10Interface';
import { ArtifactType } from '../../../domain/models/IDEF10Artifact';
import { ArchitectureLinkType } from '../../../domain/models/IDEF10Link';
import { IDEF10ValidationIssue } from '../../../domain/rules/IDEF10Rules';

export interface CreateComponentCommand {
  code: string;
  name: string;
  techStack?: string;
  version?: string;
  componentType?: ComponentType;
  lifecycle?: ComponentLifecycle;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateExecutionNodeCommand {
  code: string;
  name: string;
  nodeType?: NodeType;
  ipAddress?: string;
  osPlatform?: string;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateInterfaceCommand {
  name: string;
  protocol?: InterfaceProtocol;
  role?: InterfaceRole;
  portNumber?: number;
  specification?: string;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateArtifactCommand {
  name: string;
  artifactType?: ArtifactType;
  fileName?: string;
  repositoryUrl?: string;
  description?: string;
  x?: number;
  y?: number;
}

export interface CreateIDEF10LinkCommand {
  sourceId: string;
  targetId: string;
  type: ArchitectureLinkType;
  label?: string;
}

export interface IIDEF10EditorUseCase {
  createModel(id: string, name: string): void;
  loadModel(modelId: string): Promise<ModelDTO>;
  saveModel(): Promise<void>;
  getActiveDiagram(): DiagramDTO;
  setActiveDiagram(diagramId: string): void;

  addComponent(cmd: CreateComponentCommand): ComponentDTO;
  updateComponent(id: string, name: string, lifecycle?: ComponentLifecycle): void;
  removeComponent(id: string): void;

  addExecutionNode(cmd: CreateExecutionNodeCommand): ExecutionNodeDTO;
  removeExecutionNode(id: string): void;

  addInterface(cmd: CreateInterfaceCommand): InterfaceDTO;
  removeInterface(id: string): void;

  addArtifact(cmd: CreateArtifactCommand): ArtifactDTO;
  removeArtifact(id: string): void;

  addLink(cmd: CreateIDEF10LinkCommand): LinkDTO;
  removeLink(id: string): void;

  validateCurrentDiagram(): IDEF10ValidationIssue[];
  autoLayout(): void;
  exportJSON(): string;
  importJSON(jsonString: string): void;
}
