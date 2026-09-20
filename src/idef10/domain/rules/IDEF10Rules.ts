import { IDEF10Diagram } from '../models/IDEF10Diagram';
import { ComponentType, ComponentLifecycle } from '../models/IDEF10Component';
import { ArchitectureLinkType } from '../models/IDEF10Link';

export interface IDEF10ValidationIssue {
  code: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
  elementId?: string;
}

export class IDEF10Rules {
  public static validate(diagram: IDEF10Diagram): IDEF10ValidationIssue[] {
    const issues: IDEF10ValidationIssue[] = [];

    // 1. Check for dangling links
    for (const link of diagram.links) {
      if (!diagram.hasElement(link.sourceId)) {
        issues.push({
          code: 'IDEF10_DANGLING_LINK_SOURCE',
          message: `Архитектурная связь ${link.id} ссылается на несуществующий компонент-источник "${link.sourceId}".`,
          severity: 'ERROR',
          elementId: link.id,
        });
      }
      if (!diagram.hasElement(link.targetId)) {
        issues.push({
          code: 'IDEF10_DANGLING_LINK_TARGET',
          message: `Архитектурная связь ${link.id} ссылается на несуществующую цель "${link.targetId}".`,
          severity: 'ERROR',
          elementId: link.id,
        });
      }
    }

    // 2. Duplicate component codes check
    const codes = new Set<string>();
    for (const c of diagram.components) {
      const upper = c.code.toUpperCase();
      if (codes.has(upper)) {
        issues.push({
          code: 'IDEF10_DUPLICATE_COMPONENT_CODE',
          message: `Обнаружено дублирование кода компонента реализации: "${c.code}". Коды компонентов должны быть уникальны.`,
          severity: 'ERROR',
          elementId: c.id,
        });
      }
      codes.add(upper);
    }

    // 3. Active service or database without deployment node
    for (const c of diagram.components) {
      if (
        (c.componentType === ComponentType.SERVICE || c.componentType === ComponentType.DATABASE) &&
        c.lifecycle === ComponentLifecycle.ACTIVE
      ) {
        const isDeployed = diagram.links.some(
          (l) => l.sourceId === c.id && l.type === ArchitectureLinkType.DEPLOYS_ON
        );
        if (!isDeployed) {
          issues.push({
            code: 'IDEF10_UNDEPLOYED_ACTIVE_COMPONENT',
            message: `Действующий компонент [${c.code}] "${c.name}" (${c.componentType}) не привязан ни к одному узлу исполнения/серверу (DEPLOYS_ON).`,
            severity: 'WARNING',
            elementId: c.id,
          });
        }
      }
    }

    // 4. Isolated component (no incoming or outgoing links)
    for (const c of diagram.components) {
      const hasLinks = diagram.links.some(
        (l) => l.sourceId === c.id || l.targetId === c.id
      );
      if (!hasLinks) {
        issues.push({
          code: 'IDEF10_ISOLATED_COMPONENT',
          message: `Компонент [${c.code}] "${c.name}" изолирован и не имеет связей взаимодействия, развертывания или интерфейсов.`,
          severity: 'WARNING',
          elementId: c.id,
        });
      }
    }

    // 5. Interface without provider component
    for (const intf of diagram.interfaces) {
      const hasProvider = diagram.links.some(
        (l) =>
          (l.sourceId === intf.id || l.targetId === intf.id) &&
          (l.type === ArchitectureLinkType.EXPOSES_INTERFACE || l.type === ArchitectureLinkType.CALLS)
      );
      if (!hasProvider) {
        issues.push({
          code: 'IDEF10_ORPHAN_INTERFACE',
          message: `Сетевой интерфейс "${intf.name}" (${intf.protocol}) не привязан ни к одному компоненту реализации (EXPOSES_INTERFACE).`,
          severity: 'WARNING',
          elementId: intf.id,
        });
      }
    }

    return issues;
  }
}
