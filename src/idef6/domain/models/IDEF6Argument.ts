import { Position } from '../../../domain/models/Position';

export enum ArgumentType {
  PRO = 'PRO',
  CON = 'CON',
}

export enum ArgumentStrength {
  STRONG = 'STRONG',
  MEDIUM = 'MEDIUM',
  WEAK = 'WEAK',
}

export interface IDEF6ArgumentProps {
  id: string;
  name: string;
  type: ArgumentType;
  strength?: ArgumentStrength;
  description?: string;
  position?: Position;
}

export class IDEF6Argument {
  public readonly id: string;
  private _name: string;
  public readonly type: ArgumentType;
  public readonly strength: ArgumentStrength;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF6ArgumentProps) {
    if (!props.id) throw new Error('Argument ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Argument name/text cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.type = props.type;
    this.strength = props.strength || ArgumentStrength.STRONG;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Argument name cannot be empty.');
    this._name = name.trim();
  }

  public get description(): string | undefined {
    return this._description;
  }

  public setDescription(desc: string | undefined): void {
    this._description = desc;
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public isPro(): boolean {
    return this.type === 'PRO';
  }

  public isCon(): boolean {
    return this.type === 'CON';
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      strength: this.strength,
      description: this.description,
      position: this.position.toJSON(),
    };
  }
}
