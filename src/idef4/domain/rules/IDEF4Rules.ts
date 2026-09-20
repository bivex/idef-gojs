import { IDEF4Diagram } from '../models/IDEF4Diagram';
import { IDEF4Class } from '../models/IDEF4Class';

export interface IDEF4ValidationIssue {
  severity: 'ERROR' | 'WARNING';
  code: string;
  message: string;
  targetId?: string;
}

export class IDEF4Rules {
  /**
   * Check for inheritance cycles (e.g. A -> B -> C -> A).
   */
  public static validateInheritanceCycles(diagram: IDEF4Diagram): IDEF4ValidationIssue[] {
    const issues: IDEF4ValidationIssue[] = [];
    const inheritanceLinks = diagram.relationships.filter((r) => r.isInheritance());

    // Map child -> set of parents
    const parentMap = new Map<string, string[]>();
    for (const link of inheritanceLinks) {
      const parents = parentMap.get(link.sourceClassId) || [];
      parents.push(link.targetClassId);
      parentMap.set(link.sourceClassId, parents);
    }

    // DFS for cycle detection
    for (const cls of diagram.classes) {
      const visited = new Set<string>();
      const stack = [cls.id];
      let hasCycle = false;

      while (stack.length > 0) {
        const curr = stack.pop()!;
        if (visited.has(curr)) {
          if (curr === cls.id) {
            hasCycle = true;
            break;
          }
          continue;
        }
        visited.add(curr);
        const parents = parentMap.get(curr) || [];
        for (const p of parents) {
          if (p === cls.id) {
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
          code: 'IDEF4_INHERITANCE_CYCLE',
          message: `Обнаружен циклический граф наследования для класса "${cls.name}".`,
          targetId: cls.id,
        });
      }
    }

    return issues;
  }

  /**
   * Validate class structure (abstract methods in concrete classes, unique member names).
   */
  public static validateClass(cls: IDEF4Class): IDEF4ValidationIssue[] {
    const issues: IDEF4ValidationIssue[] = [];

    if (!cls.isAbstract && !cls.isInterface) {
      const abstractMethod = cls.methods.find((m) => m.isAbstract);
      if (abstractMethod) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF4_CONCRETE_CLASS_ABSTRACT_METHOD',
          message: `Конкретный класс "${cls.name}" содержит абстрактный метод "${abstractMethod.name}". Класс должен быть объявлен как abstract.`,
          targetId: cls.id,
        });
      }
    }

    return issues;
  }

  /**
   * Validate entire diagram.
   */
  public static validateDiagram(diagram: IDEF4Diagram): IDEF4ValidationIssue[] {
    const issues: IDEF4ValidationIssue[] = [];

    issues.push(...this.validateInheritanceCycles(diagram));

    for (const c of diagram.classes) {
      issues.push(...this.validateClass(c));
    }

    // Unique names check
    const names = new Map<string, string>();
    for (const c of diagram.classes) {
      if (names.has(c.name)) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF4_DUPLICATE_CLASS_NAME',
          message: `Дублирующееся имя класса "${c.name}".`,
          targetId: c.id,
        });
      } else {
        names.set(c.name, c.id);
      }
    }

    return issues;
  }
}
