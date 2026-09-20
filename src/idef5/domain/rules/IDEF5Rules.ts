import { IDEF5Diagram } from '../models/IDEF5Diagram';
import { OntologyRelationType } from '../models/IDEF5Relation';

export interface IDEF5ValidationIssue {
  severity: 'ERROR' | 'WARNING';
  code: string;
  message: string;
  targetId?: string;
}

export class IDEF5Rules {
  /**
   * Check for taxonomy cycles in subkind-of relations.
   */
  public static validateTaxonomyCycles(diagram: IDEF5Diagram): IDEF5ValidationIssue[] {
    const issues: IDEF5ValidationIssue[] = [];
    const subkindLinks = diagram.relations.filter(
      (r) => r.type === OntologyRelationType.SUBKIND_OF
    );

    const parentMap = new Map<string, string[]>();
    for (const l of subkindLinks) {
      const parents = parentMap.get(l.sourceKindId) || [];
      parents.push(l.targetKindId);
      parentMap.set(l.sourceKindId, parents);
    }

    for (const kind of diagram.kinds) {
      const visited = new Set<string>();
      const stack = [kind.id];
      let hasCycle = false;

      while (stack.length > 0) {
        const curr = stack.pop()!;
        if (visited.has(curr)) {
          if (curr === kind.id) {
            hasCycle = true;
            break;
          }
          continue;
        }
        visited.add(curr);
        const parents = parentMap.get(curr) || [];
        for (const p of parents) {
          if (p === kind.id) {
            hasCycle = true;
            break;
          }
          stack.push(p);
        }
        if (hasCycle) break;
      }

      if (hasCycle) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF5_TAXONOMY_CYCLE',
          message: `Обнаружен циклический граф таксономии (subkind-of) для понятия "${kind.name}".`,
          targetId: kind.id,
        });
      }
    }

    return issues;
  }

  /**
   * Validate entire ontology schematic.
   */
  public static validateDiagram(diagram: IDEF5Diagram): IDEF5ValidationIssue[] {
    const issues: IDEF5ValidationIssue[] = [];

    issues.push(...this.validateTaxonomyCycles(diagram));

    // Unique names
    const names = new Map<string, string>();
    for (const k of diagram.kinds) {
      if (names.has(k.name)) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF5_DUPLICATE_KIND_NAME',
          message: `Дублирующееся наименование понятия (Kind) "${k.name}".`,
          targetId: k.id,
        });
      } else {
        names.set(k.name, k.id);
      }
    }

    // Check relations
    const kindIds = new Set(diagram.kinds.map((k) => k.id));
    for (const r of diagram.relations) {
      if (!kindIds.has(r.sourceKindId) || !kindIds.has(r.targetKindId)) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF5_DANGLING_RELATION',
          message: `Отношение "${r.id}" связывает несуществующие понятия.`,
          targetId: r.id,
        });
      }
    }

    return issues;
  }
}
