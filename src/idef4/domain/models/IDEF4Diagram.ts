import { IDEF4Class } from './IDEF4Class';
import { IDEF4Relationship } from './IDEF4Relationship';
import { ClassNotFoundError, RelationshipNotFoundError } from '../errors/IDEF4Error';

export interface IDEF4DiagramProps {
  id: string;
  name: string;
  classes?: IDEF4Class[];
  relationships?: IDEF4Relationship[];
}

export class IDEF4Diagram {
  public readonly id: string;
  private _name: string;
  private _classes: Map<string, IDEF4Class> = new Map();
  private _relationships: Map<string, IDEF4Relationship> = new Map();

  constructor(props: IDEF4DiagramProps) {
    if (!props.id) throw new Error('Diagram ID cannot be empty.');
    this.id = props.id;
    this._name = props.name || 'IDEF4 Class Diagram';

    if (props.classes) {
      for (const c of props.classes) this._classes.set(c.id, c);
    }
    if (props.relationships) {
      for (const r of props.relationships) this._relationships.set(r.id, r);
    }
  }

  public get name(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public get classes(): IDEF4Class[] {
    return Array.from(this._classes.values());
  }

  public get relationships(): IDEF4Relationship[] {
    return Array.from(this._relationships.values());
  }

  public getClass(id: string): IDEF4Class {
    const c = this._classes.get(id);
    if (!c) throw new ClassNotFoundError(id);
    return c;
  }

  public hasClass(id: string): boolean {
    return this._classes.has(id);
  }

  public addClass(cls: IDEF4Class): void {
    if (this._classes.has(cls.id)) {
      throw new Error(`Class "${cls.id}" already exists on diagram.`);
    }
    this._classes.set(cls.id, cls);
  }

  public removeClass(id: string): void {
    if (!this._classes.has(id)) throw new ClassNotFoundError(id);
    // Remove connected relationships
    const related = this.relationships.filter(
      (r) => r.sourceClassId === id || r.targetClassId === id
    );
    for (const r of related) {
      this._relationships.delete(r.id);
    }
    this._classes.delete(id);
  }

  public getRelationship(id: string): IDEF4Relationship {
    const r = this._relationships.get(id);
    if (!r) throw new RelationshipNotFoundError(id);
    return r;
  }

  public addRelationship(rel: IDEF4Relationship): void {
    if (this._relationships.has(rel.id)) {
      throw new Error(`Relationship "${rel.id}" already exists.`);
    }
    this._relationships.set(rel.id, rel);
  }

  public removeRelationship(id: string): void {
    if (!this._relationships.has(id)) throw new RelationshipNotFoundError(id);
    this._relationships.delete(id);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      classes: this.classes.map((c) => c.toJSON()),
      relationships: this.relationships.map((r) => r.toJSON()),
    };
  }
}
