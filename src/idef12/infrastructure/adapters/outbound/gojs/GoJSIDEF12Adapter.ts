import * as go from 'gojs';
import { IIDEF12DiagramRendererPort } from '../../../../application/ports/outbound/IIDEF12DiagramRendererPort';
import { IDEF12Diagram } from '../../../../domain/models/IDEF12Diagram';
import { createIDEF12NodeTemplateMap } from './templates/OrgUnitNodeTemplate';
import { createIDEF12LinkTemplate } from './templates/OrgLinkTemplate';

export class GoJSIDEF12Adapter implements IIDEF12DiagramRendererPort {
  private _diagram: go.Diagram | null = null;
  private _onSelection?: (id: string, category: string) => void;

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
        direction: 90, // Top-to-Bottom: Divisions -> Departments/Workshops -> Positions/Roles -> Competencies
        layerSpacing: 100,
        columnSpacing: 70,
        setsPortSpots: false,
        isRouting: true,
        packOption: go.LayeredDigraphPack.Expand,
        isInitial: false,
        isOngoing: false,
      }),
    });

    this._diagram.nodeTemplateMap = createIDEF12NodeTemplateMap();
    this._diagram.linkTemplate = createIDEF12LinkTemplate();

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

  public onSelectionChanged(callback: (id: string, category: string) => void): void {
    this._onSelection = callback;
  }

  public renderDiagram(diagram: IDEF12Diagram): void {
    if (!this._diagram) return;

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    // 1. OrgUnits
    for (const u of diagram.orgUnits) {
      nodeDataArray.push({
        key: u.id,
        id: u.id,
        category: 'orgUnit',
        code: u.code,
        name: u.name,
        unitType: u.unitType,
        headPositionName: u.headPositionName,
        headCount: u.headCount,
        location: u.location,
        loc: `${u.position.x} ${u.position.y}`,
      });
    }

    // 2. Positions
    for (const p of diagram.positions) {
      nodeDataArray.push({
        key: p.id,
        id: p.id,
        category: 'position',
        code: p.code,
        name: p.name,
        positionLevel: p.positionLevel,
        responsibilities: p.responsibilities,
        grade: p.grade,
        loc: `${p.position.x} ${p.position.y}`,
      });
    }

    // 3. Roles
    for (const r of diagram.roles) {
      nodeDataArray.push({
        key: r.id,
        id: r.id,
        category: 'orgRole',
        code: r.code,
        name: r.name,
        roleType: r.roleType,
        scope: r.scope,
        loc: `${r.position.x} ${r.position.y}`,
      });
    }

    // 4. Competencies
    for (const c of diagram.competencies) {
      nodeDataArray.push({
        key: c.id,
        id: c.id,
        category: 'competency',
        code: c.code,
        name: c.name,
        criticality: c.criticality,
        certificationBody: c.certificationBody,
        validityMonths: c.validityMonths,
        loc: `${c.position.x} ${c.position.y}`,
      });
    }

    // 5. Links
    for (const l of diagram.links) {
      linkDataArray.push({
        key: l.id,
        id: l.id,
        from: l.sourceId,
        to: l.targetId,
        type: l.type,
        label: l.label,
      });
    }

    this._diagram.model = new go.GraphLinksModel({
      linkKeyProperty: 'key',
      nodeDataArray,
      linkDataArray,
    });
  }

  public clear(): void {
    if (this._diagram) {
      this._diagram.model = new go.GraphLinksModel();
    }
  }

  public autoLayout(): void {
    if (!this._diagram) return;
    this._diagram.startTransaction('autoLayout');
    const layout = this._diagram.layout;
    if (layout) {
      layout.invalidateLayout();
      this._diagram.layoutDiagram(true);
    }
    this._diagram.commitTransaction('autoLayout');
  }

  public zoomToFit(): void {
    if (this._diagram) {
      this._diagram.commandHandler.zoomToFit();
    }
  }

  public exportSVG(): string {
    if (!this._diagram) return '';
    const svg = this._diagram.makeSvg({
      scale: 1,
      background: '#FFFFFF',
    });
    if (!svg) return '';
    return new XMLSerializer().serializeToString(svg);
  }

  public destroy(): void {
    if (this._diagram) {
      this._diagram.div = null;
      this._diagram = null;
    }
  }

  public getDiagram(): go.Diagram | null {
    return this._diagram;
  }
}
