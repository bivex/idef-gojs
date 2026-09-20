import * as go from 'gojs';
import type {
  IIDEF4DiagramRendererPort,
  IDEF4SelectionCallback,
} from '../../../../application/ports/outbound/IIDEF4DiagramRendererPort';
import type { DiagramDTO, ClassDTO } from '../../../../application/dtos/IDEF4DTO';
import { RelationshipKind } from '../../../../domain/models/IDEF4Relationship';
import { createClassNodeTemplate } from './templates/ClassNodeTemplate';
import { createClassLinkTemplate } from './templates/ClassLinkTemplate';

export class GoJSIDEF4Adapter implements IIDEF4DiagramRendererPort {
  private _diagram: go.Diagram | null = null;
  private _selectionCallbacks: IDEF4SelectionCallback = {};

  public initialize(containerElement: HTMLElement | string): void {
    const $ = go.GraphObject.make;

    this._diagram = new go.Diagram(containerElement as any, {
      'undoManager.isEnabled': true,
      allowCopy: true,
      allowDelete: true,
      'toolManager.mouseWheelBehavior': go.WheelMode.Zoom,
      initialContentAlignment: go.Spot.Center,
      layout: $(go.LayeredDigraphLayout, {
        direction: 90, // Top-to-bottom or 270 bottom-to-top
        layerSpacing: 60,
        columnSpacing: 40,
        setsPortSpots: false,
        isInitial: false,
        isOngoing: false,
      }),
    });

    this._diagram.nodeTemplate = createClassNodeTemplate();
    this._diagram.linkTemplate = createClassLinkTemplate();

    this._diagram.addDiagramListener('ChangedSelection', () => {
      if (!this._diagram) return;
      const selected = this._diagram.selection.first();
      if (!selected) return;

      if (selected instanceof go.Node && this._selectionCallbacks.onClassSelected) {
        this._selectionCallbacks.onClassSelected(selected.data.id);
      } else if (selected instanceof go.Link && this._selectionCallbacks.onRelationshipSelected) {
        this._selectionCallbacks.onRelationshipSelected(selected.data.id);
      }
    });
  }

  public setSelectionListeners(callbacks: IDEF4SelectionCallback): void {
    this._selectionCallbacks = callbacks;
  }

  public render(diagram: DiagramDTO): void {
    if (!this._diagram) return;

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    for (const c of diagram.classes) {
      nodeDataArray.push({
        key: c.id,
        id: c.id,
        name: c.name,
        isAbstract: c.isAbstract,
        isInterface: c.isInterface,
        attributes: c.attributes,
        methods: c.methods,
        loc: `${c.x} ${c.y}`,
      });
    }

    for (const r of diagram.relationships) {
      const isInheritance = r.kind === RelationshipKind.INHERITANCE;
      linkDataArray.push({
        key: r.id,
        id: r.id,
        from: r.sourceClassId,
        fromPort: isInheritance ? 'TOP' : '',
        to: r.targetClassId,
        toPort: isInheritance ? 'BOTTOM' : '',
        kind: r.kind,
        name: r.name,
        sourceMultiplicity: r.sourceMultiplicity,
        targetMultiplicity: r.targetMultiplicity,
        roleName: r.roleName,
      });
    }

    this._diagram.model = new go.GraphLinksModel({
      linkFromPortIdProperty: 'fromPort',
      linkToPortIdProperty: 'toPort',
      nodeDataArray,
      linkDataArray,
    });

    const allAtZero = diagram.classes.every((c: ClassDTO) => c.x === 0 && c.y === 0);
    if (allAtZero) {
      this.autoLayout();
    }
  }

  public autoLayout(): void {
    if (!this._diagram) return;

    this._diagram.startTransaction('idef4-auto-layout');

    const layout = new go.LayeredDigraphLayout({
      direction: 270, // 270: bottom-to-top (subclasses below, superclasses above)
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

    this._diagram.commitTransaction('idef4-auto-layout');
    this.zoomToFit();
  }

  public zoomToFit(): void {
    if (!this._diagram) return;
    this._diagram.zoomToFit();
    if (this._diagram.scale > 1) {
      this._diagram.scale = 1;
    }
    this._diagram.contentAlignment = go.Spot.Center;
  }

  public destroy(): void {
    if (this._diagram) {
      this._diagram.div = null;
      this._diagram = null;
    }
  }
}
