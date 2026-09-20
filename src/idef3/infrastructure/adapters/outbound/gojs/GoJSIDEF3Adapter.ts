import * as go from 'gojs';
import type {
  IIDEF3DiagramRendererPort,
  IDEF3SelectionCallback,
} from '../../../../application/ports/outbound/IIDEF3DiagramRendererPort';
import type { DiagramDTO, UOBDTO } from '../../../../application/dtos/IDEF3DTO';
import { createUOBNodeTemplate } from './templates/UOBNodeTemplate';
import { createJunctionNodeTemplate } from './templates/JunctionNodeTemplate';
import { createReferentNodeTemplate } from './templates/ReferentNodeTemplate';
import { createProcessLinkTemplate } from './templates/ProcessLinkTemplate';

export class GoJSIDEF3Adapter implements IIDEF3DiagramRendererPort {
  private _diagram: go.Diagram | null = null;
  private _selectionCallbacks: IDEF3SelectionCallback = {};

  public initialize(containerElement: HTMLElement | string): void {
    const $ = go.GraphObject.make;

    this._diagram = new go.Diagram(containerElement as any, {
      'undoManager.isEnabled': true,
      allowCopy: true,
      allowDelete: true,
      'toolManager.mouseWheelBehavior': go.WheelMode.Zoom,
      initialContentAlignment: go.Spot.Center,
      layout: $(go.LayeredDigraphLayout, {
        direction: 0,
        layerSpacing: 60,
        columnSpacing: 40,
        setsPortSpots: false,
        isInitial: false,
        isOngoing: false,
      }),
    });

    // Node templates
    const uobTmpl = createUOBNodeTemplate((_e, obj) => {
      const node = obj.part;
      if (node && node.data && node.data.id) {
        if (this._selectionCallbacks.onUOBDoubleClicked) {
          this._selectionCallbacks.onUOBDoubleClicked(node.data.id);
        }
      }
    });

    const junctionTmpl = createJunctionNodeTemplate();
    const referentTmpl = createReferentNodeTemplate();

    const templMap = new go.Map<string, go.Node>();
    templMap.add('uob', uobTmpl);
    templMap.add('junction', junctionTmpl);
    templMap.add('referent', referentTmpl);
    this._diagram.nodeTemplateMap = templMap;

    // Link template
    this._diagram.linkTemplate = createProcessLinkTemplate();

    // Selection listener
    this._diagram.addDiagramListener('ChangedSelection', () => {
      if (!this._diagram) return;
      const selected = this._diagram.selection.first();
      if (!selected) return;

      if (selected instanceof go.Node) {
        const cat = selected.category;
        if (cat === 'uob' && this._selectionCallbacks.onUOBSelected) {
          this._selectionCallbacks.onUOBSelected(selected.data.id);
        } else if (cat === 'junction' && this._selectionCallbacks.onJunctionSelected) {
          this._selectionCallbacks.onJunctionSelected(selected.data.id);
        } else if (cat === 'referent' && this._selectionCallbacks.onReferentSelected) {
          this._selectionCallbacks.onReferentSelected(selected.data.id);
        }
      } else if (selected instanceof go.Link) {
        if (this._selectionCallbacks.onLinkSelected) {
          this._selectionCallbacks.onLinkSelected(selected.data.id);
        }
      }
    });
  }

  public setSelectionListeners(callbacks: IDEF3SelectionCallback): void {
    this._selectionCallbacks = callbacks;
  }

  public render(diagram: DiagramDTO): void {
    if (!this._diagram) return;

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    // 1. Add UOBs
    for (const u of diagram.uobs) {
      nodeDataArray.push({
        key: u.id,
        id: u.id,
        category: 'uob',
        name: u.name,
        nodeNumber: u.nodeNumber,
        uobNumber: u.uobNumber,
        hasDecomposition: u.hasDecomposition,
        dNumber: u.dNumber,
        loc: `${u.x} ${u.y}`,
      });
    }

    // 2. Add Junctions
    for (const j of diagram.junctions) {
      nodeDataArray.push({
        key: j.id,
        id: j.id,
        category: 'junction',
        kind: j.kind,
        syncType: j.syncType,
        direction: j.direction,
        junctionNumber: j.junctionNumber,
        loc: `${j.x} ${j.y}`,
      });
    }

    // 3. Add Referents
    for (const r of diagram.referents) {
      nodeDataArray.push({
        key: r.id,
        id: r.id,
        category: 'referent',
        name: r.name,
        type: r.type,
        locator: r.locator,
        loc: `${r.x} ${r.y}`,
      });
    }

    // 4. Add Links
    for (const l of diagram.links) {
      linkDataArray.push({
        key: l.id,
        id: l.id,
        from: l.sourceId,
        fromPort: 'OUT',
        to: l.targetId,
        toPort: 'IN',
        type: l.type,
        label: l.label,
      });
    }

    this._diagram.model = new go.GraphLinksModel({
      linkFromPortIdProperty: 'fromPort',
      linkToPortIdProperty: 'toPort',
      nodeDataArray,
      linkDataArray,
    });

    const allAtZero = diagram.uobs.every((u: UOBDTO) => u.x === 0 && u.y === 0);
    if (allAtZero) {
      this.autoLayout();
    }
  }

  public autoLayout(): void {
    if (!this._diagram) return;
    const layout = this._diagram.layout;
    if (layout) {
      layout.invalidateLayout();
    }
    this.zoomToFit();
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
