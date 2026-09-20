import { IDEF3Diagram } from '../models/IDEF3Diagram';
import { Junction } from '../models/Junction';
import { UOB } from '../models/UOB';

export interface IDEF3ValidationIssue {
  severity: 'ERROR' | 'WARNING';
  code: string;
  message: string;
  targetId?: string;
}

export class IDEF3Rules {
  /**
   * Validate junction fan-in and fan-out constraints according to KBSI IDEF3 Standard.
   */
  public static validateJunction(diagram: IDEF3Diagram, junction: Junction): IDEF3ValidationIssue[] {
    const issues: IDEF3ValidationIssue[] = [];
    const inLinks = diagram.links.filter((l) => l.targetId === junction.id);
    const outLinks = diagram.links.filter((l) => l.sourceId === junction.id);

    if (junction.isFanOut()) {
      if (outLinks.length < 2) {
        issues.push({
          severity: 'WARNING',
          code: 'IDEF3_JUNCTION_FANOUT_DEGREE',
          message: `Разветвляющий перекресток (Fan-Out) "${junction.junctionNumber}" должен иметь минимум 2 исходящие ветви (сейчас: ${outLinks.length}).`,
          targetId: junction.id,
        });
      }
    } else if (junction.isFanIn()) {
      if (inLinks.length < 2) {
        issues.push({
          severity: 'WARNING',
          code: 'IDEF3_JUNCTION_FANIN_DEGREE',
          message: `Сливающий перекресток (Fan-In) "${junction.junctionNumber}" должен иметь минимум 2 входящие ветви (сейчас: ${inLinks.length}).`,
          targetId: junction.id,
        });
      }
    }

    return issues;
  }

  /**
   * Check for isolated/dangling UOBs in scenario.
   */
  public static validateUOBConnectivity(diagram: IDEF3Diagram, uob: UOB): IDEF3ValidationIssue[] {
    const issues: IDEF3ValidationIssue[] = [];
    const connected = diagram.links.some((l) => l.sourceId === uob.id || l.targetId === uob.id);

    if (!connected && diagram.uobs.length > 1) {
      issues.push({
        severity: 'WARNING',
        code: 'IDEF3_UOB_ISOLATED',
        message: `Действие (UOB) "${uob.name}" не связано ни с одним предшествующим или последующим шагом процесса.`,
        targetId: uob.id,
      });
    }

    return issues;
  }

  /**
   * Validate entire IDEF3 scenario.
   */
  public static validateDiagram(diagram: IDEF3Diagram): IDEF3ValidationIssue[] {
    const issues: IDEF3ValidationIssue[] = [];

    for (const j of diagram.junctions) {
      issues.push(...this.validateJunction(diagram, j));
    }

    for (const u of diagram.uobs) {
      issues.push(...this.validateUOBConnectivity(diagram, u));
      if (!u.name || u.name.trim().length === 0) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF3_EMPTY_UOB_NAME',
          message: `Действие ${u.id} имеет пустое наименование.`,
          targetId: u.id,
        });
      }
    }

    // Check links
    const validIds = new Set<string>([
      ...diagram.uobs.map((u) => u.id),
      ...diagram.junctions.map((j) => j.id),
      ...diagram.referents.map((r) => r.id),
    ]);

    for (const l of diagram.links) {
      if (!validIds.has(l.sourceId) || !validIds.has(l.targetId)) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF3_DANGLING_LINK',
          message: `Связь "${l.id}" ссылается на несуществующий элемент.`,
          targetId: l.id,
        });
      }
      if (l.sourceId === l.targetId) {
        issues.push({
          severity: 'ERROR',
          code: 'IDEF3_SELF_LOOP',
          message: `Связь "${l.id}" ссылается сама на себя. В IDEF3 циклы должны оформляться через Referent (GOTO).`,
          targetId: l.id,
        });
      }
    }

    return issues;
  }
}
