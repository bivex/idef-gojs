import { IDEF6Issue } from '../models/IDEF6Issue';
import { IDEF6Alternative } from '../models/IDEF6Alternative';
import { IDEF6Criterion } from '../models/IDEF6Criterion';
import { IDEF6Argument } from '../models/IDEF6Argument';
import { IDEF6Link } from '../models/IDEF6Link';

export interface IDEF6DomainEvent {
  occurredOn: Date;
  eventName: string;
}

export class IssueAddedEvent implements IDEF6DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'IssueAddedEvent';
  constructor(public readonly diagramId: string, public readonly issue: IDEF6Issue) {}
}

export class AlternativeAddedEvent implements IDEF6DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'AlternativeAddedEvent';
  constructor(public readonly diagramId: string, public readonly alternative: IDEF6Alternative) {}
}

export class CriterionAddedEvent implements IDEF6DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'CriterionAddedEvent';
  constructor(public readonly diagramId: string, public readonly criterion: IDEF6Criterion) {}
}

export class ArgumentAddedEvent implements IDEF6DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'ArgumentAddedEvent';
  constructor(public readonly diagramId: string, public readonly argument: IDEF6Argument) {}
}

export class LinkAddedEvent implements IDEF6DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'LinkAddedEvent';
  constructor(public readonly diagramId: string, public readonly link: IDEF6Link) {}
}
