import { UOB } from './UOB';
import { Junction } from './Junction';
import { Link } from './Link';
import { Referent } from './Referent';
import {
  UOBNotFoundError,
  JunctionNotFoundError,
  LinkNotFoundError,
  ReferentNotFoundError,
} from '../errors/IDEF3Error';

export interface IDEF3DiagramProps {
  id: string;
  scenarioNumber: string;
  title: string;
  parentDiagramId?: string;
  parentUOBId?: string;
  uobs?: UOB[];
  junctions?: Junction[];
  links?: Link[];
  referents?: Referent[];
}

export class IDEF3Diagram {
  public readonly id: string;
  public readonly scenarioNumber: string;
  private _title: string;
  public readonly parentDiagramId?: string;
  public readonly parentUOBId?: string;

  private _uobs: Map<string, UOB> = new Map();
  private _junctions: Map<string, Junction> = new Map();
  private _links: Map<string, Link> = new Map();
  private _referents: Map<string, Referent> = new Map();

  constructor(props: IDEF3DiagramProps) {
    if (!props.id) throw new Error('Diagram ID cannot be empty.');
    this.id = props.id;
    this.scenarioNumber = props.scenarioNumber || '1';
    this._title = props.title || 'Untitled IDEF3 Scenario';
    this.parentDiagramId = props.parentDiagramId;
    this.parentUOBId = props.parentUOBId;

    if (props.uobs) {
      for (const u of props.uobs) this._uobs.set(u.id, u);
    }
    if (props.junctions) {
      for (const j of props.junctions) this._junctions.set(j.id, j);
    }
    if (props.links) {
      for (const l of props.links) this._links.set(l.id, l);
    }
    if (props.referents) {
      for (const r of props.referents) this._referents.set(r.id, r);
    }
  }

  public get title(): string {
    return this._title;
  }

  public setTitle(title: string): void {
    this._title = title;
  }

  public get uobs(): UOB[] {
    return Array.from(this._uobs.values());
  }

  public get junctions(): Junction[] {
    return Array.from(this._junctions.values());
  }

  public get links(): Link[] {
    return Array.from(this._links.values());
  }

  public get referents(): Referent[] {
    return Array.from(this._referents.values());
  }

  public getUOB(id: string): UOB {
    const uob = this._uobs.get(id);
    if (!uob) throw new UOBNotFoundError(id);
    return uob;
  }

  public hasUOB(id: string): boolean {
    return this._uobs.has(id);
  }

  public addUOB(uob: UOB): void {
    if (this._uobs.has(uob.id)) {
      throw new Error(`UOB with ID "${uob.id}" already exists on diagram.`);
    }
    this._uobs.set(uob.id, uob);
  }

  public removeUOB(id: string): void {
    if (!this._uobs.has(id)) throw new UOBNotFoundError(id);
    // Remove connected links
    const relatedLinks = this.links.filter((l) => l.sourceId === id || l.targetId === id);
    for (const l of relatedLinks) {
      this._links.delete(l.id);
    }
    this._uobs.delete(id);
  }

  public getJunction(id: string): Junction {
    const j = this._junctions.get(id);
    if (!j) throw new JunctionNotFoundError(id);
    return j;
  }

  public hasJunction(id: string): boolean {
    return this._junctions.has(id);
  }

  public addJunction(junction: Junction): void {
    if (this._junctions.has(junction.id)) {
      throw new Error(`Junction "${junction.id}" already exists on diagram.`);
    }
    this._junctions.set(junction.id, junction);
  }

  public removeJunction(id: string): void {
    if (!this._junctions.has(id)) throw new JunctionNotFoundError(id);
    const relatedLinks = this.links.filter((l) => l.sourceId === id || l.targetId === id);
    for (const l of relatedLinks) {
      this._links.delete(l.id);
    }
    this._junctions.delete(id);
  }

  public getLink(id: string): Link {
    const l = this._links.get(id);
    if (!l) throw new LinkNotFoundError(id);
    return l;
  }

  public addLink(link: Link): void {
    if (this._links.has(link.id)) {
      throw new Error(`Link "${link.id}" already exists on diagram.`);
    }
    this._links.set(link.id, link);
  }

  public removeLink(id: string): void {
    if (!this._links.has(id)) throw new LinkNotFoundError(id);
    this._links.delete(id);
  }

  public getReferent(id: string): Referent {
    const r = this._referents.get(id);
    if (!r) throw new ReferentNotFoundError(id);
    return r;
  }

  public addReferent(referent: Referent): void {
    if (this._referents.has(referent.id)) {
      throw new Error(`Referent "${referent.id}" already exists.`);
    }
    this._referents.set(referent.id, referent);
  }

  public removeReferent(id: string): void {
    if (!this._referents.has(id)) throw new ReferentNotFoundError(id);
    this._referents.delete(id);
  }

  public toJSON() {
    return {
      id: this.id,
      scenarioNumber: this.scenarioNumber,
      title: this.title,
      parentDiagramId: this.parentDiagramId,
      parentUOBId: this.parentUOBId,
      uobs: this.uobs.map((u) => u.toJSON()),
      junctions: this.junctions.map((j) => j.toJSON()),
      links: this.links.map((l) => l.toJSON()),
      referents: this.referents.map((r) => r.toJSON()),
    };
  }
}
