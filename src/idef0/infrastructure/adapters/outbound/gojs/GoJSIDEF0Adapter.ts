import * as go from 'gojs';
import type {
  IIDEF0DiagramRendererPort,
  DiagramSelectionCallback,
} from '../../../../application/ports/outbound/IIDEF0DiagramRendererPort';
import type { DiagramDTO, ActivityDTO } from '../../../../application/dtos/IDEF0DTO';
import { ICOMType } from '../../../../domain/models/ICOMType';
import { createActivityNodeTemplate } from './templates/ActivityNodeTemplate';
import { createBoundaryNodeTemplate } from './templates/BoundaryNodeTemplate';
import { createArrowLinkTemplate } from './templates/ArrowLinkTemplate';

export class GoJSIDEF0Adapter implements IIDEF0DiagramRendererPort {
  private _diagram: go.Diagram | null = null;
  private _selectionCallbacks: DiagramSelectionCallback = {};

  public initialize(containerElement: HTMLElement | string): void {
    const $ = go.GraphObject.make;

    this._diagram = new go.Diagram(containerElement as any, {
      'undoManager.isEnabled': true,
      allowCopy: true,
      allowDelete: true,
      'toolManager.mouseWheelBehavior': go.WheelMode.Zoom,
      initialContentAlignment: go.Spot.Center,
      layout: $(go.Layout, { isInitial: false, isOngoing: false }),
    });

    // Register node templates
    const activityTmpl = createActivityNodeTemplate((_e, obj) => {
      const node = obj.part;
      if (node && node.data && node.data.id) {
        if (this._selectionCallbacks.onActivityDoubleClicked) {
          this._selectionCallbacks.onActivityDoubleClicked(node.data.id);
        }
      }
    });

    const boundaryTmpl = createBoundaryNodeTemplate();

    const templMap = new go.Map<string, go.Node>();
    templMap.add('activity', activityTmpl);
    templMap.add('boundary', boundaryTmpl);
    this._diagram.nodeTemplateMap = templMap;

    // Register link template
    this._diagram.linkTemplate = createArrowLinkTemplate();

    // Selection listeners
    this._diagram.addDiagramListener('ChangedSelection', () => {
      if (!this._diagram) return;
      const selected = this._diagram.selection.first();
      if (!selected) return;

      if (selected instanceof go.Node) {
        if (selected.category === 'activity' && this._selectionCallbacks.onActivitySelected) {
          this._selectionCallbacks.onActivitySelected(selected.data.id);
        }
      } else if (selected instanceof go.Link) {
        if (this._selectionCallbacks.onArrowSelected) {
          this._selectionCallbacks.onArrowSelected(selected.data.id);
        }
      }
    });
  }

  public setSelectionListeners(callbacks: DiagramSelectionCallback): void {
    this._selectionCallbacks = callbacks;
  }

  public render(diagram: DiagramDTO): void {
    if (!this._diagram) return;

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    // 1. Add Activities
    for (const act of diagram.activities) {
      nodeDataArray.push({
        key: act.id,
        id: act.id,
        category: 'activity',
        name: act.name,
        nodeNumber: act.nodeNumber,
        detailNumber: act.detailNumber,
        dNumber: act.dNumber,
        hasDecomposition: act.hasDecomposition,
        loc: `${act.x} ${act.y}`,
      });
    }

    // 2. Add Arrows and handle Boundary Nodes
    let boundaryIdx = 1;
    for (const arr of diagram.arrows) {
      const isCall = arr.icomType === ICOMType.CALL;
      let targetPort = 'INPUT';
      switch (arr.icomType) {
        case ICOMType.CONTROL: targetPort = 'CONTROL'; break;
        case ICOMType.INPUT: targetPort = 'INPUT'; break;
        case ICOMType.MECHANISM: targetPort = 'MECHANISM'; break;
        case ICOMType.CALL: targetPort = 'CALL'; break;
        case ICOMType.OUTPUT: targetPort = 'INPUT'; break;
      }

      // Case A: Internal arrow connecting two activities
      if (arr.sourceActivityId && arr.targetActivityId) {
        linkDataArray.push({
          key: arr.id,
          id: arr.id,
          from: arr.sourceActivityId,
          fromPort: 'OUTPUT',
          to: arr.targetActivityId,
          toPort: targetPort,
          name: arr.name,
          tunnel: arr.tunnel,
          isCall,
        });
      }
      // Case B: External input/control/mechanism entering diagram
      else if (!arr.sourceActivityId && arr.targetActivityId) {
        const boundKey = `boundary_in_${boundaryIdx++}`;
        nodeDataArray.push({
          key: boundKey,
          category: 'boundary',
          boundaryType: arr.icomType,
          name: arr.name,
          loc: '0 0',
        });
        linkDataArray.push({
          key: arr.id,
          id: arr.id,
          from: boundKey,
          fromPort: 'BORDER',
          to: arr.targetActivityId,
          toPort: targetPort,
          name: arr.name,
          tunnel: arr.tunnel,
          isCall,
        });
      }
      // Case C: External output exiting diagram
      else if (arr.sourceActivityId && !arr.targetActivityId) {
        const boundKey = `boundary_out_${boundaryIdx++}`;
        nodeDataArray.push({
          key: boundKey,
          category: 'boundary',
          boundaryType: arr.icomType,
          name: arr.name,
          loc: '0 0',
        });
        linkDataArray.push({
          key: arr.id,
          id: arr.id,
          from: arr.sourceActivityId,
          fromPort: isCall ? 'CALL' : 'OUTPUT',
          to: boundKey,
          toPort: 'BORDER',
          name: arr.name,
          tunnel: arr.tunnel,
          isCall,
        });
      }
    }

    this._diagram.model = new go.GraphLinksModel({
      linkFromPortIdProperty: 'fromPort',
      linkToPortIdProperty: 'toPort',
      nodeDataArray,
      linkDataArray,
    });

    // Position nodes using IDEF0 standard layout if unpositioned
    const allAtZero = diagram.activities.every((a: ActivityDTO) => a.x === 0 && a.y === 0);
    if (allAtZero) {
      this.autoLayout();
    }
  }

