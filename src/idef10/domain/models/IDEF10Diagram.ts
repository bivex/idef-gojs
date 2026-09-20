import { IDEF10Component, IDEF10ComponentProps } from './IDEF10Component';
import { IDEF10ExecutionNode, IDEF10ExecutionNodeProps } from './IDEF10ExecutionNode';
import { IDEF10Interface, IDEF10InterfaceProps } from './IDEF10Interface';
import { IDEF10Artifact, IDEF10ArtifactProps } from './IDEF10Artifact';
import { IDEF10Link, IDEF10LinkProps } from './IDEF10Link';

export interface IDEF10DiagramProps {
  id: string;
  name: string;
  description?: string;
  components?: IDEF10ComponentProps[];
  executionNodes?: IDEF10ExecutionNodeProps[];
  interfaces?: IDEF10InterfaceProps[];
  artifacts?: IDEF10ArtifactProps[];
  links?: IDEF10LinkProps[];
}

export class IDEF10Diagram {
  public readonly id: string;
  private _name: string;
  private _description?: string;
  private _components: Map<string, IDEF10Component>;
  private _executionNodes: Map<string, IDEF10ExecutionNode>;
  private _interfaces: Map<string, IDEF10Interface>;
  private _artifacts: Map<string, IDEF10Artifact>;
  private _links: Map<string, IDEF10Link>;

  constructor(props: IDEF10DiagramProps) {
    if (!props.id) throw new Error('Diagram ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Diagram name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this._description = props.description;
    this._components = new Map();
    this._executionNodes = new Map();
    this._interfaces = new Map();
    this._artifacts = new Map();
    this._links = new Map();

    if (props.components) {
      props.components.forEach((c) => this._components.set(c.id, new IDEF10Component(c)));
    }
    if (props.executionNodes) {
      props.executionNodes.forEach((n) => this._executionNodes.set(n.id, new IDEF10ExecutionNode(n)));
    }
    if (props.interfaces) {
      props.interfaces.forEach((i) => this._interfaces.set(i.id, new IDEF10Interface(i)));
    }
    if (props.artifacts) {
      props.artifacts.forEach((a) => this._artifacts.set(a.id, new IDEF10Artifact(a)));
    }
    if (props.links) {
      props.links.forEach((l) => this._links.set(l.id, new IDEF10Link(l)));
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

  // Components
  public get components(): ReadonlyArray<IDEF10Component> {
    return Array.from(this._components.values());
  }

  public getComponent(id: string): IDEF10Component | undefined {
    return this._components.get(id);
  }

  public addComponent(comp: IDEF10Component): void {
    if (this._components.has(comp.id)) {
      throw new Error(`Component with ID "${comp.id}" already exists.`);
    }
    this._components.set(comp.id, comp);
  }

  public removeComponent(id: string): void {
    this._components.delete(id);
    this.removeDanglingLinks(id);
  }

  // Execution Nodes
  public get executionNodes(): ReadonlyArray<IDEF10ExecutionNode> {
    return Array.from(this._executionNodes.values());
  }

  public getExecutionNode(id: string): IDEF10ExecutionNode | undefined {
    return this._executionNodes.get(id);
  }

  public addExecutionNode(node: IDEF10ExecutionNode): void {
    if (this._executionNodes.has(node.id)) {
      throw new Error(`ExecutionNode with ID "${node.id}" already exists.`);
    }
    this._executionNodes.set(node.id, node);
  }

  public removeExecutionNode(id: string): void {
    this._executionNodes.delete(id);
    this.removeDanglingLinks(id);
  }

  // Interfaces
  public get interfaces(): ReadonlyArray<IDEF10Interface> {
    return Array.from(this._interfaces.values());
  }

  public getInterface(id: string): IDEF10Interface | undefined {
    return this._interfaces.get(id);
  }

  public addInterface(intf: IDEF10Interface): void {
    if (this._interfaces.has(intf.id)) {
      throw new Error(`Interface with ID "${intf.id}" already exists.`);
    }
    this._interfaces.set(intf.id, intf);
  }

  public removeInterface(id: string): void {
    this._interfaces.delete(id);
    this.removeDanglingLinks(id);
  }

  // Artifacts
  public get artifacts(): ReadonlyArray<IDEF10Artifact> {
    return Array.from(this._artifacts.values());
  }

  public getArtifact(id: string): IDEF10Artifact | undefined {
    return this._artifacts.get(id);
  }

  public addArtifact(art: IDEF10Artifact): void {
    if (this._artifacts.has(art.id)) {
      throw new Error(`Artifact with ID "${art.id}" already exists.`);
    }
    this._artifacts.set(art.id, art);
  }

  public removeArtifact(id: string): void {
    this._artifacts.delete(id);
    this.removeDanglingLinks(id);
  }

  // Links
  public get links(): ReadonlyArray<IDEF10Link> {
    return Array.from(this._links.values());
  }

  public getLink(id: string): IDEF10Link | undefined {
    return this._links.get(id);
  }

  public addLink(link: IDEF10Link): void {
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
      this._components.has(id) ||
      this._executionNodes.has(id) ||
      this._interfaces.has(id) ||
      this._artifacts.has(id)
    );
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      components: this.components.map((c) => c.toJSON()),
      executionNodes: this.executionNodes.map((n) => n.toJSON()),
      interfaces: this.interfaces.map((i) => i.toJSON()),
      artifacts: this.artifacts.map((a) => a.toJSON()),
      links: this.links.map((l) => l.toJSON()),
    };
  }
}
