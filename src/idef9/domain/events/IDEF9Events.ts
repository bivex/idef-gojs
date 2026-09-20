export interface IIDEF9DomainEvent {
  readonly eventName: string;
  readonly occurredOn: Date;
}

export class ConstraintCreatedEvent implements IIDEF9DomainEvent {
  public readonly eventName = 'ConstraintCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly constraintId: string, public readonly code: string, public readonly name: string) {}
}

export class ConstraintRemovedEvent implements IIDEF9DomainEvent {
  public readonly eventName = 'ConstraintRemoved';
  public readonly occurredOn = new Date();
  constructor(public readonly constraintId: string) {}
}

export class ControlledObjectAddedEvent implements IIDEF9DomainEvent {
  public readonly eventName = 'ControlledObjectAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly objectId: string, public readonly name: string) {}
}

export class EnforcementMechanismAddedEvent implements IIDEF9DomainEvent {
  public readonly eventName = 'EnforcementMechanismAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly mechanismId: string, public readonly name: string) {}
}

export class SourceDocumentAddedEvent implements IIDEF9DomainEvent {
  public readonly eventName = 'SourceDocumentAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly documentId: string, public readonly code: string) {}
}

export class ConstraintLinkAddedEvent implements IIDEF9DomainEvent {
  public readonly eventName = 'ConstraintLinkAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly linkId: string, public readonly type: string) {}
}
