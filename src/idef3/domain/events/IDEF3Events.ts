import { UOB } from '../models/UOB';
import { Junction } from '../models/Junction';
import { Link } from '../models/Link';
import { Referent } from '../models/Referent';

export interface IDEF3DomainEvent {
  occurredOn: Date;
  eventName: string;
}

export class UOBAddedEvent implements IDEF3DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'UOBAddedEvent';
  constructor(public readonly diagramId: string, public readonly uob: UOB) {}
}

export class UOBRemovedEvent implements IDEF3DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'UOBRemovedEvent';
  constructor(public readonly diagramId: string, public readonly uobId: string) {}
}

export class JunctionAddedEvent implements IDEF3DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'JunctionAddedEvent';
  constructor(public readonly diagramId: string, public readonly junction: Junction) {}
}

export class JunctionRemovedEvent implements IDEF3DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'JunctionRemovedEvent';
  constructor(public readonly diagramId: string, public readonly junctionId: string) {}
}

export class LinkAddedEvent implements IDEF3DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'LinkAddedEvent';
  constructor(public readonly diagramId: string, public readonly link: Link) {}
}

export class LinkRemovedEvent implements IDEF3DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'LinkRemovedEvent';
  constructor(public readonly diagramId: string, public readonly linkId: string) {}
}

export class ReferentAddedEvent implements IDEF3DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'ReferentAddedEvent';
  constructor(public readonly diagramId: string, public readonly referent: Referent) {}
}
