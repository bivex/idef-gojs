import { IDomainEvent } from '../../../domain/events/DomainEvents';

export type DomainEventHandler<T extends IDomainEvent = IDomainEvent> = (event: T) => void | Promise<void>;

export interface IEventPublisherPort {
  publish(event: IDomainEvent): Promise<void>;
  publishAll(events: IDomainEvent[]): Promise<void>;
  subscribe<T extends IDomainEvent>(eventName: string, handler: DomainEventHandler<T>): () => void;
}
