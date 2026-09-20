import { IDEF4Class } from '../models/IDEF4Class';
import { IDEF4Relationship } from '../models/IDEF4Relationship';

export interface IDEF4DomainEvent {
  occurredOn: Date;
  eventName: string;
}

export class ClassAddedEvent implements IDEF4DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'ClassAddedEvent';
  constructor(public readonly diagramId: string, public readonly cls: IDEF4Class) {}
}

export class ClassRemovedEvent implements IDEF4DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'ClassRemovedEvent';
  constructor(public readonly diagramId: string, public readonly classId: string) {}
}

export class RelationshipAddedEvent implements IDEF4DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'RelationshipAddedEvent';
  constructor(public readonly diagramId: string, public readonly relationship: IDEF4Relationship) {}
}

export class RelationshipRemovedEvent implements IDEF4DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'RelationshipRemovedEvent';
  constructor(public readonly diagramId: string, public readonly relationshipId: string) {}
}
