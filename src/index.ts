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

// ==========================================
// IDEF3 Process Description Capture Module (KBSI / IEEE)
// ==========================================
export { JunctionKind, SyncType, JunctionDirection } from './idef3/domain/models/JunctionType';
export { Link, LinkType } from './idef3/domain/models/Link';
export type { LinkProps } from './idef3/domain/models/Link';
export { Referent, ReferentType } from './idef3/domain/models/Referent';
export type { ReferentProps } from './idef3/domain/models/Referent';
export { UOB } from './idef3/domain/models/UOB';
export type { UOBProps } from './idef3/domain/models/UOB';
export { Junction } from './idef3/domain/models/Junction';
export type { JunctionProps } from './idef3/domain/models/Junction';
export { IDEF3Diagram } from './idef3/domain/models/IDEF3Diagram';
export type { IDEF3DiagramProps } from './idef3/domain/models/IDEF3Diagram';
export { IDEF3Model } from './idef3/domain/models/IDEF3Model';
export type { IDEF3ModelProps } from './idef3/domain/models/IDEF3Model';
export { IDEF3Rules } from './idef3/domain/rules/IDEF3Rules';
export type { IDEF3ValidationIssue } from './idef3/domain/rules/IDEF3Rules';
export {
  IDEF3Error,
  UOBNotFoundError,
  JunctionNotFoundError,
  LinkNotFoundError,
  ReferentNotFoundError,
  DiagramNotFoundError as IDEF3DiagramNotFoundError,
} from './idef3/domain/errors/IDEF3Error';

export type {
  UOBDTO,
  JunctionDTO,
  LinkDTO,
  ReferentDTO,
  DiagramDTO as IDEF3DiagramDTO,
  ModelDTO as IDEF3ModelDTO,
} from './idef3/application/dtos/IDEF3DTO';

export type {
  IIDEF3EditorUseCase,
  CreateUOBCommand,
  CreateJunctionCommand,
  CreateLinkCommand,
  CreateReferentCommand,
  DecomposeUOBCommand,
} from './idef3/application/ports/inbound/IIDEF3EditorUseCase';

export type {
  IIDEF3DiagramRendererPort,
  IDEF3SelectionCallback,
} from './idef3/application/ports/outbound/IIDEF3DiagramRendererPort';

export type { IIDEF3ModelRepositoryPort } from './idef3/application/ports/outbound/IIDEF3ModelRepositoryPort';
export { IDEF3ApplicationService } from './idef3/application/services/IDEF3ApplicationService';
export { IDEF3Editor } from './idef3/infrastructure/adapters/inbound/IDEF3Editor';
export { GoJSIDEF3Adapter } from './idef3/infrastructure/adapters/outbound/gojs/GoJSIDEF3Adapter';
export { createUOBNodeTemplate } from './idef3/infrastructure/adapters/outbound/gojs/templates/UOBNodeTemplate';
export { createJunctionNodeTemplate } from './idef3/infrastructure/adapters/outbound/gojs/templates/JunctionNodeTemplate';
export { createReferentNodeTemplate } from './idef3/infrastructure/adapters/outbound/gojs/templates/ReferentNodeTemplate';
export { createProcessLinkTemplate } from './idef3/infrastructure/adapters/outbound/gojs/templates/ProcessLinkTemplate';

// ==========================================
// IDEF4 Object-Oriented Design Module (KBSI / IICE)
// ==========================================
export { IDEF4Class } from './idef4/domain/models/IDEF4Class';
export type { IDEF4ClassProps } from './idef4/domain/models/IDEF4Class';
export { IDEF4Attribute } from './idef4/domain/models/IDEF4Attribute';
export type { IDEF4AttributeProps, Visibility } from './idef4/domain/models/IDEF4Attribute';
export { IDEF4Method } from './idef4/domain/models/IDEF4Method';
export type { IDEF4MethodProps, MethodParameter } from './idef4/domain/models/IDEF4Method';
export { IDEF4Relationship, RelationshipKind as IDEF4RelationshipKind } from './idef4/domain/models/IDEF4Relationship';
export type { IDEF4RelationshipProps } from './idef4/domain/models/IDEF4Relationship';
export { IDEF4Diagram } from './idef4/domain/models/IDEF4Diagram';
export type { IDEF4DiagramProps } from './idef4/domain/models/IDEF4Diagram';
export { IDEF4Model } from './idef4/domain/models/IDEF4Model';
export type { IDEF4ModelProps } from './idef4/domain/models/IDEF4Model';
export { IDEF4Rules } from './idef4/domain/rules/IDEF4Rules';
export type { IDEF4ValidationIssue } from './idef4/domain/rules/IDEF4Rules';
export {
  IDEF4Error,
  ClassNotFoundError,
  RelationshipNotFoundError as IDEF4RelationshipNotFoundError,
  DiagramNotFoundError as IDEF4DiagramNotFoundError,
} from './idef4/domain/errors/IDEF4Error';

