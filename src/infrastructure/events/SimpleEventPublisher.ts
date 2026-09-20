import { IEventPublisherPort, DomainEventHandler } from '../../application/ports/outbound/IEventPublisherPort';
import { IDomainEvent } from '../../domain/events/DomainEvents';

export class SimpleEventPublisher implements IEventPublisherPort {
  private handlers: Map<string, Set<DomainEventHandler<any>>> = new Map();

  public async publish(event: IDomainEvent): Promise<void> {
    const list = this.handlers.get(event.eventName);
    if (list) {
      for (const handler of list) {
        try {
          await handler(event);
        } catch (err) {
          console.error(`Error in domain event handler for "${event.eventName}":`, err);
        }
      }
    }
  }

  public async publishAll(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  public subscribe<T extends IDomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler);

    return () => {
      this.handlers.get(eventName)?.delete(handler);
    };
  }
}
