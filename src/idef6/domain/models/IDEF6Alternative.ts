import { Position } from '../../../domain/models/Position';

export enum AlternativeStatus {
  PROPOSED = 'PROPOSED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  SUPERSEDED = 'SUPERSEDED',
}

export interface IDEF6AlternativeProps {
  id: string;
  name: string;
  description?: string;
  status?: AlternativeStatus;
  position?: Position;
}

export class IDEF6Alternative {
  public readonly id: string;
  private _name: string;
  private _description?: string;
  private _status: AlternativeStatus;
  private _position: Position;

  constructor(props: IDEF6AlternativeProps) {
    if (!props.id) throw new Error('Alternative ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Alternative name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this._description = props.description;
    this._status = props.status || AlternativeStatus.PROPOSED;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Alternative name cannot be empty.');
    this._name = name.trim();
  }

  public get description(): string | undefined {
    return this._description;
  }

  public setDescription(desc: string | undefined): void {
    this._description = desc;
  }

  public get status(): AlternativeStatus {
    return this._status;
  }

  public setStatus(status: AlternativeStatus): void {
    this._status = status;
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public isAccepted(): boolean {
    return this._status === 'ACCEPTED';
  }

  public isRejected(): boolean {
    return this._status === 'REJECTED';
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      position: this.position.toJSON(),
    };
  }
}
