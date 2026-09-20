import { IDEF6Diagram } from './IDEF6Diagram';
import { IDEF6Issue } from './IDEF6Issue';
import { IDEF6Alternative } from './IDEF6Alternative';
import { IDEF6Criterion } from './IDEF6Criterion';
import { IDEF6Argument } from './IDEF6Argument';
import { IDEF6Link } from './IDEF6Link';
import { DiagramNotFoundError } from '../errors/IDEF6Error';
import { Position } from '../../../domain/models/Position';

export interface IDEF6ModelProps {
  id: string;
  name: string;
  rootDiagram?: IDEF6Diagram;
}

export class IDEF6Model {
  public readonly id: string;
  private _name: string;
  private _diagrams: Map<string, IDEF6Diagram> = new Map();
  private _activeDiagramId: string;
  private _rootDiagramId: string;

  constructor(props: IDEF6ModelProps) {
    if (!props.id) throw new Error('Model ID cannot be empty.');
    this.id = props.id;
    this._name = props.name || 'IDEF6 Design Rationale Model';

    if (props.rootDiagram) {
      this._diagrams.set(props.rootDiagram.id, props.rootDiagram);
      this._rootDiagramId = props.rootDiagram.id;
      this._activeDiagramId = props.rootDiagram.id;
    } else {
      const defaultDiag = new IDEF6Diagram({
        id: 'diag-rationale-main',
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

  public get diagrams(): IDEF6Diagram[] {
    return Array.from(this._diagrams.values());
  }

  public get activeDiagram(): IDEF6Diagram {
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

  public getDiagram(id: string): IDEF6Diagram {
    const d = this._diagrams.get(id);
    if (!d) throw new DiagramNotFoundError(id);
    return d;
  }

  public addDiagram(diagram: IDEF6Diagram): void {
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

  public static fromJSON(json: any): IDEF6Model {
    const diagrams: IDEF6Diagram[] = (json.diagrams || []).map((dJson: any) => {
      const issues = (dJson.issues || []).map(
        (iJson: any) =>
          new IDEF6Issue({
            id: iJson.id,
            name: iJson.name,
            description: iJson.description,
            status: iJson.status,
            priority: iJson.priority,
            position: iJson.position ? new Position(iJson.position.x, iJson.position.y) : undefined,
          })
      );

      const alternatives = (dJson.alternatives || []).map(
        (aJson: any) =>
          new IDEF6Alternative({
            id: aJson.id,
            name: aJson.name,
            description: aJson.description,
            status: aJson.status,
            position: aJson.position ? new Position(aJson.position.x, aJson.position.y) : undefined,
          })
      );

      const criteria = (dJson.criteria || []).map(
        (cJson: any) =>
          new IDEF6Criterion({
            id: cJson.id,
            name: cJson.name,
            description: cJson.description,
            type: cJson.type,
            weight: cJson.weight,
            position: cJson.position ? new Position(cJson.position.x, cJson.position.y) : undefined,
          })
      );

      const args = (dJson.arguments || []).map(
        (argJson: any) =>
          new IDEF6Argument({
            id: argJson.id,
            name: argJson.name,
            type: argJson.type,
            strength: argJson.strength,
            description: argJson.description,
            position: argJson.position ? new Position(argJson.position.x, argJson.position.y) : undefined,
          })
      );

      const links = (dJson.links || []).map((l: any) => new IDEF6Link(l));

      return new IDEF6Diagram({
        id: dJson.id,
        name: dJson.name,
        issues,
        alternatives,
        criteria,
        arguments: args,
        links,
      });
    });

    const rootDiag = diagrams.find((d) => d.id === json.rootDiagramId) || diagrams[0];
    const model = new IDEF6Model({
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
