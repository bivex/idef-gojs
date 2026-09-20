import { IDEF6Diagram } from '../models/IDEF6Diagram';
import { RationaleLinkType } from '../models/IDEF6Link';

export interface IDEF6ValidationIssue {
  severity: 'ERROR' | 'WARNING';
  code: string;
  message: string;
  targetId?: string;
}

export class IDEF6Rules {
  /**
   * Validate entire IDEF6 Design Rationale diagram.
   */
  public static validateDiagram(diagram: IDEF6Diagram): IDEF6ValidationIssue[] {
    const issues: IDEF6ValidationIssue[] = [];

    // Collect all valid element IDs
    const elementIds = new Set<string>([
      ...diagram.issues.map((i) => i.id),
      ...diagram.alternatives.map((a) => a.id),
      ...diagram.criteria.map((c) => c.id),
      ...diagram.arguments.map((arg) => arg.id),
    ]);

    // 1. Dangling links check
    for (const link of diagram.links) {
      if (!elementIds.has(link.sourceId) || !elementIds.has(link.targetId)) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF6_DANGLING_LINK',
          message: `Связь обоснования "${link.id}" указывает на несуществующий элемент.`,
          targetId: link.id,
        });
      }
    }

    // 2. Duplicate names
    const issueNames = new Set<string>();
    for (const i of diagram.issues) {
      if (issueNames.has(i.name)) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF6_DUPLICATE_ISSUE_NAME',
          message: `Дублирующееся наименование проблемы/вопроса "${i.name}".`,
          targetId: i.id,
        });
      } else {
        issueNames.add(i.name);
      }
    }

    const altNames = new Set<string>();
    for (const a of diagram.alternatives) {
      if (altNames.has(a.name)) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF6_DUPLICATE_ALTERNATIVE_NAME',
          message: `Дублирующееся наименование альтернативы "${a.name}".`,
          targetId: a.id,
        });
      } else {
        altNames.add(a.name);
      }
    }

    // 3. Issue without Alternatives
    const addressedIssueIds = new Set<string>();
    for (const link of diagram.links) {
      if (
        link.type === RationaleLinkType.RESPONDS_TO ||
        link.type === RationaleLinkType.RESOLVES
      ) {
        addressedIssueIds.add(link.targetId);
      }
    }

    for (const issue of diagram.issues) {
      if (!addressedIssueIds.has(issue.id)) {
        issues.push({
          severity: 'WARNING',
          code: 'IDEF6_ISSUE_WITHOUT_ALTERNATIVES',
          message: `Для вопроса/проблемы "${issue.name}" не предложено ни одной альтернативы.`,
          targetId: issue.id,
        });
      }
    }

    // 4. Resolved Issue without Accepted Alternative
    for (const issue of diagram.issues) {
      if (issue.status === 'RESOLVED') {
        const resolvingLinks = diagram.links.filter(
          (l) =>
            l.targetId === issue.id &&
            (l.type === RationaleLinkType.RESOLVES || l.type === RationaleLinkType.RESPONDS_TO)
        );

        const hasAcceptedAlt = resolvingLinks.some((l) => {
          const alt = diagram.alternatives.find((a) => a.id === l.sourceId);
          return alt && alt.status === 'ACCEPTED';
        });

        if (!hasAcceptedAlt) {
          issues.push({
            severity: 'WARNING',
            code: 'IDEF6_RESOLVED_ISSUE_WITHOUT_ACCEPTED_ALTERNATIVE',
            message: `Вопрос "${issue.name}" помечен как RESOLVED (решён), но не содержит принятой альтернативы (ACCEPTED).`,
            targetId: issue.id,
          });
        }
      }
    }

    return issues;
  }
}