export type {
  ClassDTO as IDEF4ClassDTO,
  RelationshipDTO as IDEF4RelationshipDTO,
  DiagramDTO as IDEF4DiagramDTO,
  ModelDTO as IDEF4ModelDTO,
} from './idef4/application/dtos/IDEF4DTO';

export type {
  IIDEF4EditorUseCase,
  CreateClassCommand,
  CreateRelationshipCommand,
} from './idef4/application/ports/inbound/IIDEF4EditorUseCase';

export type {
  IIDEF4DiagramRendererPort,
  IDEF4SelectionCallback,
} from './idef4/application/ports/outbound/IIDEF4DiagramRendererPort';

export type { IIDEF4ModelRepositoryPort } from './idef4/application/ports/outbound/IIDEF4ModelRepositoryPort';
export { IDEF4ApplicationService } from './idef4/application/services/IDEF4ApplicationService';
export { IDEF4Editor } from './idef4/infrastructure/adapters/inbound/IDEF4Editor';
export { GoJSIDEF4Adapter } from './idef4/infrastructure/adapters/outbound/gojs/GoJSIDEF4Adapter';
export { createClassNodeTemplate } from './idef4/infrastructure/adapters/outbound/gojs/templates/ClassNodeTemplate';
export { createClassLinkTemplate } from './idef4/infrastructure/adapters/outbound/gojs/templates/ClassLinkTemplate';

// ==========================================
// IDEF5 Ontology Description Capture Module (KBSI / IEEE)
// ==========================================
export { OntologyRelationType, IDEF5Relation } from './idef5/domain/models/IDEF5Relation';
export type { IDEF5RelationProps } from './idef5/domain/models/IDEF5Relation';
export { IDEF5Property } from './idef5/domain/models/IDEF5Property';
export type { IDEF5PropertyProps } from './idef5/domain/models/IDEF5Property';
export { IDEF5Kind } from './idef5/domain/models/IDEF5Kind';
export type { IDEF5KindProps } from './idef5/domain/models/IDEF5Kind';
export { IDEF5Diagram } from './idef5/domain/models/IDEF5Diagram';
export type { IDEF5DiagramProps, SchematicType as IDEF5SchematicType } from './idef5/domain/models/IDEF5Diagram';
export { IDEF5Model } from './idef5/domain/models/IDEF5Model';
export type { IDEF5ModelProps } from './idef5/domain/models/IDEF5Model';
export { IDEF5Rules } from './idef5/domain/rules/IDEF5Rules';
export type { IDEF5ValidationIssue as IDEF5ValidationIssue } from './idef5/domain/rules/IDEF5Rules';
export {
  IDEF5Error,
  KindNotFoundError,
  RelationNotFoundError as IDEF5RelationNotFoundError,
  DiagramNotFoundError as IDEF5DiagramNotFoundError,
} from './idef5/domain/errors/IDEF5Error';

export type {
  PropertyDTO as IDEF5PropertyDTO,
  KindDTO as IDEF5KindDTO,
  RelationDTO as IDEF5RelationDTO,
  DiagramDTO as IDEF5DiagramDTO,
  ModelDTO as IDEF5ModelDTO,
} from './idef5/application/dtos/IDEF5DTO';

export type {
  IIDEF5EditorUseCase,
  CreateKindCommand,
  CreateRelationCommand,
} from './idef5/application/ports/inbound/IIDEF5EditorUseCase';

export type {
  IIDEF5DiagramRendererPort,
  IDEF5SelectionCallback,
} from './idef5/application/ports/outbound/IIDEF5DiagramRendererPort';

