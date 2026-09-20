import { ComponentType, ComponentLifecycle } from '../../domain/models/IDEF10Component';
import { NodeType } from '../../domain/models/IDEF10ExecutionNode';
import { InterfaceProtocol, InterfaceRole } from '../../domain/models/IDEF10Interface';
import { ArtifactType } from '../../domain/models/IDEF10Artifact';
import { ArchitectureLinkType } from '../../domain/models/IDEF10Link';

export interface ComponentDTO {
  id: string;
  code: string;
  name: string;
  techStack: string;
  version: string;
  componentType: ComponentType;
  lifecycle: ComponentLifecycle;
  description?: string;
  x: number;
  y: number;
}

export interface ExecutionNodeDTO {
  id: string;
  code: string;
  name: string;
  nodeType: NodeType;
  ipAddress?: string;
  osPlatform?: string;
  description?: string;
  x: number;
  y: number;
}

export interface InterfaceDTO {
  id: string;
  name: string;
  protocol: InterfaceProtocol;
  role: InterfaceRole;
  portNumber?: number;
  specification?: string;
  description?: string;
  x: number;
  y: number;
}

export interface ArtifactDTO {
  id: string;
  name: string;
  artifactType: ArtifactType;
  fileName?: string;
  repositoryUrl?: string;
  description?: string;
  x: number;
  y: number;
}

export interface LinkDTO {
  id: string;
  sourceId: string;
  targetId: string;
  type: ArchitectureLinkType;
  label?: string;
}

export interface DiagramDTO {
  id: string;
  name: string;
  description?: string;
  components: ComponentDTO[];
  executionNodes: ExecutionNodeDTO[];
  interfaces: InterfaceDTO[];
  artifacts: ArtifactDTO[];
  links: LinkDTO[];
}

export interface ModelDTO {
  id: string;
  name: string;
  version: string;
  activeDiagramId: string;
  diagrams: DiagramDTO[];
}
