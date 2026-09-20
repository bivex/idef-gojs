export interface IIDEF12Event {
  readonly eventName: string;
  readonly occurredOn: Date;
}

export class IDEF12DiagramChangedEvent implements IIDEF12Event {
  public readonly eventName = 'IDEF12DiagramChanged';
  public readonly occurredOn = new Date();
  constructor(public readonly diagramId: string) {}
}