export type { IIDEF5ModelRepositoryPort as IIDEF5ModelRepositoryPort } from './idef5/application/ports/outbound/IIDEF5ModelRepositoryPort';
export { IDEF5ApplicationService } from './idef5/application/services/IDEF5ApplicationService';
export { IDEF5Editor } from './idef5/infrastructure/adapters/inbound/IDEF5Editor';
export { GoJSIDEF5Adapter } from './idef5/infrastructure/adapters/outbound/gojs/GoJSIDEF5Adapter';
export { createKindNodeTemplate } from './idef5/infrastructure/adapters/outbound/gojs/templates/KindNodeTemplate';
export { createOntologyLinkTemplate } from './idef5/infrastructure/adapters/outbound/gojs/templates/OntologyLinkTemplate';

// ==========================================
// IDEF6 Design Rationale Capture Module (KBSI / Air Force / IICE)
// ==========================================
export { IssueStatus, IssuePriority, IDEF6Issue } from './idef6/domain/models/IDEF6Issue';
export type { IDEF6IssueProps } from './idef6/domain/models/IDEF6Issue';
export { AlternativeStatus, IDEF6Alternative } from './idef6/domain/models/IDEF6Alternative';
export type { IDEF6AlternativeProps } from './idef6/domain/models/IDEF6Alternative';
export { CriterionType, CriterionWeight, IDEF6Criterion } from './idef6/domain/models/IDEF6Criterion';
export type { IDEF6CriterionProps } from './idef6/domain/models/IDEF6Criterion';
export { ArgumentType, ArgumentStrength, IDEF6Argument } from './idef6/domain/models/IDEF6Argument';
export type { IDEF6ArgumentProps } from './idef6/domain/models/IDEF6Argument';
export { RationaleLinkType, IDEF6Link } from './idef6/domain/models/IDEF6Link';
export type { IDEF6LinkProps } from './idef6/domain/models/IDEF6Link';
export { IDEF6Diagram } from './idef6/domain/models/IDEF6Diagram';
export type { IDEF6DiagramProps } from './idef6/domain/models/IDEF6Diagram';
export { IDEF6Model } from './idef6/domain/models/IDEF6Model';
export type { IDEF6ModelProps } from './idef6/domain/models/IDEF6Model';
export { IDEF6Rules } from './idef6/domain/rules/IDEF6Rules';
export type { IDEF6ValidationIssue } from './idef6/domain/rules/IDEF6Rules';
export {
  IDEF6Error,
  IssueNotFoundError as IDEF6IssueNotFoundError,
  AlternativeNotFoundError as IDEF6AlternativeNotFoundError,
  CriterionNotFoundError as IDEF6CriterionNotFoundError,
  ArgumentNotFoundError as IDEF6ArgumentNotFoundError,
  LinkNotFoundError as IDEF6LinkNotFoundError,
  DiagramNotFoundError as IDEF6DiagramNotFoundError,
} from './idef6/domain/errors/IDEF6Error';

export type {
  IssueDTO as IDEF6IssueDTO,
  AlternativeDTO as IDEF6AlternativeDTO,
  CriterionDTO as IDEF6CriterionDTO,
  ArgumentDTO as IDEF6ArgumentDTO,
  LinkDTO as IDEF6LinkDTO,
  DiagramDTO as IDEF6DiagramDTO,
  ModelDTO as IDEF6ModelDTO,
} from './idef6/application/dtos/IDEF6DTO';

export type {
  IIDEF6EditorUseCase,
  CreateIssueCommand,
  CreateAlternativeCommand,
  CreateCriterionCommand,
  CreateArgumentCommand,
  CreateLinkCommand as CreateIDEF6LinkCommand,
} from './idef6/application/ports/inbound/IIDEF6EditorUseCase';

export type {
  IIDEF6DiagramRendererPort,
  IDEF6SelectionCallback,
} from './idef6/application/ports/outbound/IIDEF6DiagramRendererPort';

export type { IIDEF6ModelRepositoryPort } from './idef6/application/ports/outbound/IIDEF6ModelRepositoryPort';
export { IDEF6ApplicationService } from './idef6/application/services/IDEF6ApplicationService';
export { IDEF6Editor } from './idef6/infrastructure/adapters/inbound/IDEF6Editor';
export { GoJSIDEF6Adapter } from './idef6/infrastructure/adapters/outbound/gojs/GoJSIDEF6Adapter';
export { createRationaleNodeTemplateMap } from './idef6/infrastructure/adapters/outbound/gojs/templates/RationaleNodeTemplate';
export { createRationaleLinkTemplate } from './idef6/infrastructure/adapters/outbound/gojs/templates/RationaleLinkTemplate';

