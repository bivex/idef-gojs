import { Position } from '../../../domain/models/Position';

export interface ActivityProps {
  id: string;
  name: string;
  nodeNumber?: string;   // e.g. "A0", "A1", "A2.1"
  detailNumber?: number; // 1 to 6 in bottom-right corner of box
  dNumber?: string;      // Decomposition reference, e.g. "D1"
  hasDecomposition?: boolean;
  position?: Position;
}

export class Activity {
  public readonly id: string;
  private _name: string;
  private _nodeNumber: string;
  private _detailNumber: number;
  private _dNumber?: string;
  private _hasDecomposition: boolean;
  private _position: Position;

  constructor(props: ActivityProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Activity ID cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Activity name cannot be empty.');
    }

    this.id = props.id;
    this._name = props.name.trim();
    this._nodeNumber = props.nodeNumber || 'A1';
    this._detailNumber = props.detailNumber ?? 1;
    this._dNumber = props.dNumber;
    this._hasDecomposition = props.hasDecomposition ?? false;
    this._position = props.position ?? Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public get nodeNumber(): string {
    return this._nodeNumber;
  }

  public get detailNumber(): number {
    return this._detailNumber;
  }

  public get dNumber(): string | undefined {
    return this._dNumber;
  }

  public get hasDecomposition(): boolean {
    return this._hasDecomposition;
  }

  public get position(): Position {
    return this._position;
  }

  public rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Activity name cannot be empty.');
    }
    this._name = newName.trim();
  }

  public setNodeNumber(num: string): void {
    this._nodeNumber = num;
  }

  public setDetailNumber(num: number): void {
    this._detailNumber = num;
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
      detailNumber: this.detailNumber,
      dNumber: this.dNumber,
      hasDecomposition: this.hasDecomposition,
      position: this.position.toJSON(),
    };
  }
}
