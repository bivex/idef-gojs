import * as go from 'gojs';
import { IDiagramRendererPort } from '../../../../application/ports/outbound/IDiagramRendererPort';
import { IDEF1Model } from '../../../../domain/models/IDEF1Model';
import { Entity } from '../../../../domain/models/Entity';
import { Relationship } from '../../../../domain/models/Relationship';
import { Position } from '../../../../domain/models/Position';
import { createEntityNodeTemplate } from './templates/EntityNodeTemplate';
import { createRelationshipLinkTemplate } from './templates/RelationshipLinkTemplate';
import { createSubtypeNodeTemplate } from './templates/SubtypeNodeTemplate';
import { createNoteNodeTemplate } from './templates/NoteNodeTemplate';

export type IDEF1XViewLevel = 'ER' | 'KB' | 'FA'; // FIPS 184 §3.10 View Levels

export interface AutoLayoutOptions {
  direction?: 0 | 90; // 0 = Left-to-Right, 90 = Top-to-Bottom (IDEF1 standard)
  layerSpacing?: number; // Space between entity hierarchies (default 70)
  columnSpacing?: number; // Space between parallel entities (default 50)
}

export interface GoJSDiagramOptions {
  readOnly?: boolean;
  allowClipboard?: boolean;
  gridVisible?: boolean;
  viewLevel?: IDEF1XViewLevel;
}

/**
 * GoJSDiagramAdapter (Outbound Adapter)
 * Implements the IDiagramRendererPort to connect the Hexagonal domain
 * to GoJS rendering and user interactions.
 */
export class GoJSDiagramAdapter implements IDiagramRendererPort {
  private diagram: go.Diagram | null = null;
  private isInternalUpdate: boolean = false;

  private onEntityMovedCallbacks: Array<(entityId: string, pos: Position) => void> = [];
  private onEntitySelectedCallbacks: Array<(entityId: string | null) => void> = [];
  private onRelationshipCreatedCallbacks: Array<(parentEntityId: string, childEntityId: string) => void> = [];
  private onEntityDeletedCallbacks: Array<(entityId: string) => void> = [];

  private currentViewLevel: IDEF1XViewLevel = 'FA';

  constructor(private readonly options: GoJSDiagramOptions = {}) {
    this.currentViewLevel = options.viewLevel ?? 'FA';
  }

  public getViewLevel(): IDEF1XViewLevel {
    return this.currentViewLevel;
  }

  public setViewLevel(level: IDEF1XViewLevel): void {
    this.currentViewLevel = level;
    if (this.diagram) {
      this.diagram.startTransaction('changeViewLevel');
      this.diagram.nodes.each((node) => {
        if (node.category !== 'subtype' && node.category !== 'note') {
          const showPk = level !== 'ER';
          const showDivider = level === 'FA';
          const showNonKey = level === 'FA';
          this.diagram?.model.set(node.data, 'showPk', showPk);
          this.diagram?.model.set(node.data, 'showDivider', showDivider);
          this.diagram?.model.set(node.data, 'showNonKey', showNonKey);
        }
      });
      this.diagram.commitTransaction('changeViewLevel');
    }
  }

  /**
   * Automatic hierarchical layout for IDEF1/IDEF1X models
   * Arranges independent entities at the top/left and dependent/child entities below,
   * aligning routing channels and minimizing link crossovers.
   */
  public autoLayout(options: AutoLayoutOptions = {}): void {
    if (!this.diagram) return;

    const dir = options.direction ?? 0;
    const layout = new go.LayeredDigraphLayout({
      direction: dir,
      layerSpacing: options.layerSpacing ?? 70,
      columnSpacing: options.columnSpacing ?? 50,
      setsPortSpots: false,
      isRouting: true,
      aggressiveOption: go.LayeredDigraphAggressive.More,
    });

    this.isInternalUpdate = true;
    this.diagram.startTransaction('autoLayout');
    layout.doLayout(this.diagram);

    // Sync new computed coordinates back to domain/application layer
    this.diagram.nodes.each((node) => {
      if (node.category !== 'subtype' && node.category !== 'note') {
        const loc = node.location;
        this.onEntityMovedCallbacks.forEach((cb) =>
          cb(node.data.key, new Position(loc.x, loc.y))
        );
      }
    });

    this.diagram.commitTransaction('autoLayout');
    this.isInternalUpdate = false;
    this.diagram.zoomToFit();
  }

