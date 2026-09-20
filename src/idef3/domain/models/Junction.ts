import { Position } from '../../../domain/models/Position';
import { JunctionKind, SyncType, JunctionDirection } from './JunctionType';

export interface JunctionProps {
  id: string;
  kind: JunctionKind;
  syncType?: SyncType;
  direction?: JunctionDirection;
  junctionNumber?: string; // e.g. "J1", "J2"
  position?: Position;
}

export class Junction {
  public readonly id: string;
  private _kind: JunctionKind;
  private _syncType: SyncType;
  private _direction: JunctionDirection;
  private _junctionNumber: string;
  private _position: Position;

  constructor(props: JunctionProps) {
    if (!props.id) throw new Error('Junction ID cannot be empty.');
    this.id = props.id;
    this._kind = props.kind;
    this._syncType = props.syncType || SyncType.ASYNC;
    this._direction = props.direction || JunctionDirection.FAN_OUT;
    this._junctionNumber = props.junctionNumber || 'J1';
    this._position = props.position || Position.origin();
  }

  public get kind(): JunctionKind {
    return this._kind;
  }

  public get syncType(): SyncType {
    return this._syncType;
  }

  public get direction(): JunctionDirection {
    return this._direction;
  }

  public get junctionNumber(): string {
    return this._junctionNumber;
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public setKind(kind: JunctionKind): void {
    this._kind = kind;
  }

  public setSyncType(sync: SyncType): void {
    this._syncType = sync;
  }

  public setDirection(dir: JunctionDirection): void {
    this._direction = dir;
  }

  public isAnd(): boolean {
    return this._kind === JunctionKind.AND;
  }

  public isOr(): boolean {
    return this._kind === JunctionKind.OR;
  }

  public isXor(): boolean {
    return this._kind === JunctionKind.XOR;
  }

  public isSynchronous(): boolean {
    return this._syncType === SyncType.SYNC;
  }

  public isFanOut(): boolean {
    return this._direction === JunctionDirection.FAN_OUT;
  }

  public isFanIn(): boolean {
    return this._direction === JunctionDirection.FAN_IN;
  }

  public toJSON() {
    return {
      id: this.id,
      kind: this.kind,
      syncType: this.syncType,
      direction: this.direction,
      junctionNumber: this.junctionNumber,
      position: this.position.toJSON(),
    };
  }
}
