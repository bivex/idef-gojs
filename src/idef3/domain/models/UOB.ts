import { Position } from '../../../domain/models/Position';

export interface UOBProps {
  id: string;
  name: string;
  nodeNumber?: string;  // e.g. "1", "2", "2.1"
  uobNumber?: string;   // e.g. "UOB-101"
  hasDecomposition?: boolean;
  dNumber?: string;     // e.g. "D1"
  position?: Position;
}

export class UOB {
  public readonly id: string;
  private _name: string;
  private _nodeNumber: string;
  private _uobNumber: string;
  private _hasDecomposition: boolean;
  private _dNumber?: string;
  private _position: Position;

  constructor(props: UOBProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('UOB ID cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('UOB name cannot be empty.');
    }

    this.id = props.id;
    this._name = props.name.trim();
    this._nodeNumber = props.nodeNumber || '1';
    this._uobNumber = props.uobNumber || `UOB-${props.nodeNumber || '1'}`;
    this._hasDecomposition = props.hasDecomposition ?? false;
    this._dNumber = props.dNumber;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public get nodeNumber(): string {
    return this._nodeNumber;
  }

  public get uobNumber(): string {
    return this._uobNumber;
  }

  public get hasDecomposition(): boolean {
    return this._hasDecomposition;
  }

  public get dNumber(): string | undefined {
    return this._dNumber;
  }

  public get position(): Position {
    return this._position;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('UOB name cannot be empty.');
    this._name = name.trim();
  }

  public setNodeNumber(num: string): void {
    this._nodeNumber = num;
  }

  public setUOBNumber(uobNum: string): void {
    this._uobNumber = uobNum;
  }

  public setDecomposition(hasDecomp: boolean, dNumber?: string): void {
    this._hasDecomposition = hasDecomp;
    this._dNumber = dNumber;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      nodeNumber: this.nodeNumber,
      uobNumber: this.uobNumber,
      hasDecomposition: this.hasDecomposition,
      dNumber: this.dNumber,
      position: this.position.toJSON(),
    };
  }
}
