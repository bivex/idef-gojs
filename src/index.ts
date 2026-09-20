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
export type { GoJSDiagramOptions, IDEF1XViewLevel } from './infrastructure/adapters/outbound/gojs/GoJSDiagramAdapter';

export { InMemoryOrJsonRepository } from './infrastructure/adapters/outbound/persistence/InMemoryOrJsonRepository';
export { SimpleEventPublisher } from './infrastructure/events/SimpleEventPublisher';
export { createEntityNodeTemplate } from './infrastructure/adapters/outbound/gojs/templates/EntityNodeTemplate';
export { createRelationshipLinkTemplate } from './infrastructure/adapters/outbound/gojs/templates/RelationshipLinkTemplate';
export { createSubtypeNodeTemplate } from './infrastructure/adapters/outbound/gojs/templates/SubtypeNodeTemplate';
export { createNoteNodeTemplate } from './infrastructure/adapters/outbound/gojs/templates/NoteNodeTemplate';