// ==========================================
// IDEF8 Human-System Interaction Design Module (KBSI / US Air Force)
// ==========================================
export { ScreenType, ScreenState, IDEF8Screen } from './idef8/domain/models/IDEF8Screen';
export type { UIWidget, IDEF8ScreenProps } from './idef8/domain/models/IDEF8Screen';
export { ActionModality, IDEF8UserAction } from './idef8/domain/models/IDEF8UserAction';
export type { IDEF8UserActionProps } from './idef8/domain/models/IDEF8UserAction';
export { ResponseType, IDEF8SystemResponse } from './idef8/domain/models/IDEF8SystemResponse';
export type { IDEF8SystemResponseProps } from './idef8/domain/models/IDEF8SystemResponse';
export { PrivilegeLevel, IDEF8UserRole } from './idef8/domain/models/IDEF8UserRole';
export type { IDEF8UserRoleProps } from './idef8/domain/models/IDEF8UserRole';
export { InteractionLinkType, IDEF8Link } from './idef8/domain/models/IDEF8Link';
export type { IDEF8LinkProps } from './idef8/domain/models/IDEF8Link';
export { IDEF8Diagram } from './idef8/domain/models/IDEF8Diagram';
export type { IDEF8DiagramProps } from './idef8/domain/models/IDEF8Diagram';
export { IDEF8Model } from './idef8/domain/models/IDEF8Model';
export type { IDEF8ModelProps } from './idef8/domain/models/IDEF8Model';
export { IDEF8Rules } from './idef8/domain/rules/IDEF8Rules';
export type { IDEF8ValidationIssue as IDEF8ValidationIssue } from './idef8/domain/rules/IDEF8Rules';
export {
  IDEF8Error,
  ScreenNotFoundError as IDEF8ScreenNotFoundError,
  UserActionNotFoundError as IDEF8UserActionNotFoundError,
  SystemResponseNotFoundError as IDEF8SystemResponseNotFoundError,
  UserRoleNotFoundError as IDEF8UserRoleNotFoundError,
  LinkNotFoundError as IDEF8LinkNotFoundError,
  DiagramNotFoundError as IDEF8DiagramNotFoundError,
} from './idef8/domain/errors/IDEF8Error';

export type {
  ScreenDTO as IDEF8ScreenDTO,
  UserActionDTO as IDEF8UserActionDTO,
  SystemResponseDTO as IDEF8SystemResponseDTO,
  UserRoleDTO as IDEF8UserRoleDTO,
  LinkDTO as IDEF8LinkDTO,
  DiagramDTO as IDEF8DiagramDTO,
  ModelDTO as IDEF8ModelDTO,
} from './idef8/application/dtos/IDEF8DTO';

export type {
  IIDEF8EditorUseCase,
  CreateScreenCommand,
  CreateUserActionCommand,
  CreateSystemResponseCommand,
  CreateUserRoleCommand,
  CreateIDEF8LinkCommand,
} from './idef8/application/ports/inbound/IIDEF8EditorUseCase';

export type {
  IIDEF8DiagramRendererPort,
  IDEF8SelectionCallback,
} from './idef8/application/ports/outbound/IIDEF8DiagramRendererPort';

export type { IIDEF8ModelRepositoryPort as IIDEF8ModelRepositoryPort } from './idef8/application/ports/outbound/IIDEF8ModelRepositoryPort';
export { IDEF8ApplicationService } from './idef8/application/services/IDEF8ApplicationService';
export { IDEF8Editor } from './idef8/infrastructure/adapters/inbound/IDEF8Editor';
export { GoJSIDEF8Adapter } from './idef8/infrastructure/adapters/outbound/gojs/GoJSIDEF8Adapter';
export { createIDEF8NodeTemplateMap } from './idef8/infrastructure/adapters/outbound/gojs/templates/ScreenNodeTemplate';
export { createInteractionLinkTemplate } from './idef8/infrastructure/adapters/outbound/gojs/templates/InteractionLinkTemplate';

