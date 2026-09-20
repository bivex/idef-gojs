import { Entity } from './Entity';
import { Relationship, RelationshipType } from './Relationship';
import { CategorizationCluster } from './Categorization';
import { Attribute } from './Attribute';
import { Position } from './Position';
import { EntityNotFoundError, RelationshipNotFoundError, InvalidIDEF1RuleError } from '../errors/DomainError';
import {
  IDomainEvent,
  EntityCreatedEvent,
  EntityUpdatedEvent,
  EntityRemovedEvent,
  RelationshipAddedEvent,
  RelationshipRemovedEvent,
  CategorizationAddedEvent,
  AttributeAddedEvent,
  AttributeRemovedEvent,
} from '../events/DomainEvents';
import { IDEF1Rules } from '../rules/IDEF1Rules';

export interface IDEF1ModelProps {
  id: string;
  name: string;
}

/**
 * IDEF1Model Aggregate Root
 * Enforces all consistency boundaries and business rules for IDEF1/IDEF1X modeling.
 */
export class IDEF1Model {
  public readonly id: string;
  private _name: string;
  private _entities: Map<string, Entity> = new Map();
  private _relationships: Map<string, Relationship> = new Map();
  private _categorizations: Map<string, CategorizationCluster> = new Map();
  private _domainEvents: IDomainEvent[] = [];

  constructor(props: IDEF1ModelProps) {
    if (!props.id) throw new Error('Model ID is required.');
    this.id = props.id;
    this._name = props.name || 'Untitled IDEF1 Model';
  }

