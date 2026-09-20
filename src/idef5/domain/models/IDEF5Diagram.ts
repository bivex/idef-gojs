import { IDEF5Kind } from './IDEF5Kind';
import { IDEF5Relation } from './IDEF5Relation';
import { KindNotFoundError, RelationNotFoundError } from '../errors/IDEF5Error';

export type SchematicType = 'CLASSIFICATION' | 'COMPOSITION' | 'RELATION';

export interface IDEF5DiagramProps {
  id: string;
  name: string;
  schematicType?: SchematicType;
  kinds?: IDEF5Kind[];
  relations?: IDEF5Relation[];
}

export class IDEF5Diagram {
  public readonly id: string;
  private _name: string;
  public readonly schematicType: SchematicType;
  private _kinds: Map<string, IDEF5Kind> = new Map();
  private _relations: Map<string, IDEF5Relation> = new Map();

  constructor(props: IDEF5DiagramProps) {
    if (!props.id) throw new Error('Diagram ID cannot be empty.');
    this.id = props.id;
    this._name = props.name || 'IDEF5 Ontology Schematic';
    this.schematicType = props.schematicType || 'RELATION';

    if (props.kinds) {
      for (const k of props.kinds) this._kinds.set(k.id, k);
    }
    if (props.relations) {
      for (const r of props.relations) this._relations.set(r.id, r);
    }
  }

  public get name(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public get kinds(): IDEF5Kind[] {
    return Array.from(this._kinds.values());
  }

  public get relations(): IDEF5Relation[] {
    return Array.from(this._relations.values());
  }

  public getKind(id: string): IDEF5Kind {
    const k = this._kinds.get(id);
    if (!k) throw new KindNotFoundError(id);
    return k;
  }

  public hasKind(id: string): boolean {
    return this._kinds.has(id);
  }

  public addKind(kind: IDEF5Kind): void {
    if (this._kinds.has(kind.id)) {
      throw new Error(`Kind "${kind.id}" already exists on schematic.`);
    }
    this._kinds.set(kind.id, kind);
  }

  public removeKind(id: string): void {
    if (!this._kinds.has(id)) throw new KindNotFoundError(id);
    const related = this.relations.filter(
      (r) => r.sourceKindId === id || r.targetKindId === id
    );
    for (const r of related) {
      this._relations.delete(r.id);
    }
    this._kinds.delete(id);
  }

  public getRelation(id: string): IDEF5Relation {
    const r = this._relations.get(id);
    if (!r) throw new RelationNotFoundError(id);
    return r;
  }

  public addRelation(rel: IDEF5Relation): void {
    if (this._relations.has(rel.id)) {
      throw new Error(`Relation "${rel.id}" already exists on schematic.`);
    }
    this._relations.set(rel.id, rel);
  }

  public removeRelation(id: string): void {
    if (!this._relations.has(id)) throw new RelationNotFoundError(id);
    this._relations.delete(id);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      schematicType: this.schematicType,
      kinds: this.kinds.map((k) => k.toJSON()),
      relations: this.relations.map((r) => r.toJSON()),
    };
  }
}
