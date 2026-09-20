import * as go from 'gojs';
import type {
  IIDEF8DiagramRendererPort,
  IDEF8SelectionCallback,
} from '../../../../application/ports/outbound/IIDEF8DiagramRendererPort';
import type { DiagramDTO } from '../../../../application/dtos/IDEF8DTO';
import { createIDEF8NodeTemplateMap } from './templates/ScreenNodeTemplate';
import { createInteractionLinkTemplate } from './templates/InteractionLinkTemplate';

export class GoJSIDEF8Adapter implements IIDEF8DiagramRendererPort {
  private _diagram: go.Diagram | null = null;
  private _onSelection?: IDEF8SelectionCallback;

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
        direction: 0, // Left-to-right interaction flow
        layerSpacing: 120,
        columnSpacing: 80,
        setsPortSpots: false,
        isRouting: true,
        packOption: go.LayeredDigraphPack.Expand,
        isInitial: false,
        isOngoing: false,
      }),
    });

    this._diagram.nodeTemplateMap = createIDEF8NodeTemplateMap();
    this._diagram.linkTemplate = createInteractionLinkTemplate();

    this._diagram.addDiagramListener('ChangedSelection', () => {
      if (!this._diagram || !this._onSelection) return;
      const selected = this._diagram.selection.first();
      if (!selected) return;

      if (selected instanceof go.Node) {
        this._onSelection(selected.data.id, selected.data.category);
      } else if (selected instanceof go.Link) {
        this._onSelection(selected.data.id, 'link');
      }
    });
  }

  public onSelectionChanged(callback: IDEF8SelectionCallback): void {
    this._onSelection = callback;
  }

  public renderDiagram(diagram: DiagramDTO): void {
    if (!this._diagram) return;

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    // 1. Screens
    for (const s of diagram.screens) {
      nodeDataArray.push({
        key: s.id,
        id: s.id,
        category: 'screen',
        name: s.name,
        description: s.description,
        screenType: s.screenType,
        state: s.state,
        widgets: s.widgets,
        loc: `${s.x} ${s.y}`,
      });
    }

    // 2. User Actions
    for (const a of diagram.userActions) {
      nodeDataArray.push({
        key: a.id,
        id: a.id,
        category: 'userAction',
        name: a.name,
        modality: a.modality,
        targetWidgetId: a.targetWidgetId,
        description: a.description,
        loc: `${a.x} ${a.y}`,
      });
    }

    // 3. System Responses
    for (const r of diagram.systemResponses) {
      nodeDataArray.push({
        key: r.id,
        id: r.id,
        category: 'systemResponse',
        name: r.name,
        responseType: r.responseType,
        description: r.description,
        loc: `${r.x} ${r.y}`,
      });
    }

    // 4. User Roles
    for (const role of diagram.userRoles) {
      nodeDataArray.push({
        key: role.id,
        id: role.id,
        category: 'userRole',
        name: role.name,
        privilegeLevel: role.privilegeLevel,
        description: role.description,
        loc: `${role.x} ${role.y}`,
      });
    }

    // 5. Links
    for (const l of diagram.links) {
      linkDataArray.push({
        id: l.id,
        from: l.sourceId,
        to: l.targetId,
        type: l.type,
        label: l.label,
      });
    }

    this._diagram.model = new go.GraphLinksModel({
      linkKeyProperty: 'id',
      nodeDataArray,
      linkDataArray,
    });
  }

  public autoLayout(): void {
    if (!this._diagram) return;
    this._diagram.startTransaction('idef8AutoLayout');
    this._diagram.layoutDiagram(true);
    this._diagram.commitTransaction('idef8AutoLayout');
    this.zoomToFit();
  }

  public zoomToFit(): void {
    if (!this._diagram) return;
    this._diagram.commandHandler.zoomToFit();
  }

  public destroy(): void {
    if (this._diagram) {
      this._diagram.clear();
      this._diagram.div = null;
      this._diagram = null;
    }
  }
}
