import { describe, it, expect } from 'bun:test';
import { IDEF6Model } from '../src/idef6/domain/models/IDEF6Model';
import { IDEF6Issue } from '../src/idef6/domain/models/IDEF6Issue';
import { IDEF6Alternative } from '../src/idef6/domain/models/IDEF6Alternative';
import { IDEF6Criterion } from '../src/idef6/domain/models/IDEF6Criterion';
import { IDEF6Argument } from '../src/idef6/domain/models/IDEF6Argument';
import { IDEF6Link, RationaleLinkType } from '../src/idef6/domain/models/IDEF6Link';
import { IDEF6Rules } from '../src/idef6/domain/rules/IDEF6Rules';
import { IDEF6Editor } from '../src/idef6/infrastructure/adapters/inbound/IDEF6Editor';

describe('IDEF6 Design Rationale Capture Method (KBSI / Air Force / IICE)', () => {
  it('should create Issues, Alternatives, Criteria, and Arguments with properties', () => {
    const issue = new IDEF6Issue({
      id: 'iss-1',
      name: 'DBMS Selection for Telemetry',
      status: 'RESOLVED',
      priority: 'HIGH',
    });

    const alt1 = new IDEF6Alternative({
      id: 'alt-1',
      name: 'TimescaleDB',
      status: 'ACCEPTED',
    });

    const crit1 = new IDEF6Criterion({
      id: 'crt-1',
      name: 'Query Latency < 50ms',
      type: 'CONSTRAINT',
      weight: 'CRITICAL',
    });

    const argPro = new IDEF6Argument({
      id: 'arg-1',
      name: 'Native SQL and relational joins with MES',
      type: 'PRO',
      strength: 'STRONG',
    });

    expect(issue.name).toBe('DBMS Selection for Telemetry');
    expect(issue.isResolved()).toBe(true);
    expect(alt1.isAccepted()).toBe(true);
    expect(crit1.type).toBe('CONSTRAINT');
    expect(argPro.isPro()).toBe(true);
  });

  it('should validate relationships between rationale elements', () => {
    const linkResponds = new IDEF6Link({
      id: 'l-1',
      sourceId: 'alt-1',
      targetId: 'iss-1',
      type: RationaleLinkType.RESPONDS_TO,
    });
    expect(linkResponds.type).toBe(RationaleLinkType.RESPONDS_TO);

    const linkSupport = new IDEF6Link({
      id: 'l-2',
      sourceId: 'arg-1',
      targetId: 'alt-1',
      type: RationaleLinkType.SUPPORTS,
    });
    expect(linkSupport.isSupport()).toBe(true);

    const linkObject = new IDEF6Link({
      id: 'l-3',
      sourceId: 'arg-2',
      targetId: 'alt-1',
      type: RationaleLinkType.OBJECTS_TO,
    });
    expect(linkObject.isObject()).toBe(true);
  });

  it('should detect dangling links and duplicate element names', () => {
    const model = new IDEF6Model({ id: 'm-val', name: 'Validation Model' });
    const diag = model.activeDiagram;

    diag.addIssue(new IDEF6Issue({ id: 'i1', name: 'Duplicate Issue' }));
    diag.addIssue(new IDEF6Issue({ id: 'i2', name: 'Duplicate Issue' })); // Duplicate name!

    diag.addLink(
      new IDEF6Link({
        id: 'l-dangling',
        sourceId: 'non-existent-source',
        targetId: 'i1',
        type: RationaleLinkType.RESPONDS_TO,
      })
    );

    const issues = IDEF6Rules.validateDiagram(diag);
    expect(issues.some((i) => i.code === 'IDEF6_DUPLICATE_ISSUE_NAME')).toBe(true);
    expect(issues.some((i) => i.code === 'IDEF6_DANGLING_LINK')).toBe(true);
  });

  it('should detect resolved issues without an accepted alternative', () => {
    const model = new IDEF6Model({ id: 'm-res', name: 'Resolution Check' });
    const diag = model.activeDiagram;

    const issue = new IDEF6Issue({ id: 'iss-open', name: 'Cache Layer', status: 'RESOLVED' });
    const alt = new IDEF6Alternative({ id: 'alt-redis', name: 'Redis', status: 'PROPOSED' }); // Not ACCEPTED

    diag.addIssue(issue);
    diag.addAlternative(alt);
    diag.addLink(
      new IDEF6Link({
        id: 'l-resp',
        sourceId: alt.id,
        targetId: issue.id,
        type: RationaleLinkType.RESPONDS_TO,
      })
    );

    const issues = IDEF6Rules.validateDiagram(diag);
    expect(issues.some((i) => i.code === 'IDEF6_RESOLVED_ISSUE_WITHOUT_ACCEPTED_ALTERNATIVE')).toBe(true);
  });

  it('should serialize and deserialize model to/from JSON', () => {
    const model = new IDEF6Model({ id: 'm-json', name: 'Architecture Decisions' });
    const issue = new IDEF6Issue({ id: 'iss-json', name: 'Protocol' });
    model.activeDiagram.addIssue(issue);

    const json = model.toJSON();
    const restored = IDEF6Model.fromJSON(json);

    expect(restored.id).toBe('m-json');
    expect(restored.activeDiagram.issues.length).toBe(1);
    expect(restored.activeDiagram.issues[0].name).toBe('Protocol');
  });

  it('should manage elements and links via IDEF6Editor facade', () => {
    const editor = new IDEF6Editor();
    editor.createModel('m-facade', 'Facade Rationale Model');

    const iss = editor.addIssue({ name: 'Message Broker Choice', status: 'RESOLVED' });
    const alt = editor.addAlternative({ name: 'Apache Kafka', status: 'ACCEPTED' });
    const arg = editor.addArgument({ name: 'High throughput', type: 'PRO' });
    const crit = editor.addCriterion({ name: '100k msg/sec', type: 'CONSTRAINT' });

    editor.addLink({ sourceId: alt.id, targetId: iss.id, type: RationaleLinkType.RESOLVES });
    editor.addLink({ sourceId: arg.id, targetId: alt.id, type: RationaleLinkType.SUPPORTS });
    editor.addLink({ sourceId: alt.id, targetId: crit.id, type: RationaleLinkType.EVALUATES });

    const diag = editor.getActiveDiagram();
    expect(diag.issues.length).toBe(1);
    expect(diag.alternatives.length).toBe(1);
    expect(diag.arguments.length).toBe(1);
    expect(diag.criteria.length).toBe(1);
    expect(diag.links.length).toBe(3);

    const json = editor.exportJSON();
    expect(json).toContain('Message Broker Choice');
    expect(json).toContain('Apache Kafka');
  });
});
