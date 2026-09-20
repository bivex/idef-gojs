import { IDEF9Diagram } from '../models/IDEF9Diagram';
import { ConstraintSeverity } from '../models/IDEF9Constraint';
import { ConstraintLinkType } from '../models/IDEF9Link';

export interface IDEF9ValidationIssue {
  code: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
  elementId?: string;
}

export class IDEF9Rules {
  public static validate(diagram: IDEF9Diagram): IDEF9ValidationIssue[] {
    const issues: IDEF9ValidationIssue[] = [];

    // 1. Check for dangling links
    for (const link of diagram.links) {
      if (!diagram.hasElement(link.sourceId)) {
        issues.push({
          code: 'IDEF9_DANGLING_LINK_SOURCE',
          message: `Связь ${link.id} ссылается на несуществующий источник "${link.sourceId}".`,
          severity: 'ERROR',
          elementId: link.id,
        });
      }
      if (!diagram.hasElement(link.targetId)) {
        issues.push({
          code: 'IDEF9_DANGLING_LINK_TARGET',
          message: `Связь ${link.id} ссылается на несуществующую цель "${link.targetId}".`,
          severity: 'ERROR',
          elementId: link.id,
        });
      }
    }

    // 2. Duplicate constraint codes check
    const codes = new Set<string>();
    for (const c of diagram.constraints) {
      const upper = c.code.toUpperCase();
      if (codes.has(upper)) {
        issues.push({
          code: 'IDEF9_DUPLICATE_CONSTRAINT_CODE',
          message: `Обнаружено дублирование кода бизнес-ограничения: "${c.code}". Коды правил должны быть уникальны.`,
          severity: 'ERROR',
          elementId: c.id,
        });
      }
      codes.add(upper);
    }

    // 3. Mandatory constraint without enforcement mechanism
    for (const c of diagram.constraints) {
      if (c.severity === ConstraintSeverity.MANDATORY) {
        const hasEnforcement = diagram.links.some(
          (l) => l.sourceId === c.id && l.type === ConstraintLinkType.ENFORCED_BY
        );
        if (!hasEnforcement) {
          issues.push({
            code: 'IDEF9_MANDATORY_WITHOUT_ENFORCEMENT',
            message: `Строго обязательное ограничение [${c.code}] "${c.name}" не имеет механизма контроля/принуждения (ENFORCED_BY). Правило без механизма принуждения не гарантирует исполнение.`,
            severity: 'WARNING',
            elementId: c.id,
          });
        }
      }
    }

    // 4. Unattached constraint (does not constrain any target object/process)
    for (const c of diagram.constraints) {
      const hasTarget = diagram.links.some(
        (l) => l.sourceId === c.id && l.type === ConstraintLinkType.CONSTRAINS
      );
      if (!hasTarget) {
        issues.push({
          code: 'IDEF9_UNATTACHED_CONSTRAINT',
          message: `Ограничение [${c.code}] "${c.name}" изолировано и не привязано ни к одному объекту, процессу или ресурсу (CONSTRAINS).`,
          severity: 'WARNING',
          elementId: c.id,
        });
      }
    }

    // 5. Conflicting constraints notice
    const conflicts = diagram.links.filter((l) => l.type === ConstraintLinkType.CONFLICTS_WITH);
    for (const conf of conflicts) {
      const c1 = diagram.getConstraint(conf.sourceId);
      const c2 = diagram.getConstraint(conf.targetId);
      issues.push({
        code: 'IDEF9_ACTIVE_CONFLICT',
        message: `Зафиксирован конфликт/противоречие между правилами [${c1?.code || conf.sourceId}] и [${c2?.code || conf.targetId}]. Требуется гармонизация или приоритезация регламентов.`,
        severity: 'WARNING',
        elementId: conf.id,
      });
    }

    return issues;
  }
}
