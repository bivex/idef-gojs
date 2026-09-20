import { IDEF3Model } from '../src/idef3/domain/models/IDEF3Model';
import { IDEF3Diagram } from '../src/idef3/domain/models/IDEF3Diagram';
import { UOB } from '../src/idef3/domain/models/UOB';
import { Junction } from '../src/idef3/domain/models/Junction';
import { Link, LinkType } from '../src/idef3/domain/models/Link';
import { Referent, ReferentType } from '../src/idef3/domain/models/Referent';
import { JunctionKind, SyncType, JunctionDirection } from '../src/idef3/domain/models/JunctionType';
import { Position } from '../src/domain/models/Position';

export function createRussianEnterpriseIDEF3Model(): IDEF3Model {
  // Scenario 1: Основной технологический процесс
  const mainScenario = new IDEF3Diagram({
    id: 'scenario-main',
    scenarioNumber: '1',
    title: 'Техпроцесс изготовления и сборки редуктора (IDEF3)',
  });

  // Referent: Стартовое состояние заготовки
  const refStart = new Referent({
    id: 'ref-start',
    name: 'Заготовка: поковка сталь 40ХН2МА',
    type: ReferentType.OBJECT_STATE,
    position: new Position(40, 180),
  });
  mainScenario.addReferent(refStart);

  // UOB 1: Входной контроль
  const uob1 = new UOB({
    id: 'uob-1',
    name: 'Провести входной спектральный контроль сырья',
    nodeNumber: '1',
    uobNumber: 'UOB-1',
    position: new Position(220, 180),
  });
  mainScenario.addUOB(uob1);

  // UOB 2: Раскрой
  const uob2 = new UOB({
    id: 'uob-2',
    name: 'Раскроить прокат на ленточнопильном станке',
    nodeNumber: '2',
    uobNumber: 'UOB-2',
    position: new Position(440, 180),
  });
  mainScenario.addUOB(uob2);

  // Junction J1: Параллельное изготовление шестерни и корпуса (AND Fan-Out Synchronous)
  const j1 = new Junction({
    id: 'j-1',
    kind: JunctionKind.AND,
    syncType: SyncType.SYNC,
    direction: JunctionDirection.FAN_OUT,
    junctionNumber: 'J1',
    position: new Position(640, 180),
  });
  mainScenario.addJunction(j1);

  // Верхняя ветка (Вал-шестерня)
  const uob3 = new UOB({
    id: 'uob-3',
    name: 'Токарная ЧПУ обработка вала-шестерни',
    nodeNumber: '3',
    uobNumber: 'UOB-3',
    position: new Position(760, 80),
  });
  const uob4 = new UOB({
    id: 'uob-4',
    name: 'Нарезать зубья на зубофрезерном станке',
    nodeNumber: '4',
    uobNumber: 'UOB-4',
    position: new Position(980, 80),
  });
  mainScenario.addUOB(uob3);
  mainScenario.addUOB(uob4);

  // Нижняя ветка (Корпус редуктора)
  const uob5 = new UOB({
    id: 'uob-5',
    name: 'Фрезеровать корпус на 5-осевом ОЦ',
    nodeNumber: '5',
    uobNumber: 'UOB-5',
    position: new Position(760, 280),
  });
  const uob6 = new UOB({
    id: 'uob-6',
    name: 'Сверлить и нарезать резьбовые отверстия',
    nodeNumber: '6',
    uobNumber: 'UOB-6',
    position: new Position(980, 280),
  });
  mainScenario.addUOB(uob5);
  mainScenario.addUOB(uob6);

  // Junction J2: Слияние параллельных веток (AND Fan-In)
  const j2 = new Junction({
    id: 'j-2',
    kind: JunctionKind.AND,
    syncType: SyncType.SYNC,
    direction: JunctionDirection.FAN_IN,
    junctionNumber: 'J2',
    position: new Position(1180, 180),
  });
  mainScenario.addJunction(j2);

  // UOB 7: Термообработка (с декомпозицией!)
  const uob7 = new UOB({
    id: 'uob-7',
    name: 'Термическая закалка ТВЧ и отпуск деталей',
    nodeNumber: '7',
    uobNumber: 'UOB-7',
    hasDecomposition: true,
    dNumber: '1.7',
    position: new Position(1300, 180),
  });
  mainScenario.addUOB(uob7);

  // UOB 8: Контроль качества ОТК
  const uob8 = new UOB({
    id: 'uob-8',
    name: 'Провести ультразвуковой и геом. контроль ОТК',
    nodeNumber: '8',
    uobNumber: 'UOB-8',
    position: new Position(1520, 180),
  });
  mainScenario.addUOB(uob8);

  // Junction J3: Исключающее ветвление (XOR Fan-Out) - Годно / Брак
  const j3 = new Junction({
    id: 'j-3',
    kind: JunctionKind.XOR,
    syncType: SyncType.ASYNC,
    direction: JunctionDirection.FAN_OUT,
    junctionNumber: 'J3',
    position: new Position(1720, 180),
  });
  mainScenario.addJunction(j3);

  // Ветка брака / доработки (GOTO)
  const refGoto = new Referent({
    id: 'ref-goto',
    name: 'Возврат на повторный отпуск (UOB 7)',
    type: ReferentType.GOTO,
    locator: 'uob-7',
    position: new Position(1860, 80),
  });
  mainScenario.addReferent(refGoto);

  // Ветка годных деталей -> Сборка
  const uob9 = new UOB({
    id: 'uob-9',
    name: 'Запрессовать подшипники и собрать редуктор',
    nodeNumber: '9',
    uobNumber: 'UOB-9',
    position: new Position(1860, 280),
  });
  mainScenario.addUOB(uob9);

  // UOB 10: Стендовые испытания
  const uob10 = new UOB({
    id: 'uob-10',
    name: 'Провести вибро-акустические испытания редуктора',
    nodeNumber: '10',
    uobNumber: 'UOB-10',
    position: new Position(2080, 280),
  });
  mainScenario.addUOB(uob10);

  // Финальный референт
  const refEnd = new Referent({
    id: 'ref-end',
    name: 'Изделие: Редуктор принят ВП и упакован',
    type: ReferentType.OBJECT_STATE,
    position: new Position(2300, 280),
  });
  mainScenario.addReferent(refEnd);

  // Links
  mainScenario.addLink(new Link({ id: 'l-0', sourceId: 'ref-start', targetId: 'uob-1', type: LinkType.OBJECT_FLOW }));
  mainScenario.addLink(new Link({ id: 'l-1', sourceId: 'uob-1', targetId: 'uob-2', type: LinkType.PRECEDENCE }));
  mainScenario.addLink(new Link({ id: 'l-2', sourceId: 'uob-2', targetId: 'j-1', type: LinkType.PRECEDENCE }));

  // From J1 to branches
  mainScenario.addLink(new Link({ id: 'l-3', sourceId: 'j-1', targetId: 'uob-3', type: LinkType.PRECEDENCE, label: 'Шестерня' }));
  mainScenario.addLink(new Link({ id: 'l-4', sourceId: 'uob-3', targetId: 'uob-4', type: LinkType.PRECEDENCE }));
  mainScenario.addLink(new Link({ id: 'l-5', sourceId: 'uob-4', targetId: 'j-2', type: LinkType.PRECEDENCE }));

  mainScenario.addLink(new Link({ id: 'l-6', sourceId: 'j-1', targetId: 'uob-5', type: LinkType.PRECEDENCE, label: 'Корпус' }));
  mainScenario.addLink(new Link({ id: 'l-7', sourceId: 'uob-5', targetId: 'uob-6', type: LinkType.PRECEDENCE }));
  mainScenario.addLink(new Link({ id: 'l-8', sourceId: 'uob-6', targetId: 'j-2', type: LinkType.PRECEDENCE }));

  // Converge to J2 -> UOB 7 -> UOB 8 -> J3
  mainScenario.addLink(new Link({ id: 'l-9', sourceId: 'j-2', targetId: 'uob-7', type: LinkType.PRECEDENCE }));
  mainScenario.addLink(new Link({ id: 'l-10', sourceId: 'uob-7', targetId: 'uob-8', type: LinkType.OBJECT_FLOW }));
  mainScenario.addLink(new Link({ id: 'l-11', sourceId: 'uob-8', targetId: 'j-3', type: LinkType.PRECEDENCE }));

  // XOR outcomes
  mainScenario.addLink(new Link({ id: 'l-12', sourceId: 'j-3', targetId: 'ref-goto', type: LinkType.RELATIONAL, label: 'Брак твердости' }));
  mainScenario.addLink(new Link({ id: 'l-13', sourceId: 'j-3', targetId: 'uob-9', type: LinkType.PRECEDENCE, label: 'Годно' }));
  mainScenario.addLink(new Link({ id: 'l-14', sourceId: 'uob-9', targetId: 'uob-10', type: LinkType.PRECEDENCE }));
  mainScenario.addLink(new Link({ id: 'l-15', sourceId: 'uob-10', targetId: 'ref-end', type: LinkType.OBJECT_FLOW }));

  const model = new IDEF3Model({
    id: 'idef3-gearbox-model',
    name: 'Техпроцесс изготовления редуктора',
    rootDiagram: mainScenario,
  });

  // Child Scenario: Декомпозиция UOB 7 («Термическая закалка ТВЧ и отпуск деталей»)
  const decompDiag = new IDEF3Diagram({
    id: 'scenario-uob-7',
    scenarioNumber: '1.7',
    title: 'Декомпозиция UOB 7: Термообработка деталей',
    parentDiagramId: mainScenario.id,
    parentUOBId: uob7.id,
  });

  const uob71 = new UOB({
    id: 'uob-7-1',
    name: 'Ультразвуковая промывка и обезжиривание деталей',
    nodeNumber: '7.1',
    uobNumber: 'UOB-7.1',
    position: new Position(80, 100),
  });
  const uob72 = new UOB({
    id: 'uob-7-2',
    name: 'Индукционный нагрев ТВЧ до температуры 860°C',
    nodeNumber: '7.2',
    uobNumber: 'UOB-7.2',
    position: new Position(300, 100),
  });
  const uob73 = new UOB({
    id: 'uob-7-3',
    name: 'Охлаждение деталей в закалочном баке с маслом',
    nodeNumber: '7.3',
    uobNumber: 'UOB-7.3',
    position: new Position(520, 100),
  });
  const uob74 = new UOB({
    id: 'uob-7-4',
    name: 'Низкотемпературный отпуск в шахтной печи (200°C, 2ч)',
    nodeNumber: '7.4',
    uobNumber: 'UOB-7.4',
    position: new Position(740, 100),
  });

  decompDiag.addUOB(uob71);
  decompDiag.addUOB(uob72);
  decompDiag.addUOB(uob73);
  decompDiag.addUOB(uob74);

  decompDiag.addLink(new Link({ id: 'dl-1', sourceId: 'uob-7-1', targetId: 'uob-7-2', type: LinkType.PRECEDENCE }));
  decompDiag.addLink(new Link({ id: 'dl-2', sourceId: 'uob-7-2', targetId: 'uob-7-3', type: LinkType.PRECEDENCE }));
  decompDiag.addLink(new Link({ id: 'dl-3', sourceId: 'uob-7-3', targetId: 'uob-7-4', type: LinkType.PRECEDENCE }));

  model.addDiagram(decompDiag);

  return model;
}
