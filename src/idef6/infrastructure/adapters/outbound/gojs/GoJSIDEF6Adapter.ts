import * as go from 'gojs';
import type {
  IIDEF6DiagramRendererPort,
  IDEF6SelectionCallback,
} from '../../../../application/ports/outbound/IIDEF6DiagramRendererPort';
import type { DiagramDTO } from '../../../../application/dtos/IDEF6DTO';
import { createRationaleNodeTemplateMap } from './templates/RationaleNodeTemplate';
import { createRationaleLinkTemplate } from './templates/RationaleLinkTemplate';

export class GoJSIDEF6Adapter implements IIDEF6DiagramRendererPort {
  private _diagram: go.Diagram | null = null;
  private _selectionCallbacks: IDEF6SelectionCallback = {};

  public initialize(containerElement: HTMLElement | string): void {
    const $ = go.GraphObject.make;

    this._diagram = new go.Diagram(containerElement as any, {
      'undoManager.isEnabled': true,
      allowCopy: true,
      allowDelete: true,
      'toolManager.mouseWheelBehavior': go.WheelMode.Zoom,
      initialContentAlignment: go.Spot.Center,
      contentAlignment: go.Spot.Center,
      padding: new go.Margin(40, 40, 40, 40),
      layout: $(go.LayeredDigraphLayout, {
        direction: 0, // Left-to-right rationale flow: Issue -> Alternative -> Argument/Criterion
        layerSpacing: 110,
        columnSpacing: 85,
        setsPortSpots: false,
        isRouting: true,
        packOption: go.LayeredDigraphPack.Expand,
        isInitial: false,
        isOngoing: false,
      }),
    });

    this._diagram.nodeTemplateMap = createRationaleNodeTemplateMap();
    this._diagram.linkTemplate = createRationaleLinkTemplate();

    this._diagram.addDiagramListener('ChangedSelection', () => {
      if (!this._diagram) return;
      const selected = this._diagram.selection.first();
      if (!selected) return;

      if (selected instanceof go.Node && this._selectionCallbacks.onElementSelected) {
        this._selectionCallbacks.onElementSelected(selected.data.id, selected.data.category);
      } else if (selected instanceof go.Link && this._selectionCallbacks.onLinkSelected) {
        this._selectionCallbacks.onLinkSelected(selected.data.id);
      }
    });
  }

  public setSelectionListeners(callbacks: IDEF6SelectionCallback): void {
    this._selectionCallbacks = callbacks;
  }

  public render(diagram: DiagramDTO): void {
    if (!this._diagram) return;

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    for (const i of diagram.issues) {
      nodeDataArray.push({
        key: i.id,
        id: i.id,
        category: 'issue',
        name: i.name,
        description: i.description,
        status: i.status,
        priority: i.priority,
        loc: `${i.x} ${i.y}`,
      });
    }

    for (const a of diagram.alternatives) {
      nodeDataArray.push({
        key: a.id,
        id: a.id,
        category: 'alternative',
        name: a.name,
        description: a.description,
        status: a.status,
        loc: `${a.x} ${a.y}`,
      });
    }

    for (const c of diagram.criteria) {
      nodeDataArray.push({
        key: c.id,
        id: c.id,
        category: 'criterion',
        name: c.name,
        description: c.description,
        type: c.type,
        weight: c.weight,
        loc: `${c.x} ${c.y}`,
      });
    }

    for (const arg of diagram.arguments) {
      nodeDataArray.push({
        key: arg.id,
        id: arg.id,
        category: 'argument',
        name: arg.name,
        description: arg.description,
        type: arg.type,
        strength: arg.strength,
        loc: `${arg.x} ${arg.y}`,
      });
    }

    for (const l of diagram.links) {
      linkDataArray.push({
        key: l.id,
        id: l.id,
        from: l.sourceId,
        to: l.targetId,
        type: l.type,
        label: l.label,
        weight: l.weight,
      });
    }

    this._diagram.model = new go.GraphLinksModel({
      nodeDataArray,
      linkDataArray,
    });

    const allAtZero =
      diagram.issues.every((i) => i.x === 0 && i.y === 0) &&
      diagram.alternatives.every((a) => a.x === 0 && a.y === 0);

    if (allAtZero) {
      this.autoLayout();
    }
  }

  public autoLayout(): void {
    if (!this._diagram) return;

    this._diagram.startTransaction('idef6-auto-layout');

    const layout = new go.LayeredDigraphLayout({
      direction: 0, // Left-to-right flow
      layerSpacing: 110,
      columnSpacing: 85,
      setsPortSpots: false,
      isRouting: true,
      aggressiveOption: go.LayeredDigraphAggressive.More,
      packOption: go.LayeredDigraphPack.Expand,
    });

    layout.doLayout(this._diagram);

    this._diagram.nodes.each((node) => {
      const pt = node.location;
      this._diagram!.model.setDataProperty(node.data, 'loc', go.Point.stringify(pt));
    });

    this._diagram.commitTransaction('idef6-auto-layout');
    this.zoomToFit();
  }

  public zoomToFit(): void {
    if (!this._diagram) return;
    this._diagram.zoomToFit();
    if (this._diagram.scale > 1) {
      this._diagram.scale = 1;
    }
  }

  public destroy(): void {
    if (this._diagram) {
      this._diagram.div = null;
      this._diagram = null;
    }
  }
}
