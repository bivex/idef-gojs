import { IDEF8Screen, IDEF8ScreenProps } from './IDEF8Screen';
import { IDEF8UserAction, IDEF8UserActionProps } from './IDEF8UserAction';
import { IDEF8SystemResponse, IDEF8SystemResponseProps } from './IDEF8SystemResponse';
import { IDEF8UserRole, IDEF8UserRoleProps } from './IDEF8UserRole';
import { IDEF8Link, IDEF8LinkProps } from './IDEF8Link';

export interface IDEF8DiagramProps {
  id: string;
  name: string;
  description?: string;
  screens?: IDEF8ScreenProps[];
  userActions?: IDEF8UserActionProps[];
  systemResponses?: IDEF8SystemResponseProps[];
  userRoles?: IDEF8UserRoleProps[];
  links?: IDEF8LinkProps[];
}

export class IDEF8Diagram {
  public readonly id: string;
  private _name: string;
  private _description?: string;
  private _screens: Map<string, IDEF8Screen>;
  private _userActions: Map<string, IDEF8UserAction>;
  private _systemResponses: Map<string, IDEF8SystemResponse>;
  private _userRoles: Map<string, IDEF8UserRole>;
  private _links: Map<string, IDEF8Link>;

  constructor(props: IDEF8DiagramProps) {
    if (!props.id) throw new Error('Diagram ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Diagram name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this._description = props.description;
    this._screens = new Map();
    this._userActions = new Map();
    this._systemResponses = new Map();
    this._userRoles = new Map();
    this._links = new Map();

    if (props.screens) {
      props.screens.forEach((s) => this._screens.set(s.id, new IDEF8Screen(s)));
    }
    if (props.userActions) {
      props.userActions.forEach((a) => this._userActions.set(a.id, new IDEF8UserAction(a)));
    }
    if (props.systemResponses) {
      props.systemResponses.forEach((r) => this._systemResponses.set(r.id, new IDEF8SystemResponse(r)));
    }
    if (props.userRoles) {
      props.userRoles.forEach((role) => this._userRoles.set(role.id, new IDEF8UserRole(role)));
    }
    if (props.links) {
      props.links.forEach((l) => this._links.set(l.id, new IDEF8Link(l)));
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

  // Screens
  public get screens(): ReadonlyArray<IDEF8Screen> {
    return Array.from(this._screens.values());
  }

  public getScreen(id: string): IDEF8Screen | undefined {
    return this._screens.get(id);
  }

  public addScreen(screen: IDEF8Screen): void {
    if (this._screens.has(screen.id)) {
      throw new Error(`Screen with ID "${screen.id}" already exists.`);
    }
    this._screens.set(screen.id, screen);
  }

  public removeScreen(id: string): void {
    this._screens.delete(id);
    this.removeDanglingLinks(id);
  }

  // User Actions
  public get userActions(): ReadonlyArray<IDEF8UserAction> {
    return Array.from(this._userActions.values());
  }

  public getUserAction(id: string): IDEF8UserAction | undefined {
    return this._userActions.get(id);
  }

  public addUserAction(action: IDEF8UserAction): void {
    if (this._userActions.has(action.id)) {
      throw new Error(`User action with ID "${action.id}" already exists.`);
    }
    this._userActions.set(action.id, action);
  }

  public removeUserAction(id: string): void {
    this._userActions.delete(id);
    this.removeDanglingLinks(id);
  }

  // System Responses
  public get systemResponses(): ReadonlyArray<IDEF8SystemResponse> {
    return Array.from(this._systemResponses.values());
  }

  public getSystemResponse(id: string): IDEF8SystemResponse | undefined {
    return this._systemResponses.get(id);
  }

  public addSystemResponse(response: IDEF8SystemResponse): void {
    if (this._systemResponses.has(response.id)) {
      throw new Error(`System response with ID "${response.id}" already exists.`);
    }
    this._systemResponses.set(response.id, response);
  }

  public removeSystemResponse(id: string): void {
    this._systemResponses.delete(id);
    this.removeDanglingLinks(id);
  }

  // User Roles
  public get userRoles(): ReadonlyArray<IDEF8UserRole> {
    return Array.from(this._userRoles.values());
  }

  public getUserRole(id: string): IDEF8UserRole | undefined {
    return this._userRoles.get(id);
  }

  public addUserRole(role: IDEF8UserRole): void {
    if (this._userRoles.has(role.id)) {
      throw new Error(`User role with ID "${role.id}" already exists.`);
    }
    this._userRoles.set(role.id, role);
  }

  public removeUserRole(id: string): void {
    this._userRoles.delete(id);
    this.removeDanglingLinks(id);
  }

  // Links
  public get links(): ReadonlyArray<IDEF8Link> {
    return Array.from(this._links.values());
  }

  public getLink(id: string): IDEF8Link | undefined {
    return this._links.get(id);
  }

  public addLink(link: IDEF8Link): void {
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
      this._screens.has(id) ||
      this._userActions.has(id) ||
      this._systemResponses.has(id) ||
      this._userRoles.has(id)
    );
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      screens: this.screens.map((s) => s.toJSON()),
      userActions: this.userActions.map((a) => a.toJSON()),
      systemResponses: this.systemResponses.map((r) => r.toJSON()),
      userRoles: this.userRoles.map((role) => role.toJSON()),
      links: this.links.map((l) => l.toJSON()),
    };
  }
}
