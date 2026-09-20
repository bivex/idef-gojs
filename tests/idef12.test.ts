import { describe, it, expect } from 'bun:test';
import {
  IDEF12OrgUnit,
  OrgUnitType,
} from '../src/idef12/domain/models/IDEF12OrgUnit';
import {
  IDEF12Position,
  PositionLevel,
} from '../src/idef12/domain/models/IDEF12Position';
import {
  IDEF12OrgRole,
  OrgRoleType,
} from '../src/idef12/domain/models/IDEF12OrgRole';
import {
  IDEF12Competency,
  CompetencyCriticality,
} from '../src/idef12/domain/models/IDEF12Competency';
import {
  IDEF12Link,
  OrgLinkType,
} from '../src/idef12/domain/models/IDEF12Link';
import { IDEF12Diagram } from '../src/idef12/domain/models/IDEF12Diagram';
import { IDEF12Model } from '../src/idef12/domain/models/IDEF12Model';
import { IDEF12Rules } from '../src/idef12/domain/rules/IDEF12Rules';
import { IDEF12Editor } from '../src/idef12/infrastructure/adapters/inbound/IDEF12Editor';

describe('IDEF12 Organization Modeling Method (KBSI / US Air Force)', () => {
  it('should create OrgUnit, Position, OrgRole, and Competency with domain properties', () => {
    const unit = new IDEF12OrgUnit({
      id: 'ou-1',
      code: 'OU-DIR-PROD',
      name: 'Дирекция по производству',
      unitType: OrgUnitType.DIVISION,
      headPositionName: 'Директор по производству',
      headCount: 450,
      location: 'Заводоуправление, корпус А',
      x: 100,
      y: 100,
    });

    expect(unit.id).toBe('ou-1');
    expect(unit.code).toBe('OU-DIR-PROD');
    expect(unit.unitType).toBe(OrgUnitType.DIVISION);
    expect(unit.headCount).toBe(450);

    const pos = new IDEF12Position({
      id: 'pos-1',
      code: 'POS-CHIEF-MET',
      name: 'Главный металлург завода',
      positionLevel: PositionLevel.EXECUTIVE,
      grade: 'Грейд 15',
      responsibilities: ['Утверждение карт термообработки', 'Контроль плавок жаропрочных сплавов'],
    });

    expect(pos.code).toBe('POS-CHIEF-MET');
    expect(pos.positionLevel).toBe(PositionLevel.EXECUTIVE);
    expect(pos.responsibilities.length).toBe(2);

    const role = new IDEF12OrgRole({
      id: 'role-1',
      code: 'ROLE-PROC-OWNER',
      name: 'Владелец сквозного процесса термообработки',
      roleType: OrgRoleType.ACCOUNTABLE,
      scope: 'Металлургическое производство лопаток ГТД',
    });

    expect(role.roleType).toBe(OrgRoleType.ACCOUNTABLE);

    const comp = new IDEF12Competency({
      id: 'comp-1',
      code: 'COMP-RTN-B2',
      name: 'Аттестация Ростехнадзора Б.2 (металлургическая промышленность)',
      criticality: CompetencyCriticality.MANDATORY_LEGAL,
      certificationBody: 'Ростехнадзор',
      validityMonths: 60,
    });

    expect(comp.criticality).toBe(CompetencyCriticality.MANDATORY_LEGAL);
    expect(comp.validityMonths).toBe(60);
  });

  it('should manage organizational links and remove dangling links on entity removal', () => {
    const diag = new IDEF12Diagram({
      id: 'diag-test',
      name: 'Test Org Diagram',
    });

    const uDir = new IDEF12OrgUnit({ code: 'DIR', name: 'Дирекция' });
    const uShop = new IDEF12OrgUnit({ code: 'SHOP', name: 'Цех' });
    const pos = new IDEF12Position({ code: 'HEAD', name: 'Начальник цеха' });

    diag.addOrgUnit(uDir);
    diag.addOrgUnit(uShop);
    diag.addPosition(pos);

    const subLink = new IDEF12Link({
      sourceId: uShop.id,
      targetId: uDir.id,
      type: OrgLinkType.SUBORDINATE_TO,
    });

    const assignLink = new IDEF12Link({
      sourceId: pos.id,
      targetId: uShop.id,
      type: OrgLinkType.ASSIGNED_TO,
    });

    diag.addLink(subLink);
    diag.addLink(assignLink);

    expect(diag.links.length).toBe(2);

    // Removing uShop should clean up both subLink and assignLink
    diag.removeOrgUnit(uShop.id);
    expect(diag.orgUnits.length).toBe(1);
    expect(diag.links.length).toBe(0);
  });

  it('should detect cycles in administrative subordination (SUBORDINATE_TO)', () => {
    const diag = new IDEF12Diagram({ id: 'diag-sub', name: 'Subordination Hierarchy' });

    const u1 = new IDEF12OrgUnit({ code: 'OU-1', name: 'Подразделение 1' });
    const u2 = new IDEF12OrgUnit({ code: 'OU-2', name: 'Подразделение 2' });
    const u3 = new IDEF12OrgUnit({ code: 'OU-3', name: 'Подразделение 3' });

    diag.addOrgUnit(u1);
    diag.addOrgUnit(u2);
    diag.addOrgUnit(u3);

    diag.addLink(new IDEF12Link({ sourceId: u1.id, targetId: u2.id, type: OrgLinkType.SUBORDINATE_TO }));
    diag.addLink(new IDEF12Link({ sourceId: u2.id, targetId: u3.id, type: OrgLinkType.SUBORDINATE_TO }));
    // Cycle: 3 -> 1
    diag.addLink(new IDEF12Link({ sourceId: u3.id, targetId: u1.id, type: OrgLinkType.SUBORDINATE_TO }));

    const issues = IDEF12Rules.validateDiagram(diag);
    const cycleIssue = issues.find((i) => i.code === 'IDEF12_SUBORDINATION_CYCLE');
    expect(cycleIssue).toBeDefined();
    expect(cycleIssue?.severity).toBe('ERROR');
  });

  it('should detect orphan positions and unassigned critical roles', () => {
    const diag = new IDEF12Diagram({ id: 'diag-warn', name: 'Validation Warning Check' });

    const pos = new IDEF12Position({ code: 'ORPHAN', name: 'Одинокая должность без цеха' });
    const role = new IDEF12OrgRole({
      code: 'AUDIT',
      name: 'Ведущий аудитор систем менеджмента качества',
      roleType: OrgRoleType.AUDITOR,
    });

    diag.addPosition(pos);
    diag.addRole(role);

    const issues = IDEF12Rules.validateDiagram(diag);

    const orphanPos = issues.find((i) => i.code === 'IDEF12_ORPHAN_POSITION');
    expect(orphanPos).toBeDefined();

    const unassignedRole = issues.find((i) => i.code === 'IDEF12_ROLE_WITHOUT_ASSIGNEE');
    expect(unassignedRole).toBeDefined();
  });

  it('should serialize and deserialize model to/from JSON without data loss', () => {
    const model = new IDEF12Model({
      id: 'avia-org-model',
      name: 'Оргструктура ОАО «Металл-Авиа»',
      version: '1.2.0',
    });

    const diag = model.activeDiagram;
    const u = new IDEF12OrgUnit({ code: 'SHOP-3', name: 'Цех №3', unitType: OrgUnitType.WORKSHOP });
    const p = new IDEF12Position({ code: 'MSTR-1', name: 'Мастер смены', positionLevel: PositionLevel.MANAGEMENT });
    const r = new IDEF12OrgRole({ code: 'SAFE', name: 'Ответственный по ТБ', roleType: OrgRoleType.ACCOUNTABLE });
    const c = new IDEF12Competency({ code: 'ELEC', name: 'Группа допуска по электробезопасности IV' });

    diag.addOrgUnit(u);
    diag.addPosition(p);
    diag.addRole(r);
    diag.addCompetency(c);

    diag.addLink(new IDEF12Link({ sourceId: p.id, targetId: u.id, type: OrgLinkType.ASSIGNED_TO }));
    diag.addLink(new IDEF12Link({ sourceId: p.id, targetId: r.id, type: OrgLinkType.PLAYS_ROLE }));
    diag.addLink(new IDEF12Link({ sourceId: p.id, targetId: c.id, type: OrgLinkType.REQUIRES_COMPETENCY }));

    const json = JSON.stringify(model.toJSON());
    const restored = IDEF12Model.fromJSON(JSON.parse(json));

    expect(restored.id).toBe('avia-org-model');
    expect(restored.name).toBe('Оргструктура ОАО «Металл-Авиа»');
    expect(restored.activeDiagram.orgUnits.length).toBe(1);
    expect(restored.activeDiagram.positions.length).toBe(1);
    expect(restored.activeDiagram.roles.length).toBe(1);
    expect(restored.activeDiagram.competencies.length).toBe(1);
    expect(restored.activeDiagram.links.length).toBe(3);
  });

  it('should manage organization elements via IDEF12Editor facade', () => {
    const editor = new IDEF12Editor();
    editor.createModel('metal-avia-org', 'ОАО «Металл-Авиа» Оргструктура');

    const dir = editor.addOrgUnit({
      code: 'DIR-DEV',
      name: 'Дирекция по перспективному развитию',
      unitType: OrgUnitType.DIVISION,
    });

    const chief = editor.addPosition({
      code: 'DIR-POS',
      name: 'Директор по развитию',
      positionLevel: PositionLevel.EXECUTIVE,
    });

    editor.addLink({
      sourceId: chief.id,
      targetId: dir.id,
      type: OrgLinkType.ASSIGNED_TO,
    });

    const diag = editor.getActiveDiagram();
    expect(diag.orgUnits.length).toBe(1);
    expect(diag.positions.length).toBe(1);
    expect(diag.links.length).toBe(1);

    const issues = editor.validate();
    expect(issues.filter((i) => i.severity === 'ERROR').length).toBe(0);
  });
});
