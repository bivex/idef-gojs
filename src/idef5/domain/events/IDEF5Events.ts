import { IDEF5Kind } from '../models/IDEF5Kind';
import { IDEF5Relation } from '../models/IDEF5Relation';

export interface IDEF5DomainEvent {
  occurredOn: Date;
  eventName: string;
}

export class KindAddedEvent implements IDEF5DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'KindAddedEvent';
  constructor(public readonly diagramId: string, public readonly kind: IDEF5Kind) {}
}

export class KindRemovedEvent implements IDEF5DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'KindRemovedEvent';
  constructor(public readonly diagramId: string, public readonly kindId: string) {}
}

export class RelationAddedEvent implements IDEF5DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'RelationAddedEvent';
  constructor(public readonly diagramId: string, public readonly relation: IDEF5Relation) {}
}

export class RelationRemovedEvent implements IDEF5DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'RelationRemovedEvent';
  constructor(public readonly diagramId: string, public readonly relationId: string) {}
}
