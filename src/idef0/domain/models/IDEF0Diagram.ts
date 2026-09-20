import { Activity } from './Activity';
import { Arrow } from './Arrow';
import { ActivityNotFoundError, ArrowNotFoundError } from '../errors/IDEF0Error';

export interface IDEF0DiagramProps {
  id: string;
  nodeNumber: string; // e.g. "A-0", "A0", "A1"
  title: string;
  parentDiagramId?: string;
  parentActivityId?: string;
  activities?: Activity[];
  arrows?: Arrow[];
}

export class IDEF0Diagram {
  public readonly id: string;
  public readonly nodeNumber: string;
  private _title: string;
  public readonly parentDiagramId?: string;
  public readonly parentActivityId?: string;

  private _activities: Map<string, Activity> = new Map();
  private _arrows: Map<string, Arrow> = new Map();

  constructor(props: IDEF0DiagramProps) {
    if (!props.id) throw new Error('Diagram ID cannot be empty.');
    this.id = props.id;
    this.nodeNumber = props.nodeNumber || 'A0';
    this._title = props.title || 'Untitled IDEF0 Diagram';
    this.parentDiagramId = props.parentDiagramId;
    this.parentActivityId = props.parentActivityId;

    if (props.activities) {
      for (const act of props.activities) {
        this._activities.set(act.id, act);
      }
    }
    if (props.arrows) {
      for (const arr of props.arrows) {
        this._arrows.set(arr.id, arr);
      }
    }
  }

  public get title(): string {
    return this._title;
  }

  public setTitle(title: string): void {
    this._title = title;
  }

  public get activities(): Activity[] {
    return Array.from(this._activities.values());
  }

  public get arrows(): Arrow[] {
    return Array.from(this._arrows.values());
  }

  public getActivity(id: string): Activity {
    const act = this._activities.get(id);
    if (!act) throw new ActivityNotFoundError(id);
    return act;
  }

  public hasActivity(id: string): boolean {
    return this._activities.has(id);
  }

  public addActivity(act: Activity): void {
    if (this._activities.has(act.id)) {
      throw new Error(`Activity "${act.id}" already exists on diagram.`);
    }
    this._activities.set(act.id, act);
  }

  public removeActivity(id: string): void {
    if (!this._activities.has(id)) throw new ActivityNotFoundError(id);
    // Remove related arrows
    const relatedArrows = this.arrows.filter(
      (a) => a.sourceActivityId === id || a.targetActivityId === id
    );
    for (const arr of relatedArrows) {
      this._arrows.delete(arr.id);
    }
    this._activities.delete(id);
  }

  public getArrow(id: string): Arrow {
    const arr = this._arrows.get(id);
    if (!arr) throw new ArrowNotFoundError(id);
    return arr;
  }

  public addArrow(arrow: Arrow): void {
    if (this._arrows.has(arrow.id)) {
      throw new Error(`Arrow "${arrow.id}" already exists on diagram.`);
    }
    this._arrows.set(arrow.id, arrow);
  }

  public removeArrow(id: string): void {
    if (!this._arrows.has(id)) throw new ArrowNotFoundError(id);
    this._arrows.delete(id);
  }

  public toJSON() {
    return {
      id: this.id,
      nodeNumber: this.nodeNumber,
      title: this.title,
      parentDiagramId: this.parentDiagramId,
      parentActivityId: this.parentActivityId,
      activities: this.activities.map((a) => a.toJSON()),
      arrows: this.arrows.map((a) => a.toJSON()),
    };
  }
}
