/**
 * IDEF9 Demo — Бизнес-правила и ограничения
 * Авиационное / металлургическое производство (лопатки турбины, термообработка)
 *
 * Предприятие: ОАО «Металл-Авиа» — производство лопаток газотурбинных двигателей
 * MES: Siemens Opcenter  |  SCADA: WinCC  |  ERP: 1С:ERP  |  PLC: Siemens S7-1500
 */

import { IDEF9Editor } from '../src/idef9/infrastructure/adapters/inbound/IDEF9Editor';
import { ConstraintType, ConstraintSeverity } from '../src/idef9/domain/models/IDEF9Constraint';
import { ControlledObjectType } from '../src/idef9/domain/models/IDEF9ControlledObject';
import { MechanismType } from '../src/idef9/domain/models/IDEF9EnforcementMechanism';
import { DocumentType } from '../src/idef9/domain/models/IDEF9SourceDocument';
import { ConstraintLinkType } from '../src/idef9/domain/models/IDEF9Link';

export function setupIDEF9(container: HTMLElement | string = 'diagramDiv'): IDEF9Editor {
  const editor = new IDEF9Editor();
  editor.initialize(container);

  editor.createModel(
    'metal-avia-constraints-v1',
    'IDEF9: Ограничения производства лопаток ГТД — ОАО «Металл-Авиа»'
  );

  // ─── Нормативные документы (Source Documents) ───────────────────────────

  const docGOST = editor.addSourceDocument({
    code: 'ГОСТ Р 55892',
    name: 'ГОСТ Р 55892-2013 — Термообработка металлов и сплавов',
    documentType: DocumentType.STATE_STANDARD,
    description: 'Режимы отжига, закалки и старения жаропрочных никелевых сплавов',
    x: 50, y: 80,
  });

  const docOST = editor.addSourceDocument({
    code: 'ОСТ 1 90218',
    name: 'ОСТ 1 90218-76 — Лопатки турбин авиадвигателей',
    documentType: DocumentType.INDUSTRY_CODE,
    description: 'Нормы точности и контроля геометрии рабочих лопаток компрессора и турбины',
    x: 50, y: 280,
  });

  const docTK = editor.addSourceDocument({
    code: 'ТК РФ ст.103',
    name: 'Трудовой кодекс РФ — Ст. 103 (Сменная работа)',
    documentType: DocumentType.LAW_REGULATION,
    description: 'Продолжительность непрерывной работы персонала у тепловых агрегатов не более 12 часов',
    x: 50, y: 480,
  });

  const docSTP = editor.addSourceDocument({
    code: 'СТП-МА-004',
    name: 'СТП-МА-004 — Управление инструментом (стандарт предприятия)',
    documentType: DocumentType.FACTORY_POLICY,
    description: 'Регламент контроля износа и замены режущего инструмента с ЧПУ-станков',
    x: 50, y: 680,
  });

  // ─── Ограничения / Бизнес-правила (Constraints) ─────────────────────────

  const cTemp = editor.addConstraint({
    code: 'CR-01',
    name: 'Температурный режим закалки лопатки',
    statement: 'T_закалки ∈ [1050°C, 1080°C] при выдержке τ = 2±0.1 ч. Отклонение → автоматический брак.',
    constraintType: ConstraintType.TECHNICAL,
    severity: ConstraintSeverity.MANDATORY,
    x: 380, y: 80,
  });

  const cTool = editor.addConstraint({
    code: 'CR-02',
    name: 'Износ режущего инструмента ЧПУ',
    statement: 'VB_инструмента ≤ 0.3 мм. При VB > 0.25 мм — предупреждение MES. При VB > 0.3 мм — остановка шпинделя.',
    constraintType: ConstraintType.TECHNICAL,
    severity: ConstraintSeverity.MANDATORY,
    x: 380, y: 260,
  });

  const cCrane = editor.addConstraint({
    code: 'CR-03',
    name: 'Грузоподъёмность мостового крана',
    statement: 'Q_груза ≤ 0.85 × Q_номинал крана. Превышение → блокировка электросхемы ПЛК.',
    constraintType: ConstraintType.TECHNICAL,
    severity: ConstraintSeverity.MANDATORY,
    x: 380, y: 440,
  });

  const cShift = editor.addConstraint({
    code: 'CR-04',
    name: 'Продолжительность смены у печи',
    statement: 'Оператор термического участка работает не более 12 ч. непрерывно. MES запрещает назначение сверх нормы.',
    constraintType: ConstraintType.REGULATORY,
    severity: ConstraintSeverity.MANDATORY,
    x: 380, y: 620,
  });

  const cMES_SLA = editor.addConstraint({
    code: 'CR-05',
    name: 'SLA отклика MES на аварийный сигнал',
    statement: 'Время реакции MES на аварийный сигнал от ПЛК: T_resp ≤ 2 сек. Превышение → аудит и инцидент ИБ.',
    constraintType: ConstraintType.TIME,
    severity: ConstraintSeverity.CONDITIONAL,
    x: 380, y: 800,
  });

  const cGeom = editor.addConstraint({
    code: 'CR-06',
    name: 'Допуск профиля пера лопатки',
    statement: 'Отклонение профиля ±0.05 мм. Превышение — 100% ОТК + маршрутный лист «ДЕФЕКТ».',
    constraintType: ConstraintType.TECHNICAL,
    severity: ConstraintSeverity.MANDATORY,
    x: 380, y: 970,
  });

  // ─── Управляемые объекты (Controlled Objects) ────────────────────────────

  const objThermo = editor.addControlledObject({
    name: 'Термообработка — Операция закалки и старения',
    objectType: ControlledObjectType.PROCESS,
    description: 'МЭО ТМОП-6: Электровакуумная печь ПАП-6, 1100°C макс.',
    x: 720, y: 80,
  });

  const objBlade = editor.addControlledObject({
    name: 'Лопатка турбины 1-й ступени ГТД',
    objectType: ControlledObjectType.PRODUCT,
    description: 'Сплав ЖС6У, класс точности 4 по ОСТ 1 90218-76',
    x: 720, y: 320,
  });

  const objCrane = editor.addControlledObject({
    name: 'Мостовой кран КМ-5 (Q=5т)',
    objectType: ControlledObjectType.EQUIPMENT,
    description: 'Пролёт 18 м. ПЛК Siemens S7-1500 с датчиком нагрузки HX711',
    x: 720, y: 560,
  });

  const objOperator = editor.addControlledObject({
    name: 'Операторы термического участка',
    objectType: ControlledObjectType.PERSONNEL,
    description: '3 смены по 4 чел. Профессия: термист 4-го разряда',
    x: 720, y: 780,
  });

  // ─── Механизмы исполнения (Enforcement Mechanisms) ──────────────────────

  const mechPLC = editor.addEnforcementMechanism({
    name: 'Блокировка ПЛК Siemens S7-1500 (термопечь)',
    mechanismType: MechanismType.AUTOMATED_PLC,
    description: 'FC-блок OB35: мониторинг TC-сигнала каждые 500 мс, аварийное отключение нагрева при T > 1082°C',
    x: 1060, y: 80,
  });

  const mechMES = editor.addEnforcementMechanism({
    name: 'Правило MES Siemens Opcenter — контроль износа',
    mechanismType: MechanismType.SOFTWARE_RULE,
    description: 'Real-time OPC-UA поллинг ПЛК станка каждые 200 мс, визуальное предупреждение и автостоп шпинделя',
    x: 1060, y: 280,
  });

  const mechQC = editor.addEnforcementMechanism({
    name: 'Контроль ОТК — КИМ Zeiss Contura',
    mechanismType: MechanismType.QUALITY_INSPECTION,
    description: 'Измерение профиля пера на координатно-измерительной машине после чистового фрезерования',
    x: 1060, y: 500,
  });

  const mechESign = editor.addEnforcementMechanism({
    name: 'ЭЦП главного металлурга (отклонение режима)',
    mechanismType: MechanismType.DIGITAL_SIGNATURE,
    description: '1C:ERP — электронная подпись обязательна для запуска партии при deviation от СТП',
    x: 1060, y: 700,
  });

  const mechERP = editor.addEnforcementMechanism({
    name: 'Аудит рабочего времени 1С:ERP',
    mechanismType: MechanismType.ERP_AUDIT,
    description: 'Автоматический запрет табельного закрытия смены свыше 12 часов у термоагрегатов',
    x: 1060, y: 900,
  });

  // ─── Связи (Links) ────────────────────────────────────────────────────────

  // CR-01 derived from ГОСТ Р 55892
  editor.addLink({ sourceId: cTemp.id, targetId: docGOST.id, type: ConstraintLinkType.DERIVED_FROM });

  // CR-06 derived from ОСТ 1 90218
  editor.addLink({ sourceId: cGeom.id, targetId: docOST.id, type: ConstraintLinkType.DERIVED_FROM });

  // CR-04 derived from ТК РФ
  editor.addLink({ sourceId: cShift.id, targetId: docTK.id, type: ConstraintLinkType.DERIVED_FROM });

  // CR-02 derived from СТП-МА-004
  editor.addLink({ sourceId: cTool.id, targetId: docSTP.id, type: ConstraintLinkType.DERIVED_FROM });

  // CR-01 constrains термообработка
  editor.addLink({ sourceId: cTemp.id, targetId: objThermo.id, type: ConstraintLinkType.CONSTRAINS });

  // CR-02 constrains изделие лопатка (инструментальный маршрут)
  editor.addLink({ sourceId: cTool.id, targetId: objBlade.id, type: ConstraintLinkType.CONSTRAINS });

  // CR-03 constrains кран
  editor.addLink({ sourceId: cCrane.id, targetId: objCrane.id, type: ConstraintLinkType.CONSTRAINS });

  // CR-04 constrains операторов
  editor.addLink({ sourceId: cShift.id, targetId: objOperator.id, type: ConstraintLinkType.CONSTRAINS });

  // CR-06 constrains лопатка (геометрия)
  editor.addLink({ sourceId: cGeom.id, targetId: objBlade.id, type: ConstraintLinkType.CONSTRAINS });

  // CR-01 enforced by ПЛК
  editor.addLink({ sourceId: cTemp.id, targetId: mechPLC.id, type: ConstraintLinkType.ENFORCED_BY });

  // CR-02 enforced by MES
  editor.addLink({ sourceId: cTool.id, targetId: mechMES.id, type: ConstraintLinkType.ENFORCED_BY });

  // CR-06 enforced by ОТК
  editor.addLink({ sourceId: cGeom.id, targetId: mechQC.id, type: ConstraintLinkType.ENFORCED_BY });

  // CR-04 enforced by ERP аудит
  editor.addLink({ sourceId: cShift.id, targetId: mechERP.id, type: ConstraintLinkType.ENFORCED_BY });

  // CR-03 enforced by ПЛК (crane load block)
  editor.addLink({ sourceId: cCrane.id, targetId: mechPLC.id, type: ConstraintLinkType.ENFORCED_BY, label: 'crane-lock' });

  // CR-05 enforced by MES
  editor.addLink({ sourceId: cMES_SLA.id, targetId: mechMES.id, type: ConstraintLinkType.ENFORCED_BY });

  // CR-01 может конфликтовать с CR-05 (большая загрузка MES при аварии — SLA)
  editor.addLink({
    sourceId: cTemp.id,
    targetId: cMES_SLA.id,
    type: ConstraintLinkType.CONFLICTS_WITH,
    label: 'SLA под угрозой при аварии печи',
  });

  // Отклонение режима: CR-01 требует ЭЦП главного металлурга
  editor.addLink({ sourceId: cTemp.id, targetId: mechESign.id, type: ConstraintLinkType.ENFORCED_BY, label: 'deviation' });

  return editor;
}
