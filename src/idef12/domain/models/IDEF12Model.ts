import { IDEF12Diagram, IDEF12DiagramProps } from './IDEF12Diagram';

export interface IDEF12ModelProps {
  id: string;
  name: string;
  version?: string;
  diagrams?: IDEF12DiagramProps[];
  activeDiagramId?: string;
}

export class IDEF12Model {
  public readonly id: string;
  private _name: string;
  public readonly version: string;
  private _diagrams: Map<string, IDEF12Diagram>;
  private _activeDiagramId: string;

  constructor(props: IDEF12ModelProps) {
    if (!props.id) throw new Error('Model ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Model name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.version = props.version || '1.0.0';
    this._diagrams = new Map();

    if (props.diagrams && props.diagrams.length > 0) {
      props.diagrams.forEach((d) => this._diagrams.set(d.id, new IDEF12Diagram(d)));
      this._activeDiagramId = props.activeDiagramId || props.diagrams[0].id;
    } else {
      const defaultDiagram = new IDEF12Diagram({
        id: 'diag-org-root',
        name: 'Enterprise Organization Structure',
        description: 'Корневая организационная структура предприятия (IDEF12)',
      });
      this._diagrams.set(defaultDiagram.id, defaultDiagram);
      this._activeDiagramId = defaultDiagram.id;
    }
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Model name cannot be empty.');
    this._name = name.trim();
  }

  public get diagrams(): ReadonlyArray<IDEF12Diagram> {
    return Array.from(this._diagrams.values());
  }

  public get activeDiagram(): IDEF12Diagram {
    const d = this._diagrams.get(this._activeDiagramId);
    if (!d) {
      const first = this._diagrams.values().next().value;
      if (!first) throw new Error('No diagram found in IDEF12 model.');
      this._activeDiagramId = first.id;
      return first;
    }
    return d;
  }

  public setActiveDiagram(diagramId: string): void {
    if (!this._diagrams.has(diagramId)) {
      throw new Error(`Diagram with ID "${diagramId}" does not exist in model.`);
    }
    this._activeDiagramId = diagramId;
  }

  public addDiagram(diagram: IDEF12Diagram): void {
    if (this._diagrams.has(diagram.id)) {
      throw new Error(`Diagram with ID "${diagram.id}" already exists.`);
    }
    this._diagrams.set(diagram.id, diagram);
  }

  public removeDiagram(diagramId: string): void {
    if (this._diagrams.size <= 1) {
      throw new Error('Cannot remove the last remaining diagram in IDEF12 model.');
    }
    this._diagrams.delete(diagramId);
    if (this._activeDiagramId === diagramId) {
      this._activeDiagramId = this._diagrams.keys().next().value!;
    }
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this._name,
      version: this.version,
      activeDiagramId: this._activeDiagramId,
      diagrams: this.diagrams.map((d) => d.toJSON()),
    };
  }

  public static fromJSON(json: any): IDEF12Model {
    if (!json || typeof json !== 'object') {
      throw new Error('Invalid JSON format for IDEF12Model.');
    }
    const id = json.id || json.diagram_id || 'model-idef12';
    const name = json.name || json.title || 'IDEF12 Model';
    let diagrams = json.diagrams;
    if (!Array.isArray(diagrams) && (json.orgUnits || json.positions || json.orgRoles || json.competencies)) {
      diagrams = [json];
    }
    return new IDEF12Model({
      id,
      name,
      version: json.version || '1.0',
      activeDiagramId: json.activeDiagramId || (diagrams && diagrams[0] ? diagrams[0].id : undefined),
      diagrams,
    });
  }
}