  public zoomToFit(): void {
    if (this.diagram) {
      this.diagram.zoomToFit();
    }
  }

  public getGoJSDiagram(): go.Diagram {
    if (!this.diagram) {
      throw new Error('GoJS Diagram has not been initialized yet. Call initialize(container) first.');
    }
    return this.diagram;
  }

  public initialize(container: HTMLElement | string): void {
    if (this.diagram) {
      this.destroy();
    }

    const domElement =
      typeof container === 'string' ? document.getElementById(container) : container;

    if (!domElement) {
      throw new Error(`Container element not found for GoJS diagram.`);
    }

    const div = domElement as HTMLDivElement;
    const diagram = new go.Diagram(div, {
      'undoManager.isEnabled': true,
      'animationManager.isEnabled': false,
      isReadOnly: this.options.readOnly ?? false,
      allowClipboard: this.options.allowClipboard ?? true,
      'grid.visible': this.options.gridVisible ?? true,
      'toolManager.mouseWheelBehavior': go.WheelMode.Zoom,
      'draggingTool.isGridSnapEnabled': true,
    });

    const nodeTemplateMap = new go.Map<string, go.Node>();
    nodeTemplateMap.add('', createEntityNodeTemplate());
    nodeTemplateMap.add('entity', createEntityNodeTemplate());
    nodeTemplateMap.add('subtype', createSubtypeNodeTemplate());
    nodeTemplateMap.add('note', createNoteNodeTemplate());
    diagram.nodeTemplateMap = nodeTemplateMap;

    diagram.linkTemplate = createRelationshipLinkTemplate();

    // Setup Model
    diagram.model = new go.GraphLinksModel({
      linkKeyProperty: 'key',
      linkFromKeyProperty: 'from',
      linkToKeyProperty: 'to',
      nodeKeyProperty: 'key',
    });

    this.diagram = diagram;
    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.diagram) return;

    // Selection listener
    this.diagram.addDiagramListener('ChangedSelection', () => {
      if (this.isInternalUpdate || !this.diagram) return;
      const selected = this.diagram.selection.first();
      if (selected instanceof go.Node && selected.category !== 'subtype') {
        const entityId = selected.data.key;
        this.onEntitySelectedCallbacks.forEach((cb) => cb(entityId));
      } else {
        this.onEntitySelectedCallbacks.forEach((cb) => cb(null));
      }
    });

    // Node moved listener
    this.diagram.addDiagramListener('SelectionMoved', () => {
      if (this.isInternalUpdate || !this.diagram) return;
      this.diagram.selection.each((part) => {
        if (part instanceof go.Node && part.category !== 'subtype') {
          const loc = part.location;
          this.onEntityMovedCallbacks.forEach((cb) =>
            cb(part.data.key, new Position(loc.x, loc.y))
          );
        }
      });
    });

    // Link drawn by user listener
    this.diagram.addDiagramListener('LinkDrawn', (e) => {
      if (this.isInternalUpdate) return;
      const link = e.subject as go.Link;
      if (link && link.fromNode && link.toNode) {
        const fromKey = link.fromNode.data.key;
        const toKey = link.toNode.data.key;
        this.onRelationshipCreatedCallbacks.forEach((cb) => cb(fromKey, toKey));
      }
    });

