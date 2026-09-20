import { ICOMType, TunnelType } from './ICOMType';

export interface ArrowProps {
  id: string;
  name: string;
  sourceActivityId?: string; // undefined if external boundary arrow entering diagram
  targetActivityId?: string; // undefined if external boundary arrow leaving diagram
  icomType: ICOMType;
  tunnel?: TunnelType;
  cNumber?: string;
}

export class Arrow {
  public readonly id: string;
  private _name: string;
  public readonly sourceActivityId?: string;
  public readonly targetActivityId?: string;
  private _icomType: ICOMType;
  private _tunnel: TunnelType;
  private _cNumber?: string;

  constructor(props: ArrowProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Arrow ID cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Arrow name (noun phrase) cannot be empty in IDEF0.');
    }
    if (!props.sourceActivityId && !props.targetActivityId) {
      throw new Error('Arrow must have at least a source or a target activity.');
    }

    this.id = props.id;
    this._name = props.name.trim();
    this.sourceActivityId = props.sourceActivityId;
    this.targetActivityId = props.targetActivityId;
    this._icomType = props.icomType;
    this._tunnel = props.tunnel ?? TunnelType.NONE;
    this._cNumber = props.cNumber;
  }

  public get name(): string {
    return this._name;
  }

  public get icomType(): ICOMType {
    return this._icomType;
  }

  public get tunnel(): TunnelType {
    return this._tunnel;
  }

  public get cNumber(): string | undefined {
    return this._cNumber;
  }

  public setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Arrow name cannot be empty.');
    }
    this._name = name.trim();
  }

  public setIcomType(type: ICOMType): void {
    this._icomType = type;
  }

  public setTunnel(tunnel: TunnelType): void {
    this._tunnel = tunnel;
  }

  public isInput(): boolean {
    return this._icomType === ICOMType.INPUT;
  }

  public isControl(): boolean {
    return this._icomType === ICOMType.CONTROL;
  }

  public isOutput(): boolean {
    return this._icomType === ICOMType.OUTPUT;
  }

  public isMechanism(): boolean {
    return this._icomType === ICOMType.MECHANISM;
  }

  public isCall(): boolean {
    return this._icomType === ICOMType.CALL;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      sourceActivityId: this.sourceActivityId,
      targetActivityId: this.targetActivityId,
      icomType: this.icomType,
      tunnel: this.tunnel,
      cNumber: this.cNumber,
    };
  }
}
