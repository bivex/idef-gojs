import { Entity } from '../models/Entity';
import { Relationship, RelationshipType } from '../models/Relationship';
import { CategorizationCluster } from '../models/Categorization';
import { InvalidIDEF1RuleError } from '../errors/DomainError';

export class IDEF1Rules {
  /**
   * Rule 1: An identifying relationship requires the child entity to be dependent.
   */
  public static validateIdentifyingRelationship(parent: Entity, child: Entity, rel: Relationship): void {
    if (rel.type === RelationshipType.IDENTIFYING) {
      if (parent.id === child.id) {
        throw new InvalidIDEF1RuleError(
          'Identifying Self-Relationship',
          `An entity ("${parent.name}") cannot have an identifying relationship with itself.`
        );
      }
    }
  }

  /**
   * Rule 2: Subtypes must have identical primary key structure to generic entity.
   */
  public static validateCategorization(generic: Entity, specifics: Entity[], _cluster?: CategorizationCluster): void {
    if (specifics.some((s) => s.id === generic.id)) {
      throw new InvalidIDEF1RuleError(
        'Categorization Invariant',
        `Generic entity "${generic.name}" cannot be its own specific subtype.`
      );
    }
  }

  /**
   * Rule 3: Check for circular identifying relationship chains.
   */
  public static detectIdentifyingCycle(
    startEntityId: string,
    targetEntityId: string,
    relationships: Relationship[]
  ): boolean {
    const adj = new Map<string, string[]>();
    for (const r of relationships) {
      if (r.type === RelationshipType.IDENTIFYING) {
        const list = adj.get(r.parentEntityId) || [];
        list.push(r.childEntityId);
        adj.set(r.parentEntityId, list);
      }
    }

    // DFS to check if path exists from target to start
    const visited = new Set<string>();
    const stack = [targetEntityId];

    while (stack.length > 0) {
      const curr = stack.pop()!;
      if (curr === startEntityId) {
        return true;
      }
      if (!visited.has(curr)) {
        visited.add(curr);
        const neighbors = adj.get(curr) || [];
        for (const next of neighbors) {
          stack.push(next);
        }
      }
    }

    return false;
  }
}
