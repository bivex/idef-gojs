import { Position } from '../../../domain/models/Position';

export enum IssueStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  POSTPONED = 'POSTPONED',
}

export enum IssuePriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface IDEF6IssueProps {
  id: string;
  name: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  position?: Position;
}

export class IDEF6Issue {
  public readonly id: string;
  private _name: string;
  private _description?: string;
  private _status: IssueStatus;
  private _priority: IssuePriority;
  private _position: Position;

  constructor(props: IDEF6IssueProps) {
    if (!props.id) throw new Error('Issue ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Issue name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this._description = props.description;
    this._status = props.status || IssueStatus.OPEN;
    this._priority = props.priority || IssuePriority.HIGH;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Issue name cannot be empty.');
    this._name = name.trim();
  }

  public get description(): string | undefined {
    return this._description;
  }

  public setDescription(desc: string | undefined): void {
    this._description = desc;
  }

  public get status(): IssueStatus {
    return this._status;
  }

  public setStatus(status: IssueStatus): void {
    this._status = status;
  }

  public get priority(): IssuePriority {
    return this._priority;
  }

  public setPriority(priority: IssuePriority): void {
    this._priority = priority;
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public isResolved(): boolean {
    return this._status === 'RESOLVED';
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      priority: this.priority,
      position: this.position.toJSON(),
    };
  }
}
