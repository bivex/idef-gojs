import * as go from 'gojs';
import type {
  IIDEF9DiagramRendererPort,
  IDEF9SelectionCallback,
} from '../../../../application/ports/outbound/IIDEF9DiagramRendererPort';
import type { DiagramDTO } from '../../../../application/dtos/IDEF9DTO';
import { createIDEF9NodeTemplateMap } from './templates/ConstraintNodeTemplate';
import { createConstraintLinkTemplate } from './templates/ConstraintLinkTemplate';

export class GoJSIDEF9Adapter implements IIDEF9DiagramRendererPort {
  private _diagram: go.Diagram | null = null;
  private _onSelection?: IDEF9SelectionCallback;

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
        direction: 0, // Left-to-right: SourceDoc → Constraint → ControlledObject / EnforcementMechanism
        layerSpacing: 130,
        columnSpacing: 90,
        setsPortSpots: false,
        isRouting: true,
        packOption: go.LayeredDigraphPack.Expand,
        isInitial: false,
        isOngoing: false,
      }),
    });

    this._diagram.nodeTemplateMap = createIDEF9NodeTemplateMap();
    this._diagram.linkTemplate = createConstraintLinkTemplate();

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

  public onSelectionChanged(callback: IDEF9SelectionCallback): void {
    this._onSelection = callback;
  }

  public renderDiagram(diagram: DiagramDTO): void {
    if (!this._diagram) return;

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    // 1. Constraints (Ограничения / Бизнес-правила)
    for (const c of diagram.constraints) {
      nodeDataArray.push({
        key: c.id,
        id: c.id,
        category: 'constraint',
        code: c.code,
        name: c.name,
        statement: c.statement,
        constraintType: c.constraintType,
        severity: c.severity,
        status: c.status,
        loc: `${c.x} ${c.y}`,
      });
    }

    // 2. Controlled Objects (Управляемые объекты)
    for (const o of diagram.controlledObjects) {
      nodeDataArray.push({
        key: o.id,
        id: o.id,
        category: 'controlledObject',
        name: o.name,
        objectType: o.objectType,
        description: o.description,
        loc: `${o.x} ${o.y}`,
      });
    }

    // 3. Enforcement Mechanisms (Механизмы исполнения)
    for (const m of diagram.enforcementMechanisms) {
      nodeDataArray.push({
        key: m.id,
        id: m.id,
        category: 'enforcementMechanism',
        name: m.name,
        mechanismType: m.mechanismType,
        description: m.description,
        loc: `${m.x} ${m.y}`,
      });
    }

    // 4. Source Documents (Нормативные документы)
    for (const d of diagram.sourceDocuments) {
      nodeDataArray.push({
        key: d.id,
        id: d.id,
        category: 'sourceDocument',
        code: d.code,
        name: d.name,
        documentType: d.documentType,
        description: d.description,
        loc: `${d.x} ${d.y}`,
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
    this._diagram.startTransaction('idef9AutoLayout');
    this._diagram.layoutDiagram(true);
    this._diagram.commitTransaction('idef9AutoLayout');
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
