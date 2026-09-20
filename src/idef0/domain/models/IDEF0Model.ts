import { IDEF0Diagram } from './IDEF0Diagram';
import { Activity } from './Activity';
import { Arrow } from './Arrow';
import { DiagramNotFoundError } from '../errors/IDEF0Error';

export interface IDEF0ModelProps {
  id: string;
  name: string;
  contextDiagram?: IDEF0Diagram;
}

export class IDEF0Model {
  public readonly id: string;
  private _name: string;
  private _diagrams: Map<string, IDEF0Diagram> = new Map();
  private _activeDiagramId: string;
  private _rootDiagramId: string;

  constructor(props: IDEF0ModelProps) {
    if (!props.id) throw new Error('Model ID cannot be empty.');
    this.id = props.id;
    this._name = props.name || 'IDEF0 Functional Model';

    if (props.contextDiagram) {
      this._diagrams.set(props.contextDiagram.id, props.contextDiagram);
      this._rootDiagramId = props.contextDiagram.id;
      this._activeDiagramId = props.contextDiagram.id;
    } else {
      // Create default Context Diagram A-0
      const contextDiag = new IDEF0Diagram({
        id: 'diag-a-0',
        nodeNumber: 'A-0',
        title: props.name,
      });
      const topActivity = new Activity({
        id: 'act-a0',
        name: props.name,
        nodeNumber: 'A0',
        detailNumber: 0,
        hasDecomposition: true,
      });
      contextDiag.addActivity(topActivity);

      this._diagrams.set(contextDiag.id, contextDiag);
      this._rootDiagramId = contextDiag.id;
      this._activeDiagramId = contextDiag.id;
    }
  }

  public get name(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public get diagrams(): IDEF0Diagram[] {
    return Array.from(this._diagrams.values());
  }

  public get activeDiagram(): IDEF0Diagram {
    const diag = this._diagrams.get(this._activeDiagramId);
    if (!diag) throw new DiagramNotFoundError(this._activeDiagramId);
    return diag;
  }

  public get activeDiagramId(): string {
    return this._activeDiagramId;
  }

  public get rootDiagramId(): string {
    return this._rootDiagramId;
  }

  public getDiagram(id: string): IDEF0Diagram {
    const diag = this._diagrams.get(id);
    if (!diag) throw new DiagramNotFoundError(id);
    return diag;
  }

  public findDiagramByNodeNumber(nodeNumber: string): IDEF0Diagram | undefined {
    return Array.from(this._diagrams.values()).find((d) => d.nodeNumber === nodeNumber);
  }

  public addDiagram(diagram: IDEF0Diagram): void {
    if (this._diagrams.has(diagram.id)) {
      throw new Error(`Diagram with ID "${diagram.id}" already exists.`);
    }
    this._diagrams.set(diagram.id, diagram);
  }

  public removeDiagram(id: string): void {
    if (id === this._rootDiagramId) {
      throw new Error('Cannot remove root context diagram A-0.');
    }
    if (!this._diagrams.has(id)) {
      throw new DiagramNotFoundError(id);
    }
    // If active, switch to root
    if (this._activeDiagramId === id) {
      this._activeDiagramId = this._rootDiagramId;
    }
    this._diagrams.delete(id);
  }

  public setActiveDiagram(id: string): void {
    if (!this._diagrams.has(id)) {
      throw new DiagramNotFoundError(id);
    }
    this._activeDiagramId = id;
  }

  /**
   * Drill down into an activity decomposition.
   * If decomposition diagram does not exist, returns undefined.
   */
  public drillDown(activityId: string): IDEF0Diagram | undefined {
    const currentDiag = this.activeDiagram;
    if (!currentDiag.hasActivity(activityId)) {
      return undefined;
    }

    // Look for child diagram referencing this diagram and activity
    const childDiag = Array.from(this._diagrams.values()).find(
      (d) => d.parentDiagramId === currentDiag.id && d.parentActivityId === activityId
    );

    if (childDiag) {
      this._activeDiagramId = childDiag.id;
      return childDiag;
    }
    return undefined;
  }

  /**
   * Drill up to parent diagram.
   */
  public drillUp(): IDEF0Diagram | undefined {
    const currentDiag = this.activeDiagram;
    if (!currentDiag.parentDiagramId) {
      return undefined; // Already at top
    }
    const parentDiag = this._diagrams.get(currentDiag.parentDiagramId);
    if (parentDiag) {
      this._activeDiagramId = parentDiag.id;
      return parentDiag;
    }
    return undefined;
  }

  /**
   * Decomposes an activity into a new child diagram with given activities and boundary arrows.
   */
  public decomposeActivity(
    parentActivityId: string,
    childDiagramProps: { id: string; nodeNumber: string; title: string },
    childActivities: Activity[] = []
  ): IDEF0Diagram {
    const currentDiag = this.activeDiagram;
    const act = currentDiag.getActivity(parentActivityId);
    act.setDecomposition(true, childDiagramProps.nodeNumber);

    const childDiag = new IDEF0Diagram({
      id: childDiagramProps.id,
      nodeNumber: childDiagramProps.nodeNumber,
      title: childDiagramProps.title,
      parentDiagramId: currentDiag.id,
      parentActivityId: parentActivityId,
      activities: childActivities,
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

  public static fromJSON(json: any): IDEF0Model {
    const diagrams: IDEF0Diagram[] = (json.diagrams || []).map((dJson: any) => {
      const activities = (dJson.activities || []).map((aJson: any) => new Activity(aJson));
      const arrows = (dJson.arrows || []).map((arrJson: any) => new Arrow(arrJson));
      return new IDEF0Diagram({
        id: dJson.id,
        nodeNumber: dJson.nodeNumber,
        title: dJson.title,
        parentDiagramId: dJson.parentDiagramId,
        parentActivityId: dJson.parentActivityId,
        activities,
        arrows,
      });
    });

    const rootDiag = diagrams.find((d) => d.id === json.rootDiagramId) || diagrams[0];
    const model = new IDEF0Model({
      id: json.id,
      name: json.name,
      contextDiagram: rootDiag,
    });

    // Clear initial diagrams and load all
    model._diagrams.clear();
    for (const d of diagrams) {
      model._diagrams.set(d.id, d);
    }
    model._rootDiagramId = json.rootDiagramId || rootDiag.id;
    model._activeDiagramId = json.activeDiagramId || rootDiag.id;

    return model;
  }
}
