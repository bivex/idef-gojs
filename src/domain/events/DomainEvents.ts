import { Entity } from '../models/Entity';
import { Relationship } from '../models/Relationship';
import { CategorizationCluster } from '../models/Categorization';
import { Attribute } from '../models/Attribute';

export interface IDomainEvent {
  readonly eventName: string;
  readonly occurredOn: Date;
}

export class EntityCreatedEvent implements IDomainEvent {
  public readonly eventName = 'EntityCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly entity: Entity) {}
}

export class EntityUpdatedEvent implements IDomainEvent {
  public readonly eventName = 'EntityUpdated';
  public readonly occurredOn = new Date();
  constructor(public readonly entity: Entity) {}
}

export class EntityRemovedEvent implements IDomainEvent {
  public readonly eventName = 'EntityRemoved';
  public readonly occurredOn = new Date();
  constructor(public readonly entityId: string) {}
}

export class AttributeAddedEvent implements IDomainEvent {
  public readonly eventName = 'AttributeAdded';
  public readonly occurredOn = new Date();
  constructor(
    public readonly entityId: string,
    public readonly attribute: Attribute
  ) {}
}

export class AttributeRemovedEvent implements IDomainEvent {
  public readonly eventName = 'AttributeRemoved';
  public readonly occurredOn = new Date();
  constructor(
    public readonly entityId: string,
    public readonly attributeName: string
  ) {}
}

export class RelationshipAddedEvent implements IDomainEvent {
  public readonly eventName = 'RelationshipAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly relationship: Relationship) {}
}

export class RelationshipRemovedEvent implements IDomainEvent {
  public readonly eventName = 'RelationshipRemoved';
  public readonly occurredOn = new Date();
  constructor(public readonly relationshipId: string) {}
}

export class CategorizationAddedEvent implements IDomainEvent {
  public readonly eventName = 'CategorizationAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly cluster: CategorizationCluster) {}
}