  /**
   * Applies standard IDEF0 Diagonal Dominance Staircase Layout:
   * Box 1 top-left, Box 2 down-right, ..., Box N bottom-right.
   * External inputs on left, controls on top, mechanisms below, outputs on right.
   */
  public autoLayout(): void {
    if (!this._diagram) return;

    this._diagram.startTransaction('idef0-auto-layout');

    // Sort activity nodes by detailNumber
    const actNodes: go.Node[] = [];
    const inBoundaryNodes: go.Node[] = [];
    const outBoundaryNodes: go.Node[] = [];
    const ctrlBoundaryNodes: go.Node[] = [];
    const mechBoundaryNodes: go.Node[] = [];

    this._diagram.nodes.each((node) => {
      if (node.category === 'activity') {
        actNodes.push(node);
      } else if (node.category === 'boundary') {
        const bType = node.data.boundaryType;
        if (bType === ICOMType.INPUT) inBoundaryNodes.push(node);
        else if (bType === ICOMType.CONTROL) ctrlBoundaryNodes.push(node);
        else if (bType === ICOMType.MECHANISM) mechBoundaryNodes.push(node);
        else outBoundaryNodes.push(node);
      }
    });

    actNodes.sort((a, b) => (a.data.detailNumber || 0) - (b.data.detailNumber || 0));

    // Arrange activities diagonally
    const startX = 240;
    const startY = 160;
    const stepX = 260;
    const stepY = 160;

    actNodes.forEach((node, idx) => {
      const x = startX + idx * stepX;
      const y = startY + idx * stepY;
      node.location = new go.Point(x, y);
    });

    // Arrange Control boundary nodes along the top
    ctrlBoundaryNodes.forEach((node, idx) => {
      const targetAct = this.findConnectedActivity(node, 'out');
      const targetX = targetAct ? targetAct.location.x : startX + idx * 200;
      node.location = new go.Point(targetX, 40 + (idx % 2) * 30);
    });

    // Arrange Input boundary nodes along the left
    inBoundaryNodes.forEach((node, idx) => {
      const targetAct = this.findConnectedActivity(node, 'out');
      const targetY = targetAct ? targetAct.location.y : startY + idx * 120;
      node.location = new go.Point(60, targetY + (idx % 2) * 30);
    });

    // Arrange Mechanism boundary nodes along the bottom
    const maxActY = startY + (actNodes.length - 1) * stepY + 180;
    mechBoundaryNodes.forEach((node, idx) => {
      const targetAct = this.findConnectedActivity(node, 'out');
      const targetX = targetAct ? targetAct.location.x : startX + idx * 200;
      node.location = new go.Point(targetX, maxActY + 40 + (idx % 2) * 30);
    });

    // Arrange Output boundary nodes along the right
    const maxActX = startX + (actNodes.length - 1) * stepX + 260;
    outBoundaryNodes.forEach((node, idx) => {
      const targetAct = this.findConnectedActivity(node, 'in');
      const targetY = targetAct ? targetAct.location.y : startY + idx * 120;
      node.location = new go.Point(maxActX + 60, targetY + (idx % 2) * 30);
    });

    this._diagram.commitTransaction('idef0-auto-layout');
    this.zoomToFit();
  }

  private findConnectedActivity(node: go.Node, dir: 'in' | 'out'): go.Node | null {
    if (!this._diagram) return null;
    const links = dir === 'out' ? node.findLinksOutOf() : node.findLinksInto();
    let result: go.Node | null = null;
    links.each((link) => {
      const other = dir === 'out' ? link.toNode : link.fromNode;
      if (other && other.category === 'activity') {
        result = other;
      }
    });
    return result;
  }

  public zoomToFit(): void {
    if (!this._diagram) return;
    this._diagram.zoomToFit();
  }

  public destroy(): void {
    if (this._diagram) {
      this._diagram.div = null;
      this._diagram = null;
    }
  }
}
