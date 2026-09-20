import { IDEF6Issue } from './IDEF6Issue';
import { IDEF6Alternative } from './IDEF6Alternative';
import { IDEF6Criterion } from './IDEF6Criterion';
import { IDEF6Argument } from './IDEF6Argument';
import { IDEF6Link } from './IDEF6Link';
import {
  IssueNotFoundError,
  AlternativeNotFoundError,
  CriterionNotFoundError,
  ArgumentNotFoundError,
  LinkNotFoundError,
} from '../errors/IDEF6Error';

export interface IDEF6DiagramProps {
  id: string;
  name: string;
  issues?: IDEF6Issue[];
  alternatives?: IDEF6Alternative[];
  criteria?: IDEF6Criterion[];
  arguments?: IDEF6Argument[];
  links?: IDEF6Link[];
}

export class IDEF6Diagram {
  public readonly id: string;
  private _name: string;
  private _issues: Map<string, IDEF6Issue> = new Map();
  private _alternatives: Map<string, IDEF6Alternative> = new Map();
  private _criteria: Map<string, IDEF6Criterion> = new Map();
  private _arguments: Map<string, IDEF6Argument> = new Map();
  private _links: Map<string, IDEF6Link> = new Map();

  constructor(props: IDEF6DiagramProps) {
    if (!props.id) throw new Error('Diagram ID cannot be empty.');
    this.id = props.id;
    this._name = props.name || 'IDEF6 Design Rationale Diagram';

    if (props.issues) {
      for (const i of props.issues) this._issues.set(i.id, i);
    }
    if (props.alternatives) {
      for (const a of props.alternatives) this._alternatives.set(a.id, a);
    }
    if (props.criteria) {
      for (const c of props.criteria) this._criteria.set(c.id, c);
    }
    if (props.arguments) {
      for (const arg of props.arguments) this._arguments.set(arg.id, arg);
    }
    if (props.links) {
      for (const l of props.links) this._links.set(l.id, l);
    }
  }

  public get name(): string {
    return this._name;
  }

  public setName(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Diagram name cannot be empty.');
    this._name = name.trim();
  }

  public get issues(): IDEF6Issue[] {
    return Array.from(this._issues.values());
  }

  public getIssue(id: string): IDEF6Issue {
    const item = this._issues.get(id);
    if (!item) throw new IssueNotFoundError(id);
    return item;
  }

  public addIssue(issue: IDEF6Issue): void {
    if (this._issues.has(issue.id)) {
      throw new Error(`Issue "${issue.id}" already exists.`);
    }
    this._issues.set(issue.id, issue);
  }

  public removeIssue(id: string): void {
    this._issues.delete(id);
    // Cascade remove links connected to this issue
    for (const [linkId, link] of this._links.entries()) {
      if (link.sourceId === id || link.targetId === id) {
        this._links.delete(linkId);
      }
    }
  }

  public get alternatives(): IDEF6Alternative[] {
    return Array.from(this._alternatives.values());
  }

  public getAlternative(id: string): IDEF6Alternative {
    const item = this._alternatives.get(id);
    if (!item) throw new AlternativeNotFoundError(id);
    return item;
  }

  public addAlternative(alt: IDEF6Alternative): void {
    if (this._alternatives.has(alt.id)) {
      throw new Error(`Alternative "${alt.id}" already exists.`);
    }
    this._alternatives.set(alt.id, alt);
  }

  public removeAlternative(id: string): void {
    this._alternatives.delete(id);
    for (const [linkId, link] of this._links.entries()) {
      if (link.sourceId === id || link.targetId === id) {
        this._links.delete(linkId);
      }
    }
  }

  public get criteria(): IDEF6Criterion[] {
    return Array.from(this._criteria.values());
  }

  public getCriterion(id: string): IDEF6Criterion {
    const item = this._criteria.get(id);
    if (!item) throw new CriterionNotFoundError(id);
    return item;
  }

  public addCriterion(crit: IDEF6Criterion): void {
    if (this._criteria.has(crit.id)) {
      throw new Error(`Criterion "${crit.id}" already exists.`);
    }
    this._criteria.set(crit.id, crit);
  }

  public removeCriterion(id: string): void {
    this._criteria.delete(id);
    for (const [linkId, link] of this._links.entries()) {
      if (link.sourceId === id || link.targetId === id) {
        this._links.delete(linkId);
      }
    }
  }

  public get arguments(): IDEF6Argument[] {
    return Array.from(this._arguments.values());
  }

  public getArgument(id: string): IDEF6Argument {
    const item = this._arguments.get(id);
    if (!item) throw new ArgumentNotFoundError(id);
    return item;
  }

  public addArgument(arg: IDEF6Argument): void {
    if (this._arguments.has(arg.id)) {
      throw new Error(`Argument "${arg.id}" already exists.`);
    }
    this._arguments.set(arg.id, arg);
  }

  public removeArgument(id: string): void {
    this._arguments.delete(id);
    for (const [linkId, link] of this._links.entries()) {
      if (link.sourceId === id || link.targetId === id) {
        this._links.delete(linkId);
      }
    }
  }

  public get links(): IDEF6Link[] {
    return Array.from(this._links.values());
  }

  public getLink(id: string): IDEF6Link {
    const item = this._links.get(id);
    if (!item) throw new LinkNotFoundError(id);
    return item;
  }

  public addLink(link: IDEF6Link): void {
    if (this._links.has(link.id)) {
      throw new Error(`Link "${link.id}" already exists.`);
    }
    this._links.set(link.id, link);
  }

  public removeLink(id: string): void {
    this._links.delete(id);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      issues: this.issues.map((i) => i.toJSON()),
      alternatives: this.alternatives.map((a) => a.toJSON()),
      criteria: this.criteria.map((c) => c.toJSON()),
      arguments: this.arguments.map((arg) => arg.toJSON()),
      links: this.links.map((l) => l.toJSON()),
    };
  }
}
