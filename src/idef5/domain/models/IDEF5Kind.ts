import { Position } from '../../../domain/models/Position';
import { IDEF5Property } from './IDEF5Property';

export interface IDEF5KindProps {
  id: string;
  name: string;
  description?: string;
  isIndividual?: boolean;
  properties?: IDEF5Property[];
  position?: Position;
}

export class IDEF5Kind {
  public readonly id: string;
  private _name: string;
  private _description?: string;
  public readonly isIndividual: boolean;
  private _properties: Map<string, IDEF5Property> = new Map();
  private _position: Position;

  constructor(props: IDEF5KindProps) {
    if (!props.id) throw new Error('Kind ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Kind name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this._description = props.description;
    this.isIndividual = props.isIndividual ?? false;
    this._position = props.position || Position.origin();

    if (props.properties) {
      for (const p of props.properties) {
        this._properties.set(p.name, p);
      }
    }
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Kind name cannot be empty.');
    this._name = name.trim();
  }

  public get description(): string | undefined {
    return this._description;
  }

  public setDescription(desc: string | undefined): void {
    this._description = desc;
  }

  public get properties(): IDEF5Property[] {
    return Array.from(this._properties.values());
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public addProperty(prop: IDEF5Property): void {
    if (this._properties.has(prop.name)) {
      throw new Error(`Property "${prop.name}" already exists on Kind "${this.name}".`);
    }
    this._properties.set(prop.name, prop);
  }

  public removeProperty(name: string): void {
    this._properties.delete(name);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isIndividual: this.isIndividual,
      properties: this.properties.map((p) => p.toJSON()),
      position: this.position.toJSON(),
    };
  }
}