    // Node deletion listener
    this.diagram.addDiagramListener('SelectionDeleted', (e) => {
      if (this.isInternalUpdate) return;
      e.subject.each((part: go.Part) => {
        if (part instanceof go.Node && part.category !== 'subtype') {
          this.onEntityDeletedCallbacks.forEach((cb) => cb(part.data.key));
        }
      });
    });
  }

  public renderModel(model: IDEF1Model): void {
    if (!this.diagram) return;

    this.isInternalUpdate = true;
    this.diagram.startTransaction('renderModel');

    const nodeDataArray: any[] = [];
    const linkDataArray: any[] = [];

    // Entities
    for (const entity of model.entities) {
      nodeDataArray.push(this.transformEntityToNodeData(entity));
    }

    // Categorization clusters
    for (const cat of model.categorizations) {
      const clusterKey = `cluster_${cat.id}`;
      // Generic entity to cluster node
      const generic = model.getEntity(cat.genericEntityId);
      const genericPos = generic.position;
      nodeDataArray.push({
        key: clusterKey,
        category: 'subtype',
        discriminator: cat.discriminatorAttributeName,
        isComplete: cat.isComplete,
        loc: go.Point.stringify(new go.Point(genericPos.x + 80, genericPos.y + 120)),
      });

      // Link from generic to cluster
      linkDataArray.push({
        key: `link_generic_${cat.id}`,
        from: cat.genericEntityId,
        to: clusterKey,
        type: 'IDENTIFYING',
        name: '',
      });

      // Links from cluster to specific entities
      for (const specId of cat.specificEntityIds) {
        linkDataArray.push({
          key: `link_spec_${cat.id}_${specId}`,
          from: clusterKey,
          to: specId,
          type: 'IDENTIFYING',
          name: '',
        });
      }
    }

    // Relationships
    for (const rel of model.relationships) {
      linkDataArray.push({
        key: rel.id,
        from: rel.parentEntityId,
        to: rel.childEntityId,
        name: rel.name,
        inverseName: rel.inverseName,
        roleName: rel.roleName,
        type: rel.type,
        cardinality: rel.cardinality,
        cardinalityValue: rel.cardinalityValue,
        isOptional: rel.isOptional,
      });
    }

    const graphModel = this.diagram.model as go.GraphLinksModel;
    graphModel.nodeDataArray = nodeDataArray;
    graphModel.linkDataArray = linkDataArray;

    this.diagram.commitTransaction('renderModel');
    this.isInternalUpdate = false;
  }

  public renderEntity(entity: Entity): void {
    if (!this.diagram) return;

    const graphModel = this.diagram.model as go.GraphLinksModel;
    const existingData = graphModel.findNodeDataForKey(entity.id);
    const newData = this.transformEntityToNodeData(entity);

    this.isInternalUpdate = true;
    this.diagram.startTransaction('renderEntity');

    if (existingData) {
      graphModel.set(existingData, 'name', newData.name);
      graphModel.set(existingData, 'number', newData.number);
      graphModel.set(existingData, 'isDependent', newData.isDependent);
      graphModel.set(existingData, 'primaryKeys', newData.primaryKeys);
      graphModel.set(existingData, 'nonKeys', newData.nonKeys);
      graphModel.set(existingData, 'loc', newData.loc);
    } else {
      graphModel.addNodeData(newData);
    }

    this.diagram.commitTransaction('renderEntity');
    this.isInternalUpdate = false;
  }

  public removeEntity(entityId: string): void {
    if (!this.diagram) return;

    const graphModel = this.diagram.model as go.GraphLinksModel;
    const data = graphModel.findNodeDataForKey(entityId);
    if (data) {
      this.isInternalUpdate = true;
      this.diagram.startTransaction('removeEntity');
      graphModel.removeNodeData(data);
      this.diagram.commitTransaction('removeEntity');
      this.isInternalUpdate = false;
    }
  }

  public renderRelationship(relationship: Relationship): void {
    if (!this.diagram) return;

    const graphModel = this.diagram.model as go.GraphLinksModel;
    const existing = graphModel.findLinkDataForKey(relationship.id);
    const linkData = {
      key: relationship.id,
      from: relationship.parentEntityId,
      to: relationship.childEntityId,
      name: relationship.name,
      inverseName: relationship.inverseName,
      roleName: relationship.roleName,
      type: relationship.type,
      cardinality: relationship.cardinality,
      cardinalityValue: relationship.cardinalityValue,
      isOptional: relationship.isOptional,
    };

    this.isInternalUpdate = true;
    this.diagram.startTransaction('renderRelationship');

    if (existing) {
      graphModel.set(existing, 'name', linkData.name);
      graphModel.set(existing, 'inverseName', linkData.inverseName);
      graphModel.set(existing, 'roleName', linkData.roleName);
      graphModel.set(existing, 'type', linkData.type);
      graphModel.set(existing, 'cardinality', linkData.cardinality);
      graphModel.set(existing, 'cardinalityValue', linkData.cardinalityValue);
      graphModel.set(existing, 'isOptional', linkData.isOptional);
    } else {
      graphModel.addLinkData(linkData);
    }

    this.diagram.commitTransaction('renderRelationship');
    this.isInternalUpdate = false;
  }

  public removeRelationship(relationshipId: string): void {
    if (!this.diagram) return;

    const graphModel = this.diagram.model as go.GraphLinksModel;
    const data = graphModel.findLinkDataForKey(relationshipId);
    if (data) {
      this.isInternalUpdate = true;
      this.diagram.startTransaction('removeRelationship');
      graphModel.removeLinkData(data);
      this.diagram.commitTransaction('removeRelationship');
      this.isInternalUpdate = false;
    }
  }

  public onEntityMoved(callback: (entityId: string, position: Position) => void): void {
    this.onEntityMovedCallbacks.push(callback);
  }

  public onEntitySelected(callback: (entityId: string | null) => void): void {
    this.onEntitySelectedCallbacks.push(callback);
  }

  public onRelationshipCreated(callback: (parentEntityId: string, childEntityId: string) => void): void {
    this.onRelationshipCreatedCallbacks.push(callback);
  }

  public onEntityDeleted(callback: (entityId: string) => void): void {
    this.onEntityDeletedCallbacks.push(callback);
  }

  public makeSvg(): string {
    if (!this.diagram) return '';
    const svgElem = this.diagram.makeSvg({
      scale: 1,
      background: '#FFFFFF',
    });
    return svgElem ? new XMLSerializer().serializeToString(svgElem) : '';
  }

  public makeImageDataUrl(): string {
    if (!this.diagram) return '';
    return this.diagram.makeImageData({
      scale: 1,
      background: '#FFFFFF',
    }) as string;
  }

  public destroy(): void {
    if (this.diagram) {
      this.diagram.div = null;
      this.diagram = null;
    }
    this.onEntityMovedCallbacks = [];
    this.onEntitySelectedCallbacks = [];
    this.onRelationshipCreatedCallbacks = [];
    this.onEntityDeletedCallbacks = [];
  }

  private transformEntityToNodeData(entity: Entity): any {
    const showPk = this.currentViewLevel !== 'ER';
    const showDivider = this.currentViewLevel === 'FA';
    const showNonKey = this.currentViewLevel === 'FA';

    return {
      key: entity.id,
      category: 'entity',
      name: entity.name,
      number: entity.number,
      isDependent: entity.isDependent,
      loc: go.Point.stringify(new go.Point(entity.position.x, entity.position.y)),
      showPk,
      showDivider,
      showNonKey,
      primaryKeys: entity.primaryKeyAttributes.map((a) => ({
        name: a.name,
        formattedName: a.formattedName,
        dataType: a.dataType,
        isForeignKey: a.isForeignKey,
      })),
      nonKeys: entity.nonKeyAttributes.map((a) => ({
        name: a.name,
        formattedName: a.formattedName,
        dataType: a.dataType,
        isForeignKey: a.isForeignKey,
      })),
    };
  }
}
