import { IDEF4Diagram } from './IDEF4Diagram';
import { IDEF4Class } from './IDEF4Class';
import { IDEF4Attribute } from './IDEF4Attribute';
import { IDEF4Method } from './IDEF4Method';
import { IDEF4Relationship } from './IDEF4Relationship';
import { DiagramNotFoundError } from '../errors/IDEF4Error';
import { Position } from '../../../domain/models/Position';

export interface IDEF4ModelProps {
  id: string;
  name: string;
  rootDiagram?: IDEF4Diagram;
}

export class IDEF4Model {
  public readonly id: string;
  private _name: string;
  private _diagrams: Map<string, IDEF4Diagram> = new Map();
  private _activeDiagramId: string;
  private _rootDiagramId: string;

  constructor(props: IDEF4ModelProps) {
    if (!props.id) throw new Error('Model ID cannot be empty.');
    this.id = props.id;
    this._name = props.name || 'IDEF4 Object-Oriented Model';

    if (props.rootDiagram) {
      this._diagrams.set(props.rootDiagram.id, props.rootDiagram);
      this._rootDiagramId = props.rootDiagram.id;
      this._activeDiagramId = props.rootDiagram.id;
    } else {
      const defaultDiag = new IDEF4Diagram({
        id: 'diag-class-model',
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

  public get diagrams(): IDEF4Diagram[] {
    return Array.from(this._diagrams.values());
  }

  public get activeDiagram(): IDEF4Diagram {
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

  public getDiagram(id: string): IDEF4Diagram {
    const d = this._diagrams.get(id);
    if (!d) throw new DiagramNotFoundError(id);
    return d;
  }

  public addDiagram(diagram: IDEF4Diagram): void {
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

  public static fromJSON(json: any): IDEF4Model {
    const diagrams: IDEF4Diagram[] = (json.diagrams || []).map((dJson: any) => {
      const classes = (dJson.classes || []).map((cJson: any) => {
        const attributes = (cJson.attributes || []).map((a: any) => new IDEF4Attribute(a));
        const methods = (cJson.methods || []).map((m: any) => new IDEF4Method(m));
        return new IDEF4Class({
          id: cJson.id,
          name: cJson.name,
          isAbstract: cJson.isAbstract,
          isInterface: cJson.isInterface,
          attributes,
          methods,
          position: cJson.position ? new Position(cJson.position.x, cJson.position.y) : undefined,
        });
      });

      const relationships = (dJson.relationships || []).map((r: any) => new IDEF4Relationship(r));

      return new IDEF4Diagram({
        id: dJson.id,
        name: dJson.name,
        classes,
        relationships,
      });
    });

    const rootDiag = diagrams.find((d) => d.id === json.rootDiagramId) || diagrams[0];
    const model = new IDEF4Model({
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
