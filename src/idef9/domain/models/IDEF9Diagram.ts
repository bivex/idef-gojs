import { IDEF9Constraint, IDEF9ConstraintProps } from './IDEF9Constraint';
import { IDEF9ControlledObject, IDEF9ControlledObjectProps } from './IDEF9ControlledObject';
import { IDEF9EnforcementMechanism, IDEF9EnforcementMechanismProps } from './IDEF9EnforcementMechanism';
import { IDEF9SourceDocument, IDEF9SourceDocumentProps } from './IDEF9SourceDocument';
import { IDEF9Link, IDEF9LinkProps } from './IDEF9Link';

export interface IDEF9DiagramProps {
  id: string;
  name: string;
  description?: string;
  constraints?: IDEF9ConstraintProps[];
  controlledObjects?: IDEF9ControlledObjectProps[];
  enforcementMechanisms?: IDEF9EnforcementMechanismProps[];
  sourceDocuments?: IDEF9SourceDocumentProps[];
  links?: IDEF9LinkProps[];
}

export class IDEF9Diagram {
  public readonly id: string;
  private _name: string;
  private _description?: string;
  private _constraints: Map<string, IDEF9Constraint>;
  private _controlledObjects: Map<string, IDEF9ControlledObject>;
  private _enforcementMechanisms: Map<string, IDEF9EnforcementMechanism>;
  private _sourceDocuments: Map<string, IDEF9SourceDocument>;
  private _links: Map<string, IDEF9Link>;

  constructor(props: IDEF9DiagramProps) {
    if (!props.id) throw new Error('Diagram ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Diagram name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this._description = props.description;
    this._constraints = new Map();
    this._controlledObjects = new Map();
    this._enforcementMechanisms = new Map();
    this._sourceDocuments = new Map();
    this._links = new Map();

    if (props.constraints) {
      props.constraints.forEach((c) => this._constraints.set(c.id, new IDEF9Constraint(c)));
    }
    if (props.controlledObjects) {
      props.controlledObjects.forEach((o) => this._controlledObjects.set(o.id, new IDEF9ControlledObject(o)));
    }
    if (props.enforcementMechanisms) {
      props.enforcementMechanisms.forEach((m) => this._enforcementMechanisms.set(m.id, new IDEF9EnforcementMechanism(m)));
    }
    if (props.sourceDocuments) {
      props.sourceDocuments.forEach((d) => this._sourceDocuments.set(d.id, new IDEF9SourceDocument(d)));
    }
    if (props.links) {
      props.links.forEach((l) => this._links.set(l.id, new IDEF9Link(l)));
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

  // Constraints
  public get constraints(): ReadonlyArray<IDEF9Constraint> {
    return Array.from(this._constraints.values());
  }

  public getConstraint(id: string): IDEF9Constraint | undefined {
    return this._constraints.get(id);
  }

  public addConstraint(constraint: IDEF9Constraint): void {
    if (this._constraints.has(constraint.id)) {
      throw new Error(`Constraint with ID "${constraint.id}" already exists.`);
    }
    this._constraints.set(constraint.id, constraint);
  }

  public removeConstraint(id: string): void {
    this._constraints.delete(id);
    this.removeDanglingLinks(id);
  }

  // Controlled Objects
  public get controlledObjects(): ReadonlyArray<IDEF9ControlledObject> {
    return Array.from(this._controlledObjects.values());
  }

  public getControlledObject(id: string): IDEF9ControlledObject | undefined {
    return this._controlledObjects.get(id);
  }

  public addControlledObject(obj: IDEF9ControlledObject): void {
    if (this._controlledObjects.has(obj.id)) {
      throw new Error(`Controlled object with ID "${obj.id}" already exists.`);
    }
    this._controlledObjects.set(obj.id, obj);
  }

  public removeControlledObject(id: string): void {
    this._controlledObjects.delete(id);
    this.removeDanglingLinks(id);
  }

  // Enforcement Mechanisms
  public get enforcementMechanisms(): ReadonlyArray<IDEF9EnforcementMechanism> {
    return Array.from(this._enforcementMechanisms.values());
  }

  public getEnforcementMechanism(id: string): IDEF9EnforcementMechanism | undefined {
    return this._enforcementMechanisms.get(id);
  }

  public addEnforcementMechanism(mech: IDEF9EnforcementMechanism): void {
    if (this._enforcementMechanisms.has(mech.id)) {
      throw new Error(`Enforcement mechanism with ID "${mech.id}" already exists.`);
    }
    this._enforcementMechanisms.set(mech.id, mech);
  }

  public removeEnforcementMechanism(id: string): void {
    this._enforcementMechanisms.delete(id);
    this.removeDanglingLinks(id);
  }

  // Source Documents
  public get sourceDocuments(): ReadonlyArray<IDEF9SourceDocument> {
    return Array.from(this._sourceDocuments.values());
  }

  public getSourceDocument(id: string): IDEF9SourceDocument | undefined {
    return this._sourceDocuments.get(id);
  }

  public addSourceDocument(doc: IDEF9SourceDocument): void {
    if (this._sourceDocuments.has(doc.id)) {
      throw new Error(`Source document with ID "${doc.id}" already exists.`);
    }
    this._sourceDocuments.set(doc.id, doc);
  }

  public removeSourceDocument(id: string): void {
    this._sourceDocuments.delete(id);
    this.removeDanglingLinks(id);
  }

  // Links
  public get links(): ReadonlyArray<IDEF9Link> {
    return Array.from(this._links.values());
  }

  public getLink(id: string): IDEF9Link | undefined {
    return this._links.get(id);
  }

  public addLink(link: IDEF9Link): void {
    if (this._links.has(link.id)) {
      throw new Error(`Link with ID "${link.id}" already exists.`);
    }
    this._links.set(link.id, link);
  }

  public removeLink(id: string): void {
    this._links.delete(id);
  }

  private removeDanglingLinks(elementId: string): void {
    for (const [id, link] of this._links.entries()) {
      if (link.sourceId === elementId || link.targetId === elementId) {
        this._links.delete(id);
      }
    }
  }

  public hasElement(id: string): boolean {
    return (
      this._constraints.has(id) ||
      this._controlledObjects.has(id) ||
      this._enforcementMechanisms.has(id) ||
      this._sourceDocuments.has(id)
    );
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      constraints: this.constraints.map((c) => c.toJSON()),
      controlledObjects: this.controlledObjects.map((o) => o.toJSON()),
      enforcementMechanisms: this.enforcementMechanisms.map((m) => m.toJSON()),
      sourceDocuments: this.sourceDocuments.map((d) => d.toJSON()),
      links: this.links.map((l) => l.toJSON()),
    };
  }
}
