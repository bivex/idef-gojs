import { IDEF12OrgUnit, IDEF12OrgUnitProps } from './IDEF12OrgUnit';
import { IDEF12Position, IDEF12PositionProps } from './IDEF12Position';
import { IDEF12OrgRole, IDEF12OrgRoleProps } from './IDEF12OrgRole';
import { IDEF12Competency, IDEF12CompetencyProps } from './IDEF12Competency';
import { IDEF12Link, IDEF12LinkProps } from './IDEF12Link';

export interface IDEF12DiagramProps {
  id: string;
  name: string;
  description?: string;
  orgUnits?: IDEF12OrgUnitProps[];
  positions?: IDEF12PositionProps[];
  roles?: IDEF12OrgRoleProps[];
  competencies?: IDEF12CompetencyProps[];
  links?: IDEF12LinkProps[];
}

export class IDEF12Diagram {
  public readonly id: string;
  private _name: string;
  private _description?: string;
  private _orgUnits: Map<string, IDEF12OrgUnit>;
  private _positions: Map<string, IDEF12Position>;
  private _roles: Map<string, IDEF12OrgRole>;
  private _competencies: Map<string, IDEF12Competency>;
  private _links: Map<string, IDEF12Link>;

  constructor(props: IDEF12DiagramProps) {
    if (!props.id) throw new Error('Diagram ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Diagram name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this._description = props.description;
    this._orgUnits = new Map();
    this._positions = new Map();
    this._roles = new Map();
    this._competencies = new Map();
    this._links = new Map();

    if (props.orgUnits) {
      props.orgUnits.forEach((u) => this._orgUnits.set(u.id || u.code, new IDEF12OrgUnit(u)));
    }
    if (props.positions) {
      props.positions.forEach((p) => this._positions.set(p.id || p.code, new IDEF12Position(p)));
    }
    if (props.roles) {
      props.roles.forEach((r) => this._roles.set(r.id || r.code, new IDEF12OrgRole(r)));
    }
    if (props.competencies) {
      props.competencies.forEach((c) => this._competencies.set(c.id || c.code, new IDEF12Competency(c)));
    }
    if (props.links) {
      props.links.forEach((l) => this._links.set(l.id || `link-${Math.random()}`, new IDEF12Link(l)));
    }
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Diagram name cannot be empty.');
    this._name = name.trim();
  }

  public get description(): string | undefined {
    return this._description;
  }

  // Org Units
  public get orgUnits(): ReadonlyArray<IDEF12OrgUnit> {
    return Array.from(this._orgUnits.values());
  }

  public getOrgUnit(id: string): IDEF12OrgUnit | undefined {
    return this._orgUnits.get(id);
  }

  public addOrgUnit(unit: IDEF12OrgUnit): void {
    if (this._orgUnits.has(unit.id)) {
      throw new Error(`OrgUnit with ID "${unit.id}" already exists.`);
    }
    this._orgUnits.set(unit.id, unit);
  }

  public removeOrgUnit(id: string): void {
    this._orgUnits.delete(id);
    this.removeDanglingLinks(id);
  }

  // Positions
  public get positions(): ReadonlyArray<IDEF12Position> {
    return Array.from(this._positions.values());
  }

  public getPosition(id: string): IDEF12Position | undefined {
    return this._positions.get(id);
  }

  public addPosition(pos: IDEF12Position): void {
    if (this._positions.has(pos.id)) {
      throw new Error(`Position with ID "${pos.id}" already exists.`);
    }
    this._positions.set(pos.id, pos);
  }

  public removePosition(id: string): void {
    this._positions.delete(id);
    this.removeDanglingLinks(id);
  }

  // Roles
  public get roles(): ReadonlyArray<IDEF12OrgRole> {
    return Array.from(this._roles.values());
  }

  public getRole(id: string): IDEF12OrgRole | undefined {
    return this._roles.get(id);
  }

  public addRole(role: IDEF12OrgRole): void {
    if (this._roles.has(role.id)) {
      throw new Error(`OrgRole with ID "${role.id}" already exists.`);
    }
    this._roles.set(role.id, role);
  }

  public removeRole(id: string): void {
    this._roles.delete(id);
    this.removeDanglingLinks(id);
  }

  // Competencies
  public get competencies(): ReadonlyArray<IDEF12Competency> {
    return Array.from(this._competencies.values());
  }

  public getCompetency(id: string): IDEF12Competency | undefined {
    return this._competencies.get(id);
  }

  public addCompetency(comp: IDEF12Competency): void {
    if (this._competencies.has(comp.id)) {
      throw new Error(`Competency with ID "${comp.id}" already exists.`);
    }
    this._competencies.set(comp.id, comp);
  }

  public removeCompetency(id: string): void {
    this._competencies.delete(id);
    this.removeDanglingLinks(id);
  }

  // Links
  public get links(): ReadonlyArray<IDEF12Link> {
    return Array.from(this._links.values());
  }

  public getLink(id: string): IDEF12Link | undefined {
    return this._links.get(id);
  }

  public addLink(link: IDEF12Link): void {
    if (this._links.has(link.id)) {
      throw new Error(`Link with ID "${link.id}" already exists.`);
    }
    this._links.set(link.id, link);
  }

  public removeLink(id: string): void {
    this._links.delete(id);
  }

  public removeDanglingLinks(nodeId: string): void {
    const toRemove: string[] = [];
    this._links.forEach((l) => {
      if (l.sourceId === nodeId || l.targetId === nodeId) {
        toRemove.push(l.id);
      }
    });
    toRemove.forEach((id) => this._links.delete(id));
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      orgUnits: this.orgUnits.map((u) => u.toJSON()),
      positions: this.positions.map((p) => p.toJSON()),
      roles: this.roles.map((r) => r.toJSON()),
      competencies: this.competencies.map((c) => c.toJSON()),
      links: this.links.map((l) => l.toJSON()),
    };
  }

  public static fromJSON(json: any): IDEF12Diagram {
    return new IDEF12Diagram({
      id: json.id,
      name: json.name,
      description: json.description,
      orgUnits: json.orgUnits,
      positions: json.positions,
      roles: json.roles,
      competencies: json.competencies,
      links: json.links,
    });
  }
}
