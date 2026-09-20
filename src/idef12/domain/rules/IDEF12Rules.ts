import { IDEF12Diagram } from '../models/IDEF12Diagram';
import { OrgLinkType } from '../models/IDEF12Link';
import { OrgRoleType } from '../models/IDEF12OrgRole';

export interface IDEF12ValidationIssue {
  code: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
  elementId?: string;
}

export class IDEF12Rules {
  /**
   * Validates an IDEF12 diagram according to organizational modeling rules.
   */
  public static validateDiagram(diagram: IDEF12Diagram): IDEF12ValidationIssue[] {
    const issues: IDEF12ValidationIssue[] = [];

    const elementIds = new Set<string>([
      ...diagram.orgUnits.map((u) => u.id),
      ...diagram.positions.map((p) => p.id),
      ...diagram.roles.map((r) => r.id),
      ...diagram.competencies.map((c) => c.id),
    ]);

    // 1. Dangling links check
    for (const link of diagram.links) {
      if (!elementIds.has(link.sourceId)) {
        issues.push({
          code: 'IDEF12_DANGLING_LINK_SOURCE',
          message: `Связь [${link.type}] ссылается на несуществующий исходный элемент "${link.sourceId}".`,
          severity: 'ERROR',
          elementId: link.id,
        });
      }
      if (!elementIds.has(link.targetId)) {
        issues.push({
          code: 'IDEF12_DANGLING_LINK_TARGET',
          message: `Связь [${link.type}] ссылается на несуществующий целевой элемент "${link.targetId}".`,
          severity: 'ERROR',
          elementId: link.id,
        });
      }
    }

    // 2. Duplicate codes check
    const unitCodes = new Map<string, string>();
    for (const unit of diagram.orgUnits) {
      if (unitCodes.has(unit.code)) {
        issues.push({
          code: 'IDEF12_DUPLICATE_UNIT_CODE',
          message: `Дубликат кода организационной единицы "${unit.code}": "${unit.name}" совпадает с другим подразделением.`,
          severity: 'ERROR',
          elementId: unit.id,
        });
      } else {
        unitCodes.set(unit.code, unit.id);
      }
    }

    const posCodes = new Map<string, string>();
    for (const pos of diagram.positions) {
      if (posCodes.has(pos.code)) {
        issues.push({
          code: 'IDEF12_DUPLICATE_POSITION_CODE',
          message: `Дубликат кода должности "${pos.code}": "${pos.name}".`,
          severity: 'ERROR',
          elementId: pos.id,
        });
      } else {
        posCodes.set(pos.code, pos.id);
      }
    }

    // 3. Subordination cycle detection (SUBORDINATE_TO)
    const subAdj = new Map<string, string[]>();
    for (const link of diagram.links) {
      if (link.type === OrgLinkType.SUBORDINATE_TO) {
        if (!subAdj.has(link.sourceId)) subAdj.set(link.sourceId, []);
        subAdj.get(link.sourceId)!.push(link.targetId);
      }
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const checkSubordinationCycle = (curr: string): boolean => {
      visited.add(curr);
      recStack.add(curr);

      const targets = subAdj.get(curr) || [];
      for (const target of targets) {
        if (!visited.has(target)) {
          if (checkSubordinationCycle(target)) return true;
        } else if (recStack.has(target)) {
          return true;
        }
      }

      recStack.delete(curr);
      return false;
    };

    for (const sourceId of subAdj.keys()) {
      if (!visited.has(sourceId)) {
        if (checkSubordinationCycle(sourceId)) {
          issues.push({
            code: 'IDEF12_SUBORDINATION_CYCLE',
            message: `Обнаружен цикл в иерархии административного подчинения! Иерархия управления обязана быть строгим деревом.`,
            severity: 'ERROR',
            elementId: sourceId,
          });
          break;
        }
      }
    }

    // 4. Orphan positions (positions not assigned to any OrgUnit via ASSIGNED_TO)
    const assignedPositionIds = new Set<string>();
    for (const link of diagram.links) {
      if (link.type === OrgLinkType.ASSIGNED_TO) {
        assignedPositionIds.add(link.sourceId);
      }
    }

    for (const pos of diagram.positions) {
      if (!assignedPositionIds.has(pos.id)) {
        issues.push({
          code: 'IDEF12_ORPHAN_POSITION',
          message: `Должность "${pos.name}" [${pos.code}] не привязана ни к одному подразделению (отсутствует связь ASSIGNED_TO).`,
          severity: 'WARNING',
          elementId: pos.id,
        });
      }
    }

    // 5. Unassigned critical roles (ACCOUNTABLE or AUDITOR roles with no PLAYS_ROLE link)
    const rolesWithAssignee = new Set<string>();
    for (const link of diagram.links) {
      if (link.type === OrgLinkType.PLAYS_ROLE) {
        rolesWithAssignee.add(link.targetId);
      }
    }

    for (const role of diagram.roles) {
      if (
        (role.roleType === OrgRoleType.ACCOUNTABLE || role.roleType === OrgRoleType.AUDITOR) &&
        !rolesWithAssignee.has(role.id)
      ) {
        issues.push({
          code: 'IDEF12_ROLE_WITHOUT_ASSIGNEE',
          message: `Критическая роль "${role.name}" [${role.roleType}] не назначена ни одной должности или подразделению (требуется связь PLAYS_ROLE).`,
          severity: 'WARNING',
          elementId: role.id,
        });
      }
    }

    return issues;
  }
}
