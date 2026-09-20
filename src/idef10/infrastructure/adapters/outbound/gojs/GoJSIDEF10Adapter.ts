import * as go from 'gojs';
import type {
  IIDEF10DiagramRendererPort,
  IDEF10SelectionCallback,
} from '../../../../application/ports/outbound/IIDEF10DiagramRendererPort';
import type { DiagramDTO } from '../../../../application/dtos/IDEF10DTO';
import { createIDEF10NodeTemplateMap } from './templates/ComponentNodeTemplate';
import { createArchitectureLinkTemplate } from './templates/ArchitectureLinkTemplate';

export class GoJSIDEF10Adapter implements IIDEF10DiagramRendererPort {
  private _diagram: go.Diagram | null = null;
  private _onSelection?: IDEF10SelectionCallback;

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
        direction: 0, // Left-to-right: Components/Clients → Interfaces → Services/Databases → Execution Nodes
        layerSpacing: 130,
        columnSpacing: 90,
        setsPortSpots: false,
        isRouting: true,
        packOption: go.LayeredDigraphPack.Expand,
        isInitial: false,
        isOngoing: false,
      }),
    });

    this._diagram.nodeTemplateMap = createIDEF10NodeTemplateMap();
    this._diagram.linkTemplate = createArchitectureLinkTemplate();

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

  public onSelectionChanged(callback: IDEF10SelectionCallback): void {
    this._onSelection = callback;
  }

  public renderDiagram(diagram: DiagramDTO): void {
    if (!this._diagram) return;

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    // 1. Components
    for (const c of diagram.components) {
      nodeDataArray.push({
        key: c.id,
        id: c.id,
        category: 'component',
        code: c.code,
        name: c.name,
        techStack: c.techStack,
        version: c.version,
        componentType: c.componentType,
        lifecycle: c.lifecycle,
        description: c.description,
        loc: `${c.x} ${c.y}`,
      });
    }

    // 2. Execution Nodes
    for (const n of diagram.executionNodes) {
      nodeDataArray.push({
        key: n.id,
        id: n.id,
        category: 'executionNode',
        code: n.code,
        name: n.name,
        nodeType: n.nodeType,
        ipAddress: n.ipAddress,
        osPlatform: n.osPlatform,
        description: n.description,
        loc: `${n.x} ${n.y}`,
      });
    }

    // 3. Interfaces
    for (const i of diagram.interfaces) {
      nodeDataArray.push({
        key: i.id,
        id: i.id,
        category: 'interface',
        name: i.name,
        protocol: i.protocol,
        role: i.role,
        portNumber: i.portNumber,
        specification: i.specification,
        description: i.description,
        loc: `${i.x} ${i.y}`,
      });
    }

    // 4. Artifacts
    for (const a of diagram.artifacts) {
      nodeDataArray.push({
        key: a.id,
        id: a.id,
        category: 'artifact',
        name: a.name,
        artifactType: a.artifactType,
        fileName: a.fileName,
        repositoryUrl: a.repositoryUrl,
        description: a.description,
        loc: `${a.x} ${a.y}`,
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
    this._diagram.startTransaction('idef10AutoLayout');
    this._diagram.layoutDiagram(true);
    this._diagram.commitTransaction('idef10AutoLayout');
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
