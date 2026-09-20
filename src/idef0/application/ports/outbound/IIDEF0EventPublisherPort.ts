import { IDEF0DomainEvent } from '../../../domain/events/IDEF0Events';

export interface IIDEF0EventPublisherPort {
  publish(event: IDEF0DomainEvent): void;
  subscribe(eventName: string, handler: (event: IDEF0DomainEvent) => void): void;
}
