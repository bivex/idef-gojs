// Domain Layer
export { IDEF1Model } from './domain/models/IDEF1Model';
export type { IDEF1ModelProps } from './domain/models/IDEF1Model';

export { Entity } from './domain/models/Entity';
export type { EntityProps } from './domain/models/Entity';

export { Attribute } from './domain/models/Attribute';
export type { ForeignKeyReference } from './domain/models/Attribute';

export { Relationship, RelationshipType, Cardinality } from './domain/models/Relationship';
export type { RelationshipProps } from './domain/models/Relationship';

export { CategorizationCluster } from './domain/models/Categorization';
export type { CategorizationProps } from './domain/models/Categorization';

export { Position } from './domain/models/Position';
export { IDEF1Rules } from './domain/rules/IDEF1Rules';

export {
  DomainError,
  EntityNotFoundError,
  RelationshipNotFoundError,
  InvalidIDEF1RuleError,
} from './domain/errors/DomainError';

export {
  EntityCreatedEvent,
  EntityUpdatedEvent,
  EntityRemovedEvent,
  RelationshipAddedEvent,
  RelationshipRemovedEvent,
  AttributeAddedEvent,
  AttributeRemovedEvent,
  CategorizationAddedEvent,
} from './domain/events/DomainEvents';
export type { IDomainEvent } from './domain/events/DomainEvents';

// Application Layer
export type {
  IIDEF1EditorUseCase,
  CreateEntityParams,
  AddAttributeParams,
  AddRelationshipParams,
  AddCategorizationParams,
} from './application/ports/inbound/IIDEF1EditorUseCase';

export type { IDiagramRendererPort } from './application/ports/outbound/IDiagramRendererPort';
export type { IModelRepositoryPort } from './application/ports/outbound/IModelRepositoryPort';
export type { IEventPublisherPort, DomainEventHandler } from './application/ports/outbound/IEventPublisherPort';

export { IDEF1ApplicationService } from './application/services/IDEF1ApplicationService';

export type {
  ModelDTO,
  EntityDTO,
  AttributeDTO,
  RelationshipDTO,
  CategorizationDTO,
} from './application/dtos/ModelDTO';

// Infrastructure Layer
export { IDEF1Editor } from './infrastructure/adapters/inbound/IDEF1Editor';
export type { IDEF1EditorConfig } from './infrastructure/adapters/inbound/IDEF1Editor';

export { GoJSDiagramAdapter } from './infrastructure/adapters/outbound/gojs/GoJSDiagramAdapter';
export type {
  GoJSDiagramOptions,
  IDEF1XViewLevel,
  AutoLayoutOptions,
} from './infrastructure/adapters/outbound/gojs/GoJSDiagramAdapter';

export { InMemoryOrJsonRepository } from './infrastructure/adapters/outbound/persistence/InMemoryOrJsonRepository';
export { SimpleEventPublisher } from './infrastructure/events/SimpleEventPublisher';
export { createEntityNodeTemplate } from './infrastructure/adapters/outbound/gojs/templates/EntityNodeTemplate';
export { createRelationshipLinkTemplate } from './infrastructure/adapters/outbound/gojs/templates/RelationshipLinkTemplate';
export { createSubtypeNodeTemplate } from './infrastructure/adapters/outbound/gojs/templates/SubtypeNodeTemplate';
export { createNoteNodeTemplate } from './infrastructure/adapters/outbound/gojs/templates/NoteNodeTemplate';

// ==========================================
// IDEF0 Functional Modeling Module (FIPS PUB 183)
// ==========================================
export { ICOMType, TunnelType } from './idef0/domain/models/ICOMType';
export { Activity } from './idef0/domain/models/Activity';
export type { ActivityProps } from './idef0/domain/models/Activity';
export { Arrow } from './idef0/domain/models/Arrow';
export type { ArrowProps } from './idef0/domain/models/Arrow';
export { IDEF0Diagram } from './idef0/domain/models/IDEF0Diagram';
export type { IDEF0DiagramProps } from './idef0/domain/models/IDEF0Diagram';
export { IDEF0Model } from './idef0/domain/models/IDEF0Model';
export type { IDEF0ModelProps } from './idef0/domain/models/IDEF0Model';
export { IDEF0Rules } from './idef0/domain/rules/IDEF0Rules';
export type { IDEF0ValidationIssue } from './idef0/domain/rules/IDEF0Rules';
export {
  IDEF0Error,
  ActivityNotFoundError as IDEF0ActivityNotFoundError,
  ArrowNotFoundError as IDEF0ArrowNotFoundError,
  DiagramNotFoundError as IDEF0DiagramNotFoundError,
  InvalidIDEF0RuleError,
} from './idef0/domain/errors/IDEF0Error';

export type {
  ActivityDTO as IDEF0ActivityDTO,
  ArrowDTO as IDEF0ArrowDTO,
  DiagramDTO as IDEF0DiagramDTO,
  ModelDTO as IDEF0ModelDTO,
} from './idef0/application/dtos/IDEF0DTO';

export type {
  IIDEF0EditorUseCase,
  CreateActivityCommand,
  CreateArrowCommand,
  DecomposeActivityCommand,
} from './idef0/application/ports/inbound/IIDEF0EditorUseCase';

export type {
  IIDEF0DiagramRendererPort,
  DiagramSelectionCallback as IDEF0DiagramSelectionCallback,
} from './idef0/application/ports/outbound/IIDEF0DiagramRendererPort';

export type { IIDEF0ModelRepositoryPort } from './idef0/application/ports/outbound/IIDEF0ModelRepositoryPort';
export type { IIDEF0EventPublisherPort } from './idef0/application/ports/outbound/IIDEF0EventPublisherPort';
export { IDEF0ApplicationService } from './idef0/application/services/IDEF0ApplicationService';
export { IDEF0Editor } from './idef0/infrastructure/adapters/inbound/IDEF0Editor';
export { GoJSIDEF0Adapter } from './idef0/infrastructure/adapters/outbound/gojs/GoJSIDEF0Adapter';
export { createActivityNodeTemplate } from './idef0/infrastructure/adapters/outbound/gojs/templates/ActivityNodeTemplate';
export { createArrowLinkTemplate } from './idef0/infrastructure/adapters/outbound/gojs/templates/ArrowLinkTemplate';
export { createBoundaryNodeTemplate } from './idef0/infrastructure/adapters/outbound/gojs/templates/BoundaryNodeTemplate';