  public get name(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public get entities(): Entity[] {
    return Array.from(this._entities.values());
  }

  public get relationships(): Relationship[] {
    return Array.from(this._relationships.values());
  }

  public get categorizations(): CategorizationCluster[] {
    return Array.from(this._categorizations.values());
  }

  public pullEvents(): IDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  private recordEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  // --- Entity Management ---

  public getEntity(id: string): Entity {
    const entity = this._entities.get(id);
    if (!entity) {
      throw new EntityNotFoundError(id);
    }
    return entity;
  }

  public hasEntity(id: string): boolean {
    return this._entities.has(id);
  }

  public addEntity(entity: Entity): void {
    if (this._entities.has(entity.id)) {
      throw new Error(`Entity with ID "${entity.id}" already exists in model.`);
    }
    this._entities.set(entity.id, entity);
    this.recordEvent(new EntityCreatedEvent(entity));
  }

  public removeEntity(id: string): void {
    if (!this._entities.has(id)) {
      throw new EntityNotFoundError(id);
    }

    // Cascade delete any connected relationships
    const related = this.relationships.filter(
      (r) => r.parentEntityId === id || r.childEntityId === id
    );
    for (const rel of related) {
      this.removeRelationship(rel.id);
    }

    // Cascade delete any connected categorizations
    const cats = this.categorizations.filter(
      (c) => c.genericEntityId === id || c.specificEntityIds.includes(id)
    );
    for (const c of cats) {
      this._categorizations.delete(c.id);
    }

    this._entities.delete(id);
    this.recordEvent(new EntityRemovedEvent(id));
  }

  public updateEntityPosition(id: string, position: Position): void {
    const entity = this.getEntity(id);
    entity.setPosition(position);
    this.recordEvent(new EntityUpdatedEvent(entity));
  }

  // --- Attribute Management ---

  public addAttributeToEntity(entityId: string, attr: Attribute): void {
    const entity = this.getEntity(entityId);
    entity.addAttribute(attr);

    // If added to parent's PK, cascade migrate to children
    if (attr.isPrimaryKey) {
      this.syncKeyMigrationForParent(entityId);
    }

    this.recordEvent(new AttributeAddedEvent(entityId, attr));
    this.recordEvent(new EntityUpdatedEvent(entity));
  }

  public removeAttributeFromEntity(entityId: string, attrName: string): void {
    const entity = this.getEntity(entityId);
    entity.removeAttribute(attrName);
    this.syncKeyMigrationForParent(entityId);

    this.recordEvent(new AttributeRemovedEvent(entityId, attrName));
    this.recordEvent(new EntityUpdatedEvent(entity));
  }

  // --- Relationship Management ---

  public getRelationship(id: string): Relationship {
    const rel = this._relationships.get(id);
    if (!rel) {
      throw new RelationshipNotFoundError(id);
    }
    return rel;
  }

  public addRelationship(rel: Relationship): void {
    if (this._relationships.has(rel.id)) {
      throw new Error(`Relationship with ID "${rel.id}" already exists.`);
    }

    const parent = this.getEntity(rel.parentEntityId);
    const child = this.getEntity(rel.childEntityId);

    IDEF1Rules.validateIdentifyingRelationship(parent, child, rel);

    if (rel.type === RelationshipType.IDENTIFYING) {
      // Check for cycles in identifying relationships
      if (IDEF1Rules.detectIdentifyingCycle(parent.id, child.id, this.relationships)) {
        throw new InvalidIDEF1RuleError(
          'Cycle Detected',
          `Adding this identifying relationship creates an illegal cycle.`
        );
      }
      // Rule: In identifying relationship, child MUST be dependent
      child.setDependent(true);
    }

    this._relationships.set(rel.id, rel);

    // Perform Foreign Key Migration
    this.syncKeyMigrationForParent(parent.id);

    this.recordEvent(new RelationshipAddedEvent(rel));
    this.recordEvent(new EntityUpdatedEvent(child));
  }

  public removeRelationship(id: string): void {
    const rel = this.getRelationship(id);
    this._relationships.delete(id);

    // Check if child should still be dependent
    const child = this.getEntity(rel.childEntityId);
    const otherIdentifying = this.relationships.filter(
      (r) => r.childEntityId === child.id && r.type === RelationshipType.IDENTIFYING
    );
    if (otherIdentifying.length === 0) {
      // If no other identifying relationships or subtype cluster, can revert dependent
      const isSubtype = this.categorizations.some((c) => c.specificEntityIds.includes(child.id));
      if (!isSubtype) {
        child.setDependent(false);
      }
    }

    // Clean up migrated FK attributes
    this.cleanupMigratedKeys(rel);

    this.recordEvent(new RelationshipRemovedEvent(id));
    this.recordEvent(new EntityUpdatedEvent(child));
  }

  // --- Categorization Management ---

  public addCategorization(cluster: CategorizationCluster): void {
    const generic = this.getEntity(cluster.genericEntityId);
    const specifics = cluster.specificEntityIds.map((id) => this.getEntity(id));

    IDEF1Rules.validateCategorization(generic, specifics, cluster);

    // All specific subtype entities become dependent entities inheriting generic PK
    for (const spec of specifics) {
      spec.setDependent(true);
      // Ensure supertype primary keys exist in subtype
      for (const pk of generic.primaryKeyAttributes) {
        const subtypeAttr = new Attribute(
          pk.name,
          true, // Subtype inherits PK
          true, // It is also FK
          pk.dataType,
          { parentEntityId: generic.id, parentAttributeName: pk.name }
        );
        if (spec.hasAttribute(pk.name)) {
          spec.updateAttribute(subtypeAttr);
        } else {
          spec.addAttribute(subtypeAttr);
        }
      }
      this.recordEvent(new EntityUpdatedEvent(spec));
    }

    this._categorizations.set(cluster.id, cluster);
    this.recordEvent(new CategorizationAddedEvent(cluster));
  }

  // --- Foreign Key Migration according to IDEF1X ---

  private syncKeyMigrationForParent(parentId: string): void {
    const parent = this.getEntity(parentId);
    const childRelationships = this.relationships.filter((r) => r.parentEntityId === parentId);

    for (const rel of childRelationships) {
      // In IDEF1X, non-specific (N:M) relationships do not migrate keys until resolved into an associative entity
      if (rel.type === RelationshipType.NON_SPECIFIC) {
        continue;
      }

      const child = this.getEntity(rel.childEntityId);
      const isIdentifying = rel.type === RelationshipType.IDENTIFYING;

      for (const parentPk of parent.primaryKeyAttributes) {
        // Handle role name / self-referencing relationships
        const effectiveRole = rel.roleName || (parent.id === child.id ? 'parent' : undefined);
        const attrName = effectiveRole ? `${effectiveRole}_${parentPk.name}` : parentPk.name;

        const fkAttr = new Attribute(
          attrName,
          isIdentifying, // If identifying, goes to PK; if non-identifying, goes to Non-PK
          true,          // isForeignKey
          parentPk.dataType,
          { parentEntityId: parent.id, parentAttributeName: parentPk.name },
          effectiveRole,
          isIdentifying ? false : rel.isOptional
        );

        if (child.hasAttribute(attrName)) {
          child.updateAttribute(fkAttr);
        } else {
          child.addAttribute(fkAttr);
        }
      }
      this.recordEvent(new EntityUpdatedEvent(child));
    }
  }

  private cleanupMigratedKeys(rel: Relationship): void {
    const child = this.getEntity(rel.childEntityId);
    const parent = this._entities.get(rel.parentEntityId);
    if (!parent) return;

    for (const attr of child.attributes) {
      if (attr.isForeignKey && attr.foreignKeyRef?.parentEntityId === parent.id) {
        child.removeAttribute(attr.name);
      }
    }
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      entities: this.entities.map((e) => e.toJSON()),
      relationships: this.relationships.map((r) => r.toJSON()),
      categorizations: this.categorizations.map((c) => c.toJSON()),
    };
  }
}
