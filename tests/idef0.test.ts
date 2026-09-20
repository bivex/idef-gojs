import { describe, it, expect } from 'bun:test';
import { IDEF0Model } from '../src/idef0/domain/models/IDEF0Model';
import { IDEF0Diagram } from '../src/idef0/domain/models/IDEF0Diagram';
import { Activity } from '../src/idef0/domain/models/Activity';
import { Arrow } from '../src/idef0/domain/models/Arrow';
import { ICOMType, TunnelType } from '../src/idef0/domain/models/ICOMType';
import { IDEF0Rules } from '../src/idef0/domain/rules/IDEF0Rules';

describe('IDEF0 Functional Modeling (FIPS PUB 183)', () => {
  it('should initialize with Context Diagram A-0 having single activity A0', () => {
    const model = new IDEF0Model({
      id: 'model-1',
      name: 'Управление производством',
    });

    expect(model.diagrams.length).toBe(1);
    const active = model.activeDiagram;
    expect(active.nodeNumber).toBe('A-0');
    expect(active.activities.length).toBe(1);
    expect(active.activities[0].nodeNumber).toBe('A0');
    expect(active.activities[0].name).toBe('Управление производством');
  });

  it('should validate FIPS 183 rule: Context diagram A-0 requires exactly 1 box', () => {
    const model = new IDEF0Model({
      id: 'model-1',
      name: 'Test Context',
    });
    const issues = IDEF0Rules.validateDiagramBoxCount(model.activeDiagram);
    expect(issues.length).toBe(0);

    // Adding second box to A-0 triggers error
    model.activeDiagram.addActivity(
      new Activity({ id: 'act-2', name: 'Второй блок в контексте', nodeNumber: 'A0.2' })
    );
    const issuesAfter = IDEF0Rules.validateDiagramBoxCount(model.activeDiagram);
    expect(issuesAfter.length).toBe(1);
    expect(issuesAfter[0].severity).toBe('ERROR');
    expect(issuesAfter[0].code).toBe('FIPS183_CONTEXT_SINGLE_BOX');
  });

  it('should validate FIPS 183 rule: 3 to 6 boxes on decomposition diagram', () => {
    const decompDiag = new IDEF0Diagram({
      id: 'diag-a0',
      nodeNumber: 'A0',
      title: 'Декомпозиция A0',
    });

    // 2 boxes -> warning (< 3)
    decompDiag.addActivity(new Activity({ id: 'a1', name: 'Маркетинг', detailNumber: 1 }));
    decompDiag.addActivity(new Activity({ id: 'a2', name: 'Производство', detailNumber: 2 }));
    let issues = IDEF0Rules.validateDiagramBoxCount(decompDiag);
    expect(issues.some((i) => i.code === 'FIPS183_BOX_COUNT_RANGE')).toBe(true);

    // 3 boxes -> valid
    decompDiag.addActivity(new Activity({ id: 'a3', name: 'Сбыт', detailNumber: 3 }));
    issues = IDEF0Rules.validateDiagramBoxCount(decompDiag);
    expect(issues.length).toBe(0);

    // 7 boxes -> warning (> 6)
    decompDiag.addActivity(new Activity({ id: 'a4', name: 'Финансы', detailNumber: 4 }));
    decompDiag.addActivity(new Activity({ id: 'a5', name: 'Контроль', detailNumber: 5 }));
    decompDiag.addActivity(new Activity({ id: 'a6', name: 'Кадры', detailNumber: 6 }));
    decompDiag.addActivity(new Activity({ id: 'a7', name: 'Логистика', detailNumber: 7 }));
    issues = IDEF0Rules.validateDiagramBoxCount(decompDiag);
    expect(issues.some((i) => i.code === 'FIPS183_BOX_COUNT_RANGE')).toBe(true);
  });

  it('should enforce ICOM arrow semantics (Input, Control, Output, Mechanism, Call)', () => {
    const arrInput = new Arrow({
      id: 'arr-1',
      name: 'Сырье и материалы',
      targetActivityId: 'act-proc',
      icomType: ICOMType.INPUT,
    });
    expect(arrInput.isInput()).toBe(true);
    expect(arrInput.isControl()).toBe(false);

    const arrControl = new Arrow({
      id: 'arr-2',
      name: 'ГОСТ Р ИСО 9001',
      targetActivityId: 'act-proc',
      icomType: ICOMType.CONTROL,
    });
    expect(arrControl.isControl()).toBe(true);

    const arrOutput = new Arrow({
      id: 'arr-3',
      name: 'Готовое изделие',
      sourceActivityId: 'act-proc',
      icomType: ICOMType.OUTPUT,
    });
    expect(arrOutput.isOutput()).toBe(true);

    const arrMech = new Arrow({
      id: 'arr-4',
      name: 'Станочный парк и операторы',
      targetActivityId: 'act-proc',
      icomType: ICOMType.MECHANISM,
    });
    expect(arrMech.isMechanism()).toBe(true);
  });

  it('should support arrow tunneling (hidden in parent or child)', () => {
    const tunneledArrow = new Arrow({
      id: 'arr-tunnel',
      name: 'Внутренний протокол обмена',
      sourceActivityId: 'act-1',
      targetActivityId: 'act-2',
      icomType: ICOMType.CONTROL,
      tunnel: TunnelType.AT_TARGET,
    });

    expect(tunneledArrow.tunnel).toBe(TunnelType.AT_TARGET);
  });

  it('should support multi-level hierarchical drill-down and drill-up', () => {
    const model = new IDEF0Model({
      id: 'enterprise-model',
      name: 'Завод Точного Приборостроения',
    });

    const rootAct = model.activeDiagram.activities[0];

    // Decompose A0 into A1, A2, A3
    const childDiag = model.decomposeActivity(
      rootAct.id,
      {
        id: 'diag-a0',
        nodeNumber: 'A0',
        title: 'Основные процессы завода',
      },
      [
        new Activity({ id: 'act-a1', name: 'Проектирование изделий', nodeNumber: 'A1', detailNumber: 1 }),
        new Activity({ id: 'act-a2', name: 'Изготовление деталей', nodeNumber: 'A2', detailNumber: 2 }),
        new Activity({ id: 'act-a3', name: 'Сборка и регулировка', nodeNumber: 'A3', detailNumber: 3 }),
      ]
    );

    expect(model.diagrams.length).toBe(2);

    // Drill down
    const drilled = model.drillDown(rootAct.id);
    expect(drilled).toBeDefined();
    expect(model.activeDiagramId).toBe('diag-a0');
    expect(model.activeDiagram.activities.length).toBe(3);

    // Further decompose A2 into sub-processes A21, A22, A23
    const subDiag = model.decomposeActivity(
      'act-a2',
      {
        id: 'diag-a2',
        nodeNumber: 'A2',
        title: 'Изготовление деталей',
      },
      [
        new Activity({ id: 'act-a21', name: 'Механическая обработка', nodeNumber: 'A2.1', detailNumber: 1 }),
        new Activity({ id: 'act-a22', name: 'Термическая обработка', nodeNumber: 'A2.2', detailNumber: 2 }),
        new Activity({ id: 'act-a23', name: 'Гальваническое покрытие', nodeNumber: 'A2.3', detailNumber: 3 }),
      ]
    );

    expect(model.diagrams.length).toBe(3);

    // Drill down to A2
    model.drillDown('act-a2');
    expect(model.activeDiagramId).toBe('diag-a2');
    expect(model.activeDiagram.nodeNumber).toBe('A2');

    // Drill up back to A0
    const parent = model.drillUp();
    expect(parent).toBeDefined();
    expect(model.activeDiagramId).toBe('diag-a0');

    // Drill up back to A-0
    const grandParent = model.drillUp();
    expect(grandParent).toBeDefined();
    expect(model.activeDiagramId).toBe('diag-a-0');
  });

  it('should serialize and deserialize model hierarchy to/from JSON', () => {
    const model = new IDEF0Model({
      id: 'model-json',
      name: 'Авиационный завод',
    });

    const rootAct = model.activeDiagram.activities[0];
    model.decomposeActivity(
      rootAct.id,
      {
        id: 'diag-a0',
        nodeNumber: 'A0',
        title: 'Производственный цикл',
      },
      [
        new Activity({ id: 'act-1', name: 'Заготовительное производство', nodeNumber: 'A1', detailNumber: 1 }),
        new Activity({ id: 'act-2', name: 'Агрегатная сборка', nodeNumber: 'A2', detailNumber: 2 }),
      ]
    );

    const json = model.toJSON();
    const restored = IDEF0Model.fromJSON(json);

    expect(restored.id).toBe('model-json');
    expect(restored.name).toBe('Авиационный завод');
    expect(restored.diagrams.length).toBe(2);
    expect(restored.findDiagramByNodeNumber('A0')?.activities.length).toBe(2);
  });
});