// ─────────────────────────────────────────────────────────────────────────────
// IDEF9 — Business Rules & Constraints Capture (KBSI / US Air Force / IICE)
// ─────────────────────────────────────────────────────────────────────────────
export {
  ConstraintType,
  ConstraintSeverity,
  ConstraintStatus,
  IDEF9Constraint,
} from './idef9/domain/models/IDEF9Constraint';
export { ControlledObjectType, IDEF9ControlledObject } from './idef9/domain/models/IDEF9ControlledObject';
export { MechanismType, IDEF9EnforcementMechanism } from './idef9/domain/models/IDEF9EnforcementMechanism';
export { DocumentType, IDEF9SourceDocument } from './idef9/domain/models/IDEF9SourceDocument';
export { ConstraintLinkType, IDEF9Link } from './idef9/domain/models/IDEF9Link';
export { IDEF9Diagram } from './idef9/domain/models/IDEF9Diagram';
export { IDEF9Model } from './idef9/domain/models/IDEF9Model';
export { IDEF9Rules } from './idef9/domain/rules/IDEF9Rules';
export type { IDEF9ValidationIssue } from './idef9/domain/rules/IDEF9Rules';

export type {
  ConstraintDTO as IDEF9ConstraintDTO,
  ControlledObjectDTO as IDEF9ControlledObjectDTO,
  EnforcementMechanismDTO as IDEF9EnforcementMechanismDTO,
  SourceDocumentDTO as IDEF9SourceDocumentDTO,
  LinkDTO as IDEF9LinkDTO,
  DiagramDTO as IDEF9DiagramDTO,
  ModelDTO as IDEF9ModelDTO,
} from './idef9/application/dtos/IDEF9DTO';

export type {
  IIDEF9EditorUseCase,
  CreateConstraintCommand,
  CreateControlledObjectCommand,
  CreateEnforcementMechanismCommand,
  CreateSourceDocumentCommand,
  CreateIDEF9LinkCommand,
} from './idef9/application/ports/inbound/IIDEF9EditorUseCase';

export type {
  IIDEF9DiagramRendererPort,
  IDEF9SelectionCallback,
} from './idef9/application/ports/outbound/IIDEF9DiagramRendererPort';

export type { IIDEF9ModelRepositoryPort } from './idef9/application/ports/outbound/IIDEF9ModelRepositoryPort';
export { IDEF9ApplicationService } from './idef9/application/services/IDEF9ApplicationService';
export { IDEF9Editor } from './idef9/infrastructure/adapters/inbound/IDEF9Editor';
export { GoJSIDEF9Adapter } from './idef9/infrastructure/adapters/outbound/gojs/GoJSIDEF9Adapter';
export { createIDEF9NodeTemplateMap } from './idef9/infrastructure/adapters/outbound/gojs/templates/ConstraintNodeTemplate';
export { createConstraintLinkTemplate } from './idef9/infrastructure/adapters/outbound/gojs/templates/ConstraintLinkTemplate';

// ─────────────────────────────────────────────────────────────────────────────
// IDEF10 — Implementation Architecture Modeling (KBSI / US Air Force / IICE)
// ─────────────────────────────────────────────────────────────────────────────
export {
  ComponentType,
  ComponentLifecycle,
  IDEF10Component,
} from './idef10/domain/models/IDEF10Component';
export { NodeType, IDEF10ExecutionNode } from './idef10/domain/models/IDEF10ExecutionNode';
export { InterfaceProtocol, InterfaceRole, IDEF10Interface } from './idef10/domain/models/IDEF10Interface';
export { ArtifactType, IDEF10Artifact } from './idef10/domain/models/IDEF10Artifact';
export { ArchitectureLinkType, IDEF10Link as IDEF10ArchitectureLink } from './idef10/domain/models/IDEF10Link';
export { IDEF10Diagram } from './idef10/domain/models/IDEF10Diagram';
export { IDEF10Model } from './idef10/domain/models/IDEF10Model';
export { IDEF10Rules } from './idef10/domain/rules/IDEF10Rules';
export type { IDEF10ValidationIssue } from './idef10/domain/rules/IDEF10Rules';

export type {
  ComponentDTO as IDEF10ComponentDTO,
  ExecutionNodeDTO as IDEF10ExecutionNodeDTO,
  InterfaceDTO as IDEF10InterfaceDTO,
  ArtifactDTO as IDEF10ArtifactDTO,
  LinkDTO as IDEF10LinkDTO,
  DiagramDTO as IDEF10DiagramDTO,
  ModelDTO as IDEF10ModelDTO,
} from './idef10/application/dtos/IDEF10DTO';

export type {
  IIDEF10EditorUseCase,
  CreateComponentCommand,
  CreateExecutionNodeCommand,
  CreateInterfaceCommand,
  CreateArtifactCommand,
  CreateIDEF10LinkCommand,
} from './idef10/application/ports/inbound/IIDEF10EditorUseCase';

