export interface IIDEF8DomainEvent {
  readonly eventName: string;
  readonly occurredOn: Date;
}

export class ScreenCreatedEvent implements IIDEF8DomainEvent {
  public readonly eventName = 'ScreenCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly screenId: string, public readonly name: string) {}
}

export class ScreenRemovedEvent implements IIDEF8DomainEvent {
  public readonly eventName = 'ScreenRemoved';
  public readonly occurredOn = new Date();
  constructor(public readonly screenId: string) {}
}

export class UserActionAddedEvent implements IIDEF8DomainEvent {
  public readonly eventName = 'UserActionAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly actionId: string, public readonly name: string) {}
}

export class SystemResponseAddedEvent implements IIDEF8DomainEvent {
  public readonly eventName = 'SystemResponseAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly responseId: string, public readonly name: string) {}
}

export class UserRoleAddedEvent implements IIDEF8DomainEvent {
  public readonly eventName = 'UserRoleAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly roleId: string, public readonly name: string) {}
}

export class InteractionLinkAddedEvent implements IIDEF8DomainEvent {
  public readonly eventName = 'InteractionLinkAdded';
  public readonly occurredOn = new Date();
  constructor(public readonly linkId: string, public readonly type: string) {}
}
