import { Position } from '../../../domain/models/Position';

export enum CriterionType {
  CONSTRAINT = 'CONSTRAINT',
  GOAL = 'GOAL',
  STANDARD = 'STANDARD',
}

export enum CriterionWeight {
  CRITICAL = 'CRITICAL',
  IMPORTANT = 'IMPORTANT',
  NICE_TO_HAVE = 'NICE_TO_HAVE',
}

export interface IDEF6CriterionProps {
  id: string;
  name: string;
  description?: string;
  type?: CriterionType;
  weight?: CriterionWeight;
  position?: Position;
}

export class IDEF6Criterion {
  public readonly id: string;
  private _name: string;
  private _description?: string;
  public readonly type: CriterionType;
  public readonly weight: CriterionWeight;
  private _position: Position;

  constructor(props: IDEF6CriterionProps) {
    if (!props.id) throw new Error('Criterion ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Criterion name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this._description = props.description;
    this.type = props.type || CriterionType.CONSTRAINT;
    this.weight = props.weight || CriterionWeight.IMPORTANT;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Criterion name cannot be empty.');
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

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      weight: this.weight,
      position: this.position.toJSON(),
    };
  }
}
