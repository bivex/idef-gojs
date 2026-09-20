import { describe, it, expect } from 'bun:test';
import { IDEF3Model } from '../src/idef3/domain/models/IDEF3Model';
import { IDEF3Diagram } from '../src/idef3/domain/models/IDEF3Diagram';
import { UOB } from '../src/idef3/domain/models/UOB';
import { Junction } from '../src/idef3/domain/models/Junction';
import { Link, LinkType } from '../src/idef3/domain/models/Link';
import { Referent, ReferentType } from '../src/idef3/domain/models/Referent';
import { JunctionKind, SyncType, JunctionDirection } from '../src/idef3/domain/models/JunctionType';
import { IDEF3Rules } from '../src/idef3/domain/rules/IDEF3Rules';

describe('IDEF3 Process Description Capture Method (KBSI / IEEE)', () => {
  it('should initialize an IDEF3 model with default root scenario', () => {
    const model = new IDEF3Model({
      id: 'model-idef3',
      name: 'Сборка узла',
    });

    expect(model.diagrams.length).toBe(1);
    expect(model.activeDiagram.scenarioNumber).toBe('1');
    expect(model.activeDiagram.title).toBe('Сборка узла');
  });

  it('should create UOB with node number and UOB identifier', () => {
    const uob = new UOB({
      id: 'uob-1',
      name: 'Обработать торец заготовки',
      nodeNumber: '1',
      uobNumber: 'UOB-101',
    });

    expect(uob.name).toBe('Обработать торец заготовки');
    expect(uob.nodeNumber).toBe('1');
    expect(uob.uobNumber).toBe('UOB-101');
    expect(uob.hasDecomposition).toBe(false);
  });

  it('should create junctions with AND/OR/XOR and Sync/Async properties', () => {
    const jAnd = new Junction({
      id: 'j-1',
      kind: JunctionKind.AND,
      syncType: SyncType.SYNC,
      direction: JunctionDirection.FAN_OUT,
      junctionNumber: 'J1',
    });

    expect(jAnd.isAnd()).toBe(true);
    expect(jAnd.isSynchronous()).toBe(true);
    expect(jAnd.isFanOut()).toBe(true);

    const jXor = new Junction({
      id: 'j-2',
      kind: JunctionKind.XOR,
      direction: JunctionDirection.FAN_IN,
      junctionNumber: 'J2',
    });

    expect(jXor.isXor()).toBe(true);
    expect(jXor.isFanIn()).toBe(true);
  });

  it('should support link types: Precedence, Relational, Object Flow', () => {
    const pLink = new Link({ id: 'l1', sourceId: 'u1', targetId: 'u2', type: LinkType.PRECEDENCE });
    expect(pLink.type).toBe(LinkType.PRECEDENCE);

    const rLink = new Link({ id: 'l2', sourceId: 'u1', targetId: 'u3', type: LinkType.RELATIONAL, label: 'условие' });
    expect(rLink.type).toBe(LinkType.RELATIONAL);
    expect(rLink.label).toBe('условие');

    const oLink = new Link({ id: 'l3', sourceId: 'u2', targetId: 'u4', type: LinkType.OBJECT_FLOW });
    expect(oLink.type).toBe(LinkType.OBJECT_FLOW);
  });

  it('should support referents with various reference types', () => {
    const refState = new Referent({
      id: 'r1',
      name: 'Деталь: Очищена',
      type: ReferentType.OBJECT_STATE,
    });
    expect(refState.type).toBe(ReferentType.OBJECT_STATE);

    const refGoto = new Referent({
      id: 'r2',
      name: 'Переход к UOB 2',
      type: ReferentType.GOTO,
      locator: 'uob-2',
    });
    expect(refGoto.type).toBe(ReferentType.GOTO);
    expect(refGoto.locator).toBe('uob-2');
  });

  it('should validate junction fan-in and fan-out branching rules', () => {
    const diag = new IDEF3Diagram({ id: 'd1', scenarioNumber: '1', title: 'Тест' });
    const jOut = new Junction({
      id: 'j-out',
      kind: JunctionKind.AND,
      direction: JunctionDirection.FAN_OUT,
      junctionNumber: 'J1',
    });
    diag.addJunction(jOut);

    // Only 1 outgoing branch -> warning (must have >= 2)
    diag.addUOB(new UOB({ id: 'u1', name: 'Шаг 1' }));
    diag.addLink(new Link({ id: 'l1', sourceId: 'j-out', targetId: 'u1' }));

    let issues = IDEF3Rules.validateJunction(diag, jOut);
    expect(issues.some((i) => i.code === 'IDEF3_JUNCTION_FANOUT_DEGREE')).toBe(true);

    // Add second outgoing branch -> valid
    diag.addUOB(new UOB({ id: 'u2', name: 'Шаг 2' }));
    diag.addLink(new Link({ id: 'l2', sourceId: 'j-out', targetId: 'u2' }));

    issues = IDEF3Rules.validateJunction(diag, jOut);
    expect(issues.length).toBe(0);
  });

  it('should support multi-level scenario decomposition and navigation', () => {
    const model = new IDEF3Model({ id: 'model-proc', name: 'Сквозной техпроцесс' });
    const uobParent = new UOB({ id: 'uob-p', name: 'Комплексная термообработка' });
    model.activeDiagram.addUOB(uobParent);

    // Decompose into child scenario
    const childDiag = model.decomposeUOB(
      uobParent.id,
      {
        id: 'scen-sub',
        scenarioNumber: '1.1',
        title: 'Декомпозиция термообработки',
      },
      [
        new UOB({ id: 'u-sub-1', name: 'Нагрев' }),
        new UOB({ id: 'u-sub-2', name: 'Закалка' }),
      ]
    );

    expect(model.diagrams.length).toBe(2);
    expect(uobParent.hasDecomposition).toBe(true);

    // Drill down
    const drilled = model.drillDown(uobParent.id);
    expect(drilled).toBeDefined();
    expect(model.activeDiagramId).toBe('scen-sub');

    // Drill up
    const parent = model.drillUp();
    expect(parent).toBeDefined();
    expect(model.activeDiagramId).toBe('scenario-1');
  });

  it('should serialize and deserialize model to/from JSON without data loss', () => {
    const model = new IDEF3Model({ id: 'm-json', name: 'JSON IDEF3' });
    model.activeDiagram.addUOB(new UOB({ id: 'u1', name: 'Операция 1' }));
    model.activeDiagram.addJunction(new Junction({ id: 'j1', kind: JunctionKind.XOR }));

    const json = model.toJSON();
    const restored = IDEF3Model.fromJSON(json);

    expect(restored.id).toBe('m-json');
    expect(restored.activeDiagram.uobs.length).toBe(1);
    expect(restored.activeDiagram.junctions.length).toBe(1);
  });
});
