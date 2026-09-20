import { IDEF0Diagram } from '../models/IDEF0Diagram';
import { Activity } from '../models/Activity';
import { ICOMType } from '../models/ICOMType';

export interface IDEF0ValidationIssue {
  severity: 'ERROR' | 'WARNING';
  code: string;
  message: string;
  targetId?: string;
}

export class IDEF0Rules {
  /**
   * FIPS PUB 183 Rule: 3 to 6 boxes per decomposition diagram.
   * Context diagram (A-0) is permitted to have exactly 1 box.
   */
  public static validateDiagramBoxCount(diagram: IDEF0Diagram): IDEF0ValidationIssue[] {
    const issues: IDEF0ValidationIssue[] = [];
    const count = diagram.activities.length;

    if (diagram.nodeNumber === 'A-0') {
      if (count !== 1) {
        issues.push({
          severity: 'ERROR',
          code: 'FIPS183_CONTEXT_SINGLE_BOX',
          message: `Context diagram (A-0) must have exactly 1 activity box, but has ${count}.`,
        });
      }
      return issues;
    }

    if (count < 3 || count > 6) {
      issues.push({
        severity: 'WARNING',
        code: 'FIPS183_BOX_COUNT_RANGE',
        message: `Diagram "${diagram.nodeNumber}" has ${count} boxes. FIPS PUB 183 recommends between 3 and 6 boxes per decomposition diagram.`,
      });
    }

    return issues;
  }

  /**
   * FIPS PUB 183 Rule: Each activity must have at least one Control arrow and at least one Output arrow.
   */
  public static validateActivityICOM(diagram: IDEF0Diagram, activity: Activity): IDEF0ValidationIssue[] {
    const issues: IDEF0ValidationIssue[] = [];
    const relatedArrows = diagram.arrows.filter(
      (a) => a.sourceActivityId === activity.id || a.targetActivityId === activity.id
    );

    const hasControl = relatedArrows.some(
      (a) => a.targetActivityId === activity.id && a.icomType === ICOMType.CONTROL
    );
    const hasOutput = relatedArrows.some(
      (a) => a.sourceActivityId === activity.id && a.icomType === ICOMType.OUTPUT
    );

    if (!hasControl) {
      issues.push({
        severity: 'WARNING',
        code: 'FIPS183_MISSING_CONTROL',
        message: `Activity "${activity.name}" (${activity.nodeNumber}) has no Control arrow. Under IDEF0, every function must be controlled.`,
        targetId: activity.id,
      });
    }

    if (!hasOutput) {
      issues.push({
        severity: 'WARNING',
        code: 'FIPS183_MISSING_OUTPUT',
        message: `Activity "${activity.name}" (${activity.nodeNumber}) has no Output arrow. Under IDEF0, every function must produce at least one output.`,
        targetId: activity.id,
      });
    }

    return issues;
  }

  /**
   * Validate full diagram according to FIPS PUB 183.
   */
  public static validateDiagram(diagram: IDEF0Diagram): IDEF0ValidationIssue[] {
    const issues: IDEF0ValidationIssue[] = [];

    // 1. Box count
    issues.push(...this.validateDiagramBoxCount(diagram));

    // 2. Activity checks
    for (const act of diagram.activities) {
      issues.push(...this.validateActivityICOM(diagram, act));
    }

    // 3. Arrow checks (must have noun labels)
    for (const arr of diagram.arrows) {
      if (!arr.name || arr.name.trim().length === 0) {
        issues.push({
          severity: 'ERROR',
          code: 'FIPS183_EMPTY_ARROW_LABEL',
          message: `Arrow "${arr.id}" has an empty label. IDEF0 requires descriptive noun phrases for all arrows.`,
          targetId: arr.id,
        });
      }
    }

    return issues;
  }
}
