import * as go from 'gojs';
import type {
  IIDEF5DiagramRendererPort,
  IDEF5SelectionCallback,
} from '../../../../application/ports/outbound/IIDEF5DiagramRendererPort';
import type { DiagramDTO, KindDTO } from '../../../../application/dtos/IDEF5DTO';
import { OntologyRelationType } from '../../../../domain/models/IDEF5Relation';
import { createKindNodeTemplate } from './templates/KindNodeTemplate';
import { createOntologyLinkTemplate } from './templates/OntologyLinkTemplate';

export class GoJSIDEF5Adapter implements IIDEF5DiagramRendererPort {
  private _diagram: go.Diagram | null = null;
  private _selectionCallbacks: IDEF5SelectionCallback = {};

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
        direction: 270, // Bottom-to-top taxonomy (leaves at bottom, superkinds at top)
        layerSpacing: 110,
        columnSpacing: 85,
        setsPortSpots: false,
        isRouting: true,
        packOption: go.LayeredDigraphPack.Expand,
        isInitial: false,
        isOngoing: false,
      }),
    });

    this._diagram.nodeTemplate = createKindNodeTemplate();
    this._diagram.linkTemplate = createOntologyLinkTemplate();

    this._diagram.addDiagramListener('ChangedSelection', () => {
      if (!this._diagram) return;
      const selected = this._diagram.selection.first();
      if (!selected) return;

      if (selected instanceof go.Node && this._selectionCallbacks.onKindSelected) {
        this._selectionCallbacks.onKindSelected(selected.data.id);
      } else if (selected instanceof go.Link && this._selectionCallbacks.onRelationSelected) {
        this._selectionCallbacks.onRelationSelected(selected.data.id);
      }
    });
  }

  public setSelectionListeners(callbacks: IDEF5SelectionCallback): void {
    this._selectionCallbacks = callbacks;
  }

  public render(diagram: DiagramDTO): void {
    if (!this._diagram) return;

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    for (const k of diagram.kinds) {
      nodeDataArray.push({
        key: k.id,
        id: k.id,
        name: k.name,
        description: k.description,
        isIndividual: k.isIndividual,
        properties: k.properties,
        loc: `${k.x} ${k.y}`,
      });
    }

    for (const r of diagram.relations) {
      const isTaxonomyOrInst =
        r.type === OntologyRelationType.SUBKIND_OF ||
        r.type === OntologyRelationType.INSTANTIATES;

      linkDataArray.push({
        key: r.id,
        id: r.id,
        from: r.sourceKindId,
        fromPort: isTaxonomyOrInst ? 'TOP' : '',
        to: r.targetKindId,
        toPort: isTaxonomyOrInst ? 'BOTTOM' : '',
        type: r.type,
        name: r.name,
        isTransitive: r.isTransitive,
        isSymmetric: r.isSymmetric,
        isReflexive: r.isReflexive,
      });
    }

    this._diagram.model = new go.GraphLinksModel({
      linkFromPortIdProperty: 'fromPort',
      linkToPortIdProperty: 'toPort',
      nodeDataArray,
      linkDataArray,
    });

    const allAtZero = diagram.kinds.every((k: KindDTO) => k.x === 0 && k.y === 0);
    if (allAtZero) {
      this.autoLayout();
    }
  }

  public autoLayout(): void {
    if (!this._diagram) return;

    this._diagram.startTransaction('idef5-auto-layout');

    const layout = new go.LayeredDigraphLayout({
      direction: 270, // 270: bottom-to-top so roots (Product, Equipment) are at top
      layerSpacing: 110,
      columnSpacing: 85,
      setsPortSpots: false,
      isRouting: true,
      aggressiveOption: go.LayeredDigraphAggressive.More,
      packOption: go.LayeredDigraphPack.Expand,
    });

    layout.doLayout(this._diagram);

    // Sync calculated positions to model data
    this._diagram.nodes.each((node) => {
      const pt = node.location;
      this._diagram!.model.setDataProperty(node.data, 'loc', go.Point.stringify(pt));
    });

    this._diagram.commitTransaction('idef5-auto-layout');
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