export type {
  IIDEF10DiagramRendererPort,
  IDEF10SelectionCallback,
} from './idef10/application/ports/outbound/IIDEF10DiagramRendererPort';

export type { IIDEF10ModelRepositoryPort } from './idef10/application/ports/outbound/IIDEF10ModelRepositoryPort';
export { IDEF10ApplicationService } from './idef10/application/services/IDEF10ApplicationService';
export { IDEF10Editor } from './idef10/infrastructure/adapters/inbound/IDEF10Editor';
export { GoJSIDEF10Adapter } from './idef10/infrastructure/adapters/outbound/gojs/GoJSIDEF10Adapter';
export { createIDEF10NodeTemplateMap } from './idef10/infrastructure/adapters/outbound/gojs/templates/ComponentNodeTemplate';
export { createArchitectureLinkTemplate } from './idef10/infrastructure/adapters/outbound/gojs/templates/ArchitectureLinkTemplate';

// ─────────────────────────────────────────────────────────────────────────────
// IDEF12 — Organization Modeling (KBSI / US Air Force / IICE)
// ─────────────────────────────────────────────────────────────────────────────
export { OrgUnitType, IDEF12OrgUnit } from './idef12/domain/models/IDEF12OrgUnit';
export type { IDEF12OrgUnitProps } from './idef12/domain/models/IDEF12OrgUnit';
export { PositionLevel, IDEF12Position } from './idef12/domain/models/IDEF12Position';
export type { IDEF12PositionProps } from './idef12/domain/models/IDEF12Position';
export { OrgRoleType, IDEF12OrgRole } from './idef12/domain/models/IDEF12OrgRole';
export type { IDEF12OrgRoleProps } from './idef12/domain/models/IDEF12OrgRole';
export { CompetencyCriticality, IDEF12Competency } from './idef12/domain/models/IDEF12Competency';
export type { IDEF12CompetencyProps } from './idef12/domain/models/IDEF12Competency';
export { OrgLinkType, IDEF12Link as IDEF12OrgLink } from './idef12/domain/models/IDEF12Link';
export type { IDEF12LinkProps as IDEF12OrgLinkProps } from './idef12/domain/models/IDEF12Link';
export { IDEF12Diagram } from './idef12/domain/models/IDEF12Diagram';
export type { IDEF12DiagramProps } from './idef12/domain/models/IDEF12Diagram';
export { IDEF12Model } from './idef12/domain/models/IDEF12Model';
export type { IDEF12ModelProps } from './idef12/domain/models/IDEF12Model';
export { IDEF12Rules } from './idef12/domain/rules/IDEF12Rules';
export type { IDEF12ValidationIssue } from './idef12/domain/rules/IDEF12Rules';
export { IDEF12Error, IDEF12ValidationError } from './idef12/domain/errors/IDEF12Error';
export { IDEF12DiagramChangedEvent } from './idef12/domain/events/IDEF12Events';

export type {
  OrgUnitDTO as IDEF12OrgUnitDTO,
  PositionDTO as IDEF12PositionDTO,
  OrgRoleDTO as IDEF12OrgRoleDTO,
  CompetencyDTO as IDEF12CompetencyDTO,
  OrgLinkDTO as IDEF12OrgLinkDTO,
  IDEF12DiagramDTO,
  IDEF12ModelDTO,
} from './idef12/application/dtos/IDEF12DTO';

export type { IIDEF12EditorUseCase } from './idef12/application/ports/inbound/IIDEF12EditorUseCase';
export type { IIDEF12DiagramRendererPort } from './idef12/application/ports/outbound/IIDEF12DiagramRendererPort';
export type { IIDEF12ModelRepositoryPort } from './idef12/application/ports/outbound/IIDEF12ModelRepositoryPort';
export { IDEF12ApplicationService } from './idef12/application/services/IDEF12ApplicationService';
export { IDEF12Editor } from './idef12/infrastructure/adapters/inbound/IDEF12Editor';
export { GoJSIDEF12Adapter } from './idef12/infrastructure/adapters/outbound/gojs/GoJSIDEF12Adapter';
export { createIDEF12NodeTemplateMap } from './idef12/infrastructure/adapters/outbound/gojs/templates/OrgUnitNodeTemplate';
export { createIDEF12LinkTemplate } from './idef12/infrastructure/adapters/outbound/gojs/templates/OrgLinkTemplate';

