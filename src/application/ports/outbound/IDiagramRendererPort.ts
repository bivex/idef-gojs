import { IDEF1Model } from '../../../domain/models/IDEF1Model';
import { Entity } from '../../../domain/models/Entity';
import { Relationship } from '../../../domain/models/Relationship';
import { Position } from '../../../domain/models/Position';

export interface IDiagramRendererPort {
  /**
   * Initializes the diagram canvas in the given container
   */
  initialize(container: HTMLElement | string): void;

  /**
   * Complete re-render of the entire domain model
   */
  renderModel(model: IDEF1Model): void;

  /**
   * Incremental render/update of a single entity node
   */
  renderEntity(entity: Entity): void;

  /**
   * Remove an entity node from the canvas
   */
  removeEntity(entityId: string): void;

  /**
   * Incremental render/update of a relationship link
   */
  renderRelationship(relationship: Relationship): void;

  /**
   * Remove a relationship link from the canvas
   */
  removeRelationship(relationshipId: string): void;

  /**
   * Event hooks from diagram back to application layer
   */
  onEntityMoved(callback: (entityId: string, position: Position) => void): void;
  onEntitySelected(callback: (entityId: string | null) => void): void;
  onRelationshipCreated(callback: (parentEntityId: string, childEntityId: string) => void): void;
  onEntityDeleted(callback: (entityId: string) => void): void;

  /**
   * Export diagram as SVG or Image
   */
  makeSvg(): string;
  makeImageDataUrl(): string;

  /**
   * Clean up resources / detach listeners
   */
  destroy(): void;
}
