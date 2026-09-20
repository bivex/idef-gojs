import { Position } from '../../../domain/models/Position';
import { IDEF4Attribute } from './IDEF4Attribute';
import { IDEF4Method } from './IDEF4Method';

export interface IDEF4ClassProps {
  id: string;
  name: string;
  isAbstract?: boolean;
  isInterface?: boolean;
  attributes?: IDEF4Attribute[];
  methods?: IDEF4Method[];
  position?: Position;
}

export class IDEF4Class {
  public readonly id: string;
  private _name: string;
  public readonly isAbstract: boolean;
  public readonly isInterface: boolean;
  private _attributes: Map<string, IDEF4Attribute> = new Map();
  private _methods: Map<string, IDEF4Method> = new Map();
  private _position: Position;

  constructor(props: IDEF4ClassProps) {
    if (!props.id) throw new Error('Class ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Class name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.isAbstract = props.isAbstract ?? false;
    this.isInterface = props.isInterface ?? false;
    this._position = props.position || Position.origin();

    if (props.attributes) {
      for (const a of props.attributes) {
        this._attributes.set(a.name, a);
      }
    }
    if (props.methods) {
      for (const m of props.methods) {
        this._methods.set(m.name, m);
      }
    }
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Class name cannot be empty.');
    this._name = name.trim();
  }

  public get attributes(): IDEF4Attribute[] {
    return Array.from(this._attributes.values());
  }

  public get methods(): IDEF4Method[] {
    return Array.from(this._methods.values());
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public addAttribute(attr: IDEF4Attribute): void {
    if (this._attributes.has(attr.name)) {
      throw new Error(`Attribute "${attr.name}" already exists in class "${this.name}".`);
    }
    this._attributes.set(attr.name, attr);
  }

  public removeAttribute(name: string): void {
    this._attributes.delete(name);
  }

  public addMethod(method: IDEF4Method): void {
    if (this._methods.has(method.name)) {
      throw new Error(`Method "${method.name}" already exists in class "${this.name}".`);
    }
    this._methods.set(method.name, method);
  }

  public removeMethod(name: string): void {
    this._methods.delete(name);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      isAbstract: this.isAbstract,
      isInterface: this.isInterface,
      attributes: this.attributes.map((a) => a.toJSON()),
      methods: this.methods.map((m) => m.toJSON()),
      position: this.position.toJSON(),
    };
  }
}
