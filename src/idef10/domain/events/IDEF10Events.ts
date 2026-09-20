import { IDEF10Component } from '../models/IDEF10Component';
import { IDEF10ExecutionNode } from '../models/IDEF10ExecutionNode';
import { IDEF10Interface } from '../models/IDEF10Interface';
import { IDEF10Artifact } from '../models/IDEF10Artifact';
import { IDEF10Link } from '../models/IDEF10Link';

export interface ComponentCreatedEvent {
  type: 'ComponentCreated';
  component: IDEF10Component;
}

export interface ExecutionNodeCreatedEvent {
  type: 'ExecutionNodeCreated';
  node: IDEF10ExecutionNode;
}

export interface InterfaceCreatedEvent {
  type: 'InterfaceCreated';
  interface: IDEF10Interface;
}

export interface ArtifactCreatedEvent {
  type: 'ArtifactCreated';
  artifact: IDEF10Artifact;
}

export interface ArchitectureLinkCreatedEvent {
  type: 'ArchitectureLinkCreated';
  link: IDEF10Link;
}

export type IDEF10DomainEvent =
  | ComponentCreatedEvent
  | ExecutionNodeCreatedEvent
  | InterfaceCreatedEvent
  | ArtifactCreatedEvent
  | ArchitectureLinkCreatedEvent;
