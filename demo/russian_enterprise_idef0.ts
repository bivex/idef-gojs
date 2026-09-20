import { IDEF0Model } from '../src/idef0/domain/models/IDEF0Model';
import { IDEF0Diagram } from '../src/idef0/domain/models/IDEF0Diagram';
import { Activity } from '../src/idef0/domain/models/Activity';
import { Arrow } from '../src/idef0/domain/models/Arrow';
import { ICOMType, TunnelType } from '../src/idef0/domain/models/ICOMType';

export function createRussianEnterpriseIDEF0Model(): IDEF0Model {
  // 1. Root Context Diagram A-0
  const contextDiagram = new IDEF0Diagram({
    id: 'diag-a-minus-0',
    nodeNumber: 'A-0',
    title: 'Управление машиностроительным предприятием (Контекст A-0)',
  });

  const topActivity = new Activity({
    id: 'act-a0',
    name: 'Управлять машиностроительным предприятием',
    nodeNumber: 'A0',
    detailNumber: 0,
    hasDecomposition: true,
    dNumber: 'A0',
  });
  contextDiagram.addActivity(topActivity);

  // Boundary arrows for A-0
  contextDiagram.addArrow(
    new Arrow({
      id: 'arr-c1-ctx',
      name: 'Законодательство РФ и ГОСТ',
      targetActivityId: 'act-a0',
      icomType: ICOMType.CONTROL,
    })
  );
  contextDiagram.addArrow(
    new Arrow({
      id: 'arr-c2-ctx',
      name: 'Бизнес-план и бюджет',
      targetActivityId: 'act-a0',
      icomType: ICOMType.CONTROL,
    })
  );
  contextDiagram.addArrow(
    new Arrow({
      id: 'arr-i1-ctx',
      name: 'Сырье, металл и комплектующие',
      targetActivityId: 'act-a0',
      icomType: ICOMType.INPUT,
    })
  );
  contextDiagram.addArrow(
    new Arrow({
      id: 'arr-i2-ctx',
      name: 'Заказы и технические требования клиентов',
      targetActivityId: 'act-a0',
      icomType: ICOMType.INPUT,
    })
  );
  contextDiagram.addArrow(
    new Arrow({
      id: 'arr-o1-ctx',
      name: 'Готовая сертифицированная продукция',
      sourceActivityId: 'act-a0',
      icomType: ICOMType.OUTPUT,
    })
  );
  contextDiagram.addArrow(
    new Arrow({
      id: 'arr-o2-ctx',
      name: 'Финансовая прибыль и отчетность',
      sourceActivityId: 'act-a0',
      icomType: ICOMType.OUTPUT,
    })
  );
  contextDiagram.addArrow(
    new Arrow({
      id: 'arr-m1-ctx',
      name: 'Производственный персонал и инженеры',
      targetActivityId: 'act-a0',
      icomType: ICOMType.MECHANISM,
    })
  );
  contextDiagram.addArrow(
    new Arrow({
      id: 'arr-m2-ctx',
      name: 'Станочный парк и КИС ERP/MES',
      targetActivityId: 'act-a0',
      icomType: ICOMType.MECHANISM,
    })
  );

  const model = new IDEF0Model({
    id: 'enterprise-idef0-model',
    name: 'Управление машиностроительным заводом',
    contextDiagram,
  });

  // 2. Decomposition Diagram A0: «Основные процессы машиностроительного завода»
  const diagA0 = new IDEF0Diagram({
    id: 'diag-a0',
    nodeNumber: 'A0',
    title: 'Основные процессы машиностроительного завода',
    parentDiagramId: contextDiagram.id,
    parentActivityId: topActivity.id,
  });

  const actA1 = new Activity({
    id: 'act-a1',
    name: 'Управлять маркетингом и продажами',
    nodeNumber: 'A1',
    detailNumber: 1,
  });

  const actA2 = new Activity({
    id: 'act-a2',
    name: 'Проектировать и конструировать изделия',
    nodeNumber: 'A2',
    detailNumber: 2,
  });

  const actA3 = new Activity({
    id: 'act-a3',
    name: 'Закупать сырье и материалы',
    nodeNumber: 'A3',
    detailNumber: 3,
  });

  const actA4 = new Activity({
    id: 'act-a4',
    name: 'Изготавливать и собирать изделия',
    nodeNumber: 'A4',
    detailNumber: 4,
    hasDecomposition: true,
    dNumber: 'A4',
  });

  const actA5 = new Activity({
    id: 'act-a5',
    name: 'Контролировать качество и отгружать',
    nodeNumber: 'A5',
    detailNumber: 5,
  });

  diagA0.addActivity(actA1);
  diagA0.addActivity(actA2);
  diagA0.addActivity(actA3);
  diagA0.addActivity(actA4);
  diagA0.addActivity(actA5);

  // External Inputs
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-i-orders',
      name: 'Заявки клиентов',
      targetActivityId: 'act-a1',
      icomType: ICOMType.INPUT,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-i-raw',
      name: 'Сырье и металлопрокат',
      targetActivityId: 'act-a3',
      icomType: ICOMType.INPUT,
    })
  );

  // External Controls
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-c-strat',
      name: 'Стратегия и бюджет',
      targetActivityId: 'act-a1',
      icomType: ICOMType.CONTROL,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-c-gost',
      name: 'Стандарты ГОСТ и ЕСКД',
      targetActivityId: 'act-a2',
      icomType: ICOMType.CONTROL,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-c-iso',
      name: 'Регламенты ИСО 9001',
      targetActivityId: 'act-a5',
      icomType: ICOMType.CONTROL,
    })
  );

  // Inter-activity flows
  diagA0.addArrow(
    new Arrow({
      id: 'arr-1-to-2',
      name: 'Техническое задание на изделие',
      sourceActivityId: 'act-a1',
      targetActivityId: 'act-a2',
      icomType: ICOMType.CONTROL,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-1-to-4',
      name: 'План производства и заказы',
      sourceActivityId: 'act-a1',
      targetActivityId: 'act-a4',
      icomType: ICOMType.CONTROL,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-2-to-3',
      name: 'Спецификация покупных изделий (BOM)',
      sourceActivityId: 'act-a2',
      targetActivityId: 'act-a3',
      icomType: ICOMType.CONTROL,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-2-to-4',
      name: 'Конструкторская документация (КД)',
      sourceActivityId: 'act-a2',
      targetActivityId: 'act-a4',
      icomType: ICOMType.CONTROL,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-3-to-4',
      name: 'Комплектующие и материалы со склада',
      sourceActivityId: 'act-a3',
      targetActivityId: 'act-a4',
      icomType: ICOMType.INPUT,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-4-to-5',
      name: 'Собранные опытные и серийные изделия',
      sourceActivityId: 'act-a4',
      targetActivityId: 'act-a5',
      icomType: ICOMType.INPUT,
    })
  );

  // External Outputs
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-o-prod',
      name: 'Готовая сертифицированная продукция',
      sourceActivityId: 'act-a5',
      icomType: ICOMType.OUTPUT,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-o-fin',
      name: 'Выручка от реализации',
      sourceActivityId: 'act-a1',
      icomType: ICOMType.OUTPUT,
    })
  );

  // External Mechanisms
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-m-crm',
      name: 'Служба сбыта и CRM',
      targetActivityId: 'act-a1',
      icomType: ICOMType.MECHANISM,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-m-cad',
      name: 'Инженеры-конструкторы и САПР (CAD)',
      targetActivityId: 'act-a2',
      icomType: ICOMType.MECHANISM,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-m-erp',
      name: 'Отдел логистики и склад ERP',
      targetActivityId: 'act-a3',
      icomType: ICOMType.MECHANISM,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-m-prod',
      name: 'Цеха, операторы и станки с ЧПУ',
      targetActivityId: 'act-a4',
      icomType: ICOMType.MECHANISM,
    })
  );
  diagA0.addArrow(
    new Arrow({
      id: 'arr-ext-m-otk',
      name: 'Служба технического контроля (ОТК)',
      targetActivityId: 'act-a5',
      icomType: ICOMType.MECHANISM,
    })
  );

  model.addDiagram(diagA0);

  // 3. Sub-decomposition Diagram A4: «Изготавливать и собирать изделия»
  const diagA4 = new IDEF0Diagram({
    id: 'diag-a4',
    nodeNumber: 'A4',
    title: 'Изготавливать и собирать изделия (Декомпозиция A4)',
    parentDiagramId: diagA0.id,
    parentActivityId: actA4.id,
  });

  const actA41 = new Activity({
    id: 'act-a41',
    name: 'Заготовительное производство и раскрой',
    nodeNumber: 'A4.1',
    detailNumber: 1,
  });
  const actA42 = new Activity({
    id: 'act-a42',
    name: 'Механическая обработка деталей на ЧПУ',
    nodeNumber: 'A4.2',
    detailNumber: 2,
  });
  const actA43 = new Activity({
    id: 'act-a43',
    name: 'Термическая и гальваническая обработка',
    nodeNumber: 'A4.3',
    detailNumber: 3,
  });
  const actA44 = new Activity({
    id: 'act-a44',
    name: 'Узловая и финальная сборка изделий',
    nodeNumber: 'A4.4',
    detailNumber: 4,
  });

  diagA4.addActivity(actA41);
  diagA4.addActivity(actA42);
  diagA4.addActivity(actA43);
  diagA4.addActivity(actA44);

  // Sub-arrows
  diagA4.addArrow(
    new Arrow({
      id: 'arr-a4-in-raw',
      name: 'Металл и заготовки',
      targetActivityId: 'act-a41',
      icomType: ICOMType.INPUT,
    })
  );
  diagA4.addArrow(
    new Arrow({
      id: 'arr-a4-ctrl-kd',
      name: 'Маршрутно-технологические карты',
      targetActivityId: 'act-a41',
      icomType: ICOMType.CONTROL,
    })
  );
  diagA4.addArrow(
    new Arrow({
      id: 'arr-a41-to-a42',
      name: 'Отрезанные мерные заготовки',
      sourceActivityId: 'act-a41',
      targetActivityId: 'act-a42',
      icomType: ICOMType.INPUT,
    })
  );
  diagA4.addArrow(
    new Arrow({
      id: 'arr-a42-to-a43',
      name: 'Обработанные детали',
      sourceActivityId: 'act-a42',
      targetActivityId: 'act-a43',
      icomType: ICOMType.INPUT,
    })
  );
  diagA4.addArrow(
    new Arrow({
      id: 'arr-a43-to-a44',
      name: 'Закаленные и покрытые детали',
      sourceActivityId: 'act-a43',
      targetActivityId: 'act-a44',
      icomType: ICOMType.INPUT,
    })
  );
  diagA4.addArrow(
    new Arrow({
      id: 'arr-a4-out-assy',
      name: 'Готовые узлы и агрегаты на контроль',
      sourceActivityId: 'act-a44',
      icomType: ICOMType.OUTPUT,
    })
  );

  model.addDiagram(diagA4);

  // By default, set active diagram to A0 (the primary decomposition) so it opens immediately with full rich view
  model.setActiveDiagram('diag-a0');

  return model;
}
