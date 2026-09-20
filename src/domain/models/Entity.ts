import { Attribute } from './Attribute';
import { Position } from './Position';

export interface EntityProps {
  id: string;
  name: string;
  number?: number;
  isDependent?: boolean;
  attributes?: Attribute[];
  position?: Position;
}

export class Entity {
  public readonly id: string;
  private _name: string;
  private _number: number;
  private _isDependent: boolean;
  private _attributes: Map<string, Attribute> = new Map();
  private _position: Position;

  constructor(props: EntityProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Entity id cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Entity name cannot be empty.');
    }

    this.id = props.id;
    this._name = props.name.trim();
    this._number = props.number ?? 1;
    this._isDependent = props.isDependent ?? false;
    this._position = props.position ?? Position.origin();

    if (props.attributes) {
      for (const attr of props.attributes) {
        this._attributes.set(attr.name.toLowerCase(), attr);
      }
    }
  }

  public get name(): string {
    return this._name;
  }

  public get number(): number {
    return this._number;
  }

  public get isDependent(): boolean {
    return this._isDependent;
  }

  public get position(): Position {
    return this._position;
  }

  public rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Entity name cannot be empty.');
    }
    this._name = newName.trim();
  }

  public setNumber(num: number): void {
    if (num < 0) {
      throw new Error('Entity number must be non-negative.');
    }
    this._number = num;
  }

  public setDependent(isDependent: boolean): void {
    this._isDependent = isDependent;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public get attributes(): Attribute[] {
    return Array.from(this._attributes.values());
  }

  public get primaryKeyAttributes(): Attribute[] {
    return this.attributes.filter((a) => a.isPrimaryKey);
  }

  public get nonKeyAttributes(): Attribute[] {
    return this.attributes.filter((a) => !a.isPrimaryKey);
  }

  public hasAttribute(name: string): boolean {
    return this._attributes.has(name.toLowerCase());
  }

  public getAttribute(name: string): Attribute | undefined {
    return this._attributes.get(name.toLowerCase());
  }

  public addAttribute(attr: Attribute): void {
    const key = attr.name.toLowerCase();
    if (this._attributes.has(key)) {
      throw new Error(`Attribute with name "${attr.name}" already exists in entity "${this.name}".`);
    }
    this._attributes.set(key, attr);
  }

  public updateAttribute(attr: Attribute): void {
    const key = attr.name.toLowerCase();
    if (!this._attributes.has(key)) {
      throw new Error(`Attribute with name "${attr.name}" does not exist in entity "${this.name}".`);
    }
    this._attributes.set(key, attr);
  }

  public removeAttribute(name: string): void {
    const key = name.toLowerCase();
    if (!this._attributes.has(key)) {
      throw new Error(`Attribute "${name}" not found in entity "${this.name}".`);
    }
    this._attributes.delete(key);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      number: this.number,
      isDependent: this.isDependent,
      position: this.position.toJSON(),
      attributes: this.attributes.map((a) => a.toJSON()),
    };
  }
}
