import { IDEF5Diagram } from './IDEF5Diagram';
import { IDEF5Kind } from './IDEF5Kind';
import { IDEF5Property } from './IDEF5Property';
import { IDEF5Relation } from './IDEF5Relation';
import { DiagramNotFoundError } from '../errors/IDEF5Error';
import { Position } from '../../../domain/models/Position';

export interface IDEF5ModelProps {
  id: string;
  name: string;
  rootDiagram?: IDEF5Diagram;
}

export class IDEF5Model {
  public readonly id: string;
  private _name: string;
  private _diagrams: Map<string, IDEF5Diagram> = new Map();
  private _activeDiagramId: string;
  private _rootDiagramId: string;

  constructor(props: IDEF5ModelProps) {
    if (!props.id) throw new Error('Model ID cannot be empty.');
    this.id = props.id;
    this._name = props.name || 'IDEF5 Ontology Model';

    if (props.rootDiagram) {
      this._diagrams.set(props.rootDiagram.id, props.rootDiagram);
      this._rootDiagramId = props.rootDiagram.id;
      this._activeDiagramId = props.rootDiagram.id;
    } else {
      const defaultDiag = new IDEF5Diagram({
        id: 'diag-ontology-main',
        name: props.name,
      });
      this._diagrams.set(defaultDiag.id, defaultDiag);
      this._rootDiagramId = defaultDiag.id;
      this._activeDiagramId = defaultDiag.id;
    }
  }

  public get name(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public get diagrams(): IDEF5Diagram[] {
    return Array.from(this._diagrams.values());
  }

  public get activeDiagram(): IDEF5Diagram {
    const d = this._diagrams.get(this._activeDiagramId);
    if (!d) throw new DiagramNotFoundError(this._activeDiagramId);
    return d;
  }

  public get activeDiagramId(): string {
    return this._activeDiagramId;
  }

  public get rootDiagramId(): string {
    return this._rootDiagramId;
  }

  public getDiagram(id: string): IDEF5Diagram {
    const d = this._diagrams.get(id);
    if (!d) throw new DiagramNotFoundError(id);
    return d;
  }

  public addDiagram(diagram: IDEF5Diagram): void {
    if (this._diagrams.has(diagram.id)) {
      throw new Error(`Diagram "${diagram.id}" already exists.`);
    }
    this._diagrams.set(diagram.id, diagram);
  }

  public setActiveDiagram(id: string): void {
    if (!this._diagrams.has(id)) throw new DiagramNotFoundError(id);
    this._activeDiagramId = id;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      rootDiagramId: this._rootDiagramId,
      activeDiagramId: this._activeDiagramId,
      diagrams: this.diagrams.map((d) => d.toJSON()),
    };
  }

  public static fromJSON(json: any): IDEF5Model {
    const diagrams: IDEF5Diagram[] = (json.diagrams || []).map((dJson: any) => {
      const kinds = (dJson.kinds || []).map((kJson: any) => {
        const properties = (kJson.properties || []).map((p: any) => new IDEF5Property(p));
        return new IDEF5Kind({
          id: kJson.id,
          name: kJson.name,
          description: kJson.description,
          isIndividual: kJson.isIndividual,
          properties,
          position: kJson.position ? new Position(kJson.position.x, kJson.position.y) : undefined,
        });
      });

      const relations = (dJson.relations || []).map((r: any) => new IDEF5Relation(r));

      return new IDEF5Diagram({
        id: dJson.id,
        name: dJson.name,
        schematicType: dJson.schematicType,
        kinds,
        relations,
      });
    });

    const rootDiag = diagrams.find((d) => d.id === json.rootDiagramId) || diagrams[0];
    const model = new IDEF5Model({
      id: json.id,
      name: json.name,
      rootDiagram: rootDiag,
    });

    model._diagrams.clear();
    for (const d of diagrams) {
      model._diagrams.set(d.id, d);
    }
    model._rootDiagramId = json.rootDiagramId || rootDiag.id;
    model._activeDiagramId = json.activeDiagramId || rootDiag.id;

    return model;
  }
}
