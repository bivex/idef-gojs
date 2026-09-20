import { IDEF8Diagram } from '../models/IDEF8Diagram';
import { ScreenType } from '../models/IDEF8Screen';
import { InteractionLinkType } from '../models/IDEF8Link';

export interface IDEF8ValidationIssue {
  code: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
  elementId?: string;
}

export class IDEF8Rules {
  public static validate(diagram: IDEF8Diagram): IDEF8ValidationIssue[] {
    const issues: IDEF8ValidationIssue[] = [];

    // 1. Check for dangling links
    for (const link of diagram.links) {
      if (!diagram.hasElement(link.sourceId)) {
        issues.push({
          code: 'IDEF8_DANGLING_LINK_SOURCE',
          message: `Связь ${link.id} указывает на несуществующий источник "${link.sourceId}".`,
          severity: 'ERROR',
          elementId: link.id,
        });
      }
      if (!diagram.hasElement(link.targetId)) {
        issues.push({
          code: 'IDEF8_DANGLING_LINK_TARGET',
          message: `Связь ${link.id} указывает на несуществующий целевой элемент "${link.targetId}".`,
          severity: 'ERROR',
          elementId: link.id,
        });
      }
    }

    // 2. Duplicate screen names check
    const screenNames = new Set<string>();
    for (const s of diagram.screens) {
      const lower = s.name.toLowerCase();
      if (screenNames.has(lower)) {
        issues.push({
          code: 'IDEF8_DUPLICATE_SCREEN_NAME',
          message: `Обнаружено дублирование имени экрана: "${s.name}".`,
          severity: 'WARNING',
          elementId: s.id,
        });
      }
      screenNames.add(lower);
    }

    // 3. Modal screen trap check (must have at least one exit/return link)
    for (const s of diagram.screens) {
      if (s.screenType === ScreenType.MODAL_DIALOG) {
        const hasExit = diagram.links.some(
          (l) =>
            l.sourceId === s.id &&
            (l.type === InteractionLinkType.RETURNS_TO || l.type === InteractionLinkType.NAVIGATES_TO)
        );
        if (!hasExit) {
          issues.push({
            code: 'IDEF8_MODAL_WITHOUT_RETURN',
            message: `Модальный экран "${s.name}" не имеет обратной связи закрытия/возврата (RETURNS_TO/NAVIGATES_TO). Пользователь может оказаться заблокирован.`,
            severity: 'WARNING',
            elementId: s.id,
          });
        }
      }
    }

    // 4. User actions without reaction (neither triggers system response nor navigates)
    for (const a of diagram.userActions) {
      const hasOutcome = diagram.links.some(
        (l) =>
          l.sourceId === a.id &&
          (l.type === InteractionLinkType.TRIGGERS ||
            l.type === InteractionLinkType.NAVIGATES_TO ||
            l.type === InteractionLinkType.OPENS_MODAL)
      );
      if (!hasOutcome) {
        issues.push({
          code: 'IDEF8_UNHANDLED_USER_ACTION',
          message: `Действие пользователя "${a.name}" не вызывает никакой реакции системы или перехода (отсутствует TRIGGERS / NAVIGATES_TO).`,
          severity: 'WARNING',
          elementId: a.id,
        });
      }
    }

    return issues;
  }
}
