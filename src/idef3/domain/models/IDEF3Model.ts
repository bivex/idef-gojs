import { IDEF3Diagram } from './IDEF3Diagram';
import { UOB } from './UOB';
import { Junction } from './Junction';
import { Link } from './Link';
import { Referent } from './Referent';
import { DiagramNotFoundError } from '../errors/IDEF3Error';

export interface IDEF3ModelProps {
  id: string;
  name: string;
  rootDiagram?: IDEF3Diagram;
}

export class IDEF3Model {
  public readonly id: string;
  private _name: string;
  private _diagrams: Map<string, IDEF3Diagram> = new Map();
  private _activeDiagramId: string;
  private _rootDiagramId: string;

  constructor(props: IDEF3ModelProps) {
    if (!props.id) throw new Error('Model ID cannot be empty.');
    this.id = props.id;
    this._name = props.name || 'IDEF3 Process Model';

    if (props.rootDiagram) {
      this._diagrams.set(props.rootDiagram.id, props.rootDiagram);
      this._rootDiagramId = props.rootDiagram.id;
      this._activeDiagramId = props.rootDiagram.id;
    } else {
      // Default initial scenario
      const initialDiag = new IDEF3Diagram({
        id: 'scenario-1',
        scenarioNumber: '1',
        title: props.name,
      });
      this._diagrams.set(initialDiag.id, initialDiag);
      this._rootDiagramId = initialDiag.id;
      this._activeDiagramId = initialDiag.id;
    }
  }

  public get name(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public get diagrams(): IDEF3Diagram[] {
    return Array.from(this._diagrams.values());
  }

  public get activeDiagram(): IDEF3Diagram {
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

  public getDiagram(id: string): IDEF3Diagram {
    const d = this._diagrams.get(id);
    if (!d) throw new DiagramNotFoundError(id);
    return d;
  }

  public addDiagram(diagram: IDEF3Diagram): void {
    if (this._diagrams.has(diagram.id)) {
      throw new Error(`Diagram "${diagram.id}" already exists.`);
    }
    this._diagrams.set(diagram.id, diagram);
  }

  public setActiveDiagram(id: string): void {
    if (!this._diagrams.has(id)) throw new DiagramNotFoundError(id);
    this._activeDiagramId = id;
  }

  public drillDown(uobId: string): IDEF3Diagram | undefined {
    const current = this.activeDiagram;
    if (!current.hasUOB(uobId)) return undefined;

    const child = Array.from(this._diagrams.values()).find(
      (d) => d.parentDiagramId === current.id && d.parentUOBId === uobId
    );

    if (child) {
      this._activeDiagramId = child.id;
      return child;
    }
    return undefined;
  }

  public drillUp(): IDEF3Diagram | undefined {
    const current = this.activeDiagram;
    if (!current.parentDiagramId) return undefined;

    const parent = this._diagrams.get(current.parentDiagramId);
    if (parent) {
      this._activeDiagramId = parent.id;
      return parent;
    }
    return undefined;
  }

  public decomposeUOB(
    parentUOBId: string,
    childProps: { id: string; scenarioNumber: string; title: string },
    childUOBs: UOB[] = []
  ): IDEF3Diagram {
    const current = this.activeDiagram;
    const uob = current.getUOB(parentUOBId);
    uob.setDecomposition(true, childProps.scenarioNumber);

    const childDiag = new IDEF3Diagram({
      id: childProps.id,
      scenarioNumber: childProps.scenarioNumber,
      title: childProps.title,
      parentDiagramId: current.id,
      parentUOBId: parentUOBId,
      uobs: childUOBs,
    });

    this.addDiagram(childDiag);
    return childDiag;
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

  public static fromJSON(json: any): IDEF3Model {
    const diagrams: IDEF3Diagram[] = (json.diagrams || []).map((dJson: any) => {
      const uobs = (dJson.uobs || []).map((u: any) => new UOB(u));
      const junctions = (dJson.junctions || []).map((j: any) => new Junction(j));
      const links = (dJson.links || []).map((l: any) => new Link(l));
      const referents = (dJson.referents || []).map((r: any) => new Referent(r));

      return new IDEF3Diagram({
        id: dJson.id,
        scenarioNumber: dJson.scenarioNumber,
        title: dJson.title,
        parentDiagramId: dJson.parentDiagramId,
        parentUOBId: dJson.parentUOBId,
        uobs,
        junctions,
        links,
        referents,
      });
    });

    const rootDiag = diagrams.find((d) => d.id === json.rootDiagramId) || diagrams[0];
    const model = new IDEF3Model({
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
