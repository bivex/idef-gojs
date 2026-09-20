import { Activity } from '../models/Activity';
import { Arrow } from '../models/Arrow';
import { IDEF0Diagram } from '../models/IDEF0Diagram';

export interface IDEF0DomainEvent {
  occurredOn: Date;
  eventName: string;
}

export class DiagramCreatedEvent implements IDEF0DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'DiagramCreatedEvent';
  constructor(public readonly diagram: IDEF0Diagram) {}
}

export class DiagramChangedEvent implements IDEF0DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'DiagramChangedEvent';
  constructor(public readonly diagramId: string) {}
}

export class ActivityAddedEvent implements IDEF0DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'ActivityAddedEvent';
  constructor(public readonly diagramId: string, public readonly activity: Activity) {}
}

export class ActivityRemovedEvent implements IDEF0DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'ActivityRemovedEvent';
  constructor(public readonly diagramId: string, public readonly activityId: string) {}
}

export class ArrowAddedEvent implements IDEF0DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'ArrowAddedEvent';
  constructor(public readonly diagramId: string, public readonly arrow: Arrow) {}
}

export class ArrowRemovedEvent implements IDEF0DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'ArrowRemovedEvent';
  constructor(public readonly diagramId: string, public readonly arrowId: string) {}
}

export class ActivityDecomposedEvent implements IDEF0DomainEvent {
  public readonly occurredOn = new Date();
  public readonly eventName = 'ActivityDecomposedEvent';
  constructor(
    public readonly parentDiagramId: string,
    public readonly parentActivityId: string,
    public readonly childDiagram: IDEF0Diagram
  ) {}
}
