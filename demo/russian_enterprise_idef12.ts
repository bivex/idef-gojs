/**
 * IDEF12 Demo — Организационное моделирование предприятия (Organization Modeling)
 * Предприятие: ОАО «Металл-Авиа» — Авиационное двигателестроение (лопатки турбины ГТД)
 *
 * Описывает:
 * - Иерархическую структуру дирекций, цехов, лабораторий и участков
 * - Штатные должности (C-Level, начальники, инженеры, операторы)
 * - Организационные роли (RACI матрицы: Accountable, Responsible, Auditor)
 * - Обязательные компетенции и допуски безопасности (Ростехнадзор, ВИК/УЗК III уровня, электробезопасность)
 * - Типы связей: подчинение, функциональное руководство, штатное назначение, исполнение ролей, допуски
 */

import { IDEF12Editor } from '../src/idef12/infrastructure/adapters/inbound/IDEF12Editor';
import { OrgUnitType } from '../src/idef12/domain/models/IDEF12OrgUnit';
import { PositionLevel } from '../src/idef12/domain/models/IDEF12Position';
import { OrgRoleType } from '../src/idef12/domain/models/IDEF12OrgRole';
import { CompetencyCriticality } from '../src/idef12/domain/models/IDEF12Competency';
import { OrgLinkType } from '../src/idef12/domain/models/IDEF12Link';

export function setupIDEF12(container: HTMLElement | string = 'diagramDiv'): IDEF12Editor {
  const editor = new IDEF12Editor();
  editor.initialize(container);

  editor.createModel(
    'metal-avia-org-v1',
    'IDEF12: Организационная структура производства — ОАО «Металл-Авиа»'
  );

  // ─── 1. Организационные единицы (OrgUnits) ──────────────────────────────────
  const ouGen = editor.addOrgUnit({
    code: 'OU-DIR-GEN',
    name: 'Генеральная дирекция ОАО «Металл-Авиа»',
    unitType: OrgUnitType.DIVISION,
    headPositionName: 'Генеральный директор',
    headCount: 15,
    location: 'Заводоуправление, корпус А',
    x: 650, y: 50,
  });

  const ouTech = editor.addOrgUnit({
    code: 'OU-DIR-TECH',
    name: 'Служба главного инженера и металлурга',
    unitType: OrgUnitType.DEPARTMENT,
    headPositionName: 'Главный металлург завода',
    headCount: 45,
    location: 'Инженерный корпус, 3-й этаж',
    x: 200, y: 220,
  });

  const ouProd = editor.addOrgUnit({
    code: 'OU-DIR-PROD',
    name: 'Дирекция по основному производству',
    unitType: OrgUnitType.DIVISION,
    headPositionName: 'Директор по производству',
    headCount: 620,
    location: 'Производственный корпус №1',
    x: 650, y: 220,
  });

  const ouQA = editor.addOrgUnit({
    code: 'OU-DIR-QA',
    name: 'Управление качества и технического контроля (ОТК)',
    unitType: OrgUnitType.DEPARTMENT,
    headPositionName: 'Директор по качеству',
    headCount: 75,
    location: 'Лабораторный корпус №2',
    x: 1100, y: 220,
  });

  const ouShop3 = editor.addOrgUnit({
    code: 'OU-SHOP-03',
    name: 'Цех №3 жаропрочного литья и термообработки',
    unitType: OrgUnitType.WORKSHOP,
    headPositionName: 'Начальник цеха №3',
    headCount: 180,
    location: 'Цеховой пролёт Б, термопечной участок',
    x: 650, y: 420,
  });

  const ouSecThermo = editor.addOrgUnit({
    code: 'OU-SEC-THERMO',
    name: 'Участок электровакуумных печей ПАП-6',
    unitType: OrgUnitType.BRIGADE,
    headPositionName: 'Старший мастер участка',
    headCount: 35,
    location: 'Сектор высокотемпературных вакуумных агрегатов',
    x: 450, y: 620,
  });

  const ouLabNDT = editor.addOrgUnit({
    code: 'OU-LAB-NDT',
    name: 'Лаборатория неразрушающего контроля (ВИК/УЗК/Рентген)',
    unitType: OrgUnitType.LABORATORY,
    headPositionName: 'Начальник лаборатории НК',
    headCount: 25,
    location: 'Рентген-защищённый бокс ЛНК',
    x: 1100, y: 420,
  });

  // ─── 2. Должности (Positions) ────────────────────────────────────────────────
  const posCEO = editor.addPosition({
    code: 'POS-CEO',
    name: 'Генеральный директор',
    positionLevel: PositionLevel.EXECUTIVE,
    grade: 'Грейд 18',
    responsibilities: ['Стратегическое управление', 'Утверждение ГОЗ и инвестпрограммы'],
    x: 950, y: 50,
  });

  const posChiefMet = editor.addPosition({
    code: 'POS-CHIEF-MET',
    name: 'Главный металлург завода',
    positionLevel: PositionLevel.EXECUTIVE,
    grade: 'Грейд 16',
    responsibilities: ['Технологический надзор за плавкой и закалкой сплава ЖС6У', 'Утверждение карт термообработки'],
    x: 50, y: 380,
  });

  const posHeadShop3 = editor.addPosition({
    code: 'POS-HEAD-SHOP3',
    name: 'Начальник литейно-термического цеха №3',
    positionLevel: PositionLevel.MANAGEMENT,
    grade: 'Грейд 14',
    responsibilities: ['Выполнение сменного графика закалки', 'Охрана труда и промбезопасность цеха'],
    x: 880, y: 520,
  });

  const posMasterThermo = editor.addPosition({
    code: 'POS-MASTER-THERMO',
    name: 'Старший мастер смены термического участка',
    positionLevel: PositionLevel.MANAGEMENT,
    grade: 'Грейд 12',
    responsibilities: ['Контроль загрузки вакуумных садков печи ПАП-6', 'Ведение вахтенного журнала плавок'],
    x: 200, y: 760,
  });

  const posOpVacuum = editor.addPosition({
    code: 'POS-OP-VACUUM',
    name: 'Оператор вакуумно-термической печи 6-го разряда',
    positionLevel: PositionLevel.OPERATOR,
    grade: '6-й тарифный разряд',
    responsibilities: ['Управление циклом нагрева и выдержки лопаток по SCADA', 'Экстренная продувка аргоном при аварии'],
    x: 520, y: 840,
  });

  const posLeadDefect = editor.addPosition({
    code: 'POS-LEAD-DEFECT',
    name: 'Ведущий инженер-дефектоскопист ЛНК',
    positionLevel: PositionLevel.ENGINEER,
    grade: 'Грейд 11',
    responsibilities: ['Капиллярный и ультразвуковой контроль геометрии пера лопатки', 'Оформление паспорта годности'],
    x: 1100, y: 620,
  });

  // ─── 3. Организационные роли (OrgRoles — RACI) ──────────────────────────────
  const roleProcOwner = editor.addRole({
    code: 'ROLE-PROC-OWNER',
    name: 'Владелец процесса термообработки никелевых сплавов',
    roleType: OrgRoleType.ACCOUNTABLE,
    scope: 'Сквозной процесс: подготовка садки → нагрев → вакуумная закалка → старение',
    x: 50, y: 550,
  });

  const roleSafetyLead = editor.addRole({
    code: 'ROLE-SAFETY-LEAD',
    name: 'Ответственный за промышленную безопасность термоагрегатов',
    roleType: OrgRoleType.ACCOUNTABLE,
    scope: 'Цех №3 и газовые рампы аргона/азота высокого давления',
    x: 880, y: 700,
  });

  const roleBatchAccept = editor.addRole({
    code: 'ROLE-BATCH-ACCEPT',
    name: 'Уполномоченный аудитор приёмки авиаизделий',
    roleType: OrgRoleType.AUDITOR,
    scope: 'ОСТ 1 90218-76 — Контроль геометрии лопаток 1-й ступени турбины',
    x: 1350, y: 620,
  });

  // ─── 4. Компетенции и допуски (Competencies) ────────────────────────────────
  const compRtn = editor.addCompetency({
    code: 'COMP-RTN-B2',
    name: 'Аттестация Ростехнадзора Б.2 (Металлургические опасные объекты)',
    criticality: CompetencyCriticality.MANDATORY_LEGAL,
    certificationBody: 'Федеральная служба Ростехнадзора',
    validityMonths: 60,
    x: 200, y: 960,
  });

  const compElec4 = editor.addCompetency({
    code: 'COMP-ELEC-4',
    name: 'Группа допуска по электробезопасности IV до и выше 1000В',
    criticality: CompetencyCriticality.SAFETY_CRITICAL,
    certificationBody: 'Комиссия Главного энергетика завода',
    validityMonths: 12,
    x: 520, y: 1000,
  });

  const compNDT3 = editor.addCompetency({
    code: 'COMP-NDT-3',
    name: 'Квалификация эксперта неразрушающего контроля ВИК/УЗК III уровня',
    criticality: CompetencyCriticality.MANDATORY_LEGAL,
    certificationBody: 'Головной орган аттестации Авиапрома',
    validityMonths: 36,
    x: 1100, y: 800,
  });

  // ─── 5. Организационные связи (OrgLinks) ─────────────────────────────────────

  // Иерархическое административное подчинение (SUBORDINATE_TO)
  editor.addLink({ sourceId: ouTech.id, targetId: ouGen.id, type: OrgLinkType.SUBORDINATE_TO });
  editor.addLink({ sourceId: ouProd.id, targetId: ouGen.id, type: OrgLinkType.SUBORDINATE_TO });
  editor.addLink({ sourceId: ouQA.id, targetId: ouGen.id, type: OrgLinkType.SUBORDINATE_TO });
  editor.addLink({ sourceId: ouShop3.id, targetId: ouProd.id, type: OrgLinkType.SUBORDINATE_TO });
  editor.addLink({ sourceId: ouSecThermo.id, targetId: ouShop3.id, type: OrgLinkType.SUBORDINATE_TO });
  editor.addLink({ sourceId: ouLabNDT.id, targetId: ouQA.id, type: OrgLinkType.SUBORDINATE_TO });

  // Штатные назначения должностей в подразделения (ASSIGNED_TO)
  editor.addLink({ sourceId: posCEO.id, targetId: ouGen.id, type: OrgLinkType.ASSIGNED_TO });
  editor.addLink({ sourceId: posChiefMet.id, targetId: ouTech.id, type: OrgLinkType.ASSIGNED_TO });
  editor.addLink({ sourceId: posHeadShop3.id, targetId: ouShop3.id, type: OrgLinkType.ASSIGNED_TO });
  editor.addLink({ sourceId: posMasterThermo.id, targetId: ouSecThermo.id, type: OrgLinkType.ASSIGNED_TO });
  editor.addLink({ sourceId: posOpVacuum.id, targetId: ouSecThermo.id, type: OrgLinkType.ASSIGNED_TO });
  editor.addLink({ sourceId: posLeadDefect.id, targetId: ouLabNDT.id, type: OrgLinkType.ASSIGNED_TO });

  // Функциональное руководство (FUNCTIONAL_REPORTS)
  editor.addLink({
    sourceId: posChiefMet.id,
    targetId: ouShop3.id,
    type: OrgLinkType.FUNCTIONAL_REPORTS,
    label: 'Технол. надзор',
  });
  editor.addLink({
    sourceId: ouLabNDT.id,
    targetId: ouShop3.id,
    type: OrgLinkType.FUNCTIONAL_REPORTS,
    label: 'Входной/выходной контроль',
  });

  // Закрепление ролей RACI за должностями (PLAYS_ROLE)
  editor.addLink({ sourceId: posChiefMet.id, targetId: roleProcOwner.id, type: OrgLinkType.PLAYS_ROLE });
  editor.addLink({ sourceId: posHeadShop3.id, targetId: roleSafetyLead.id, type: OrgLinkType.PLAYS_ROLE });
  editor.addLink({ sourceId: posLeadDefect.id, targetId: roleBatchAccept.id, type: OrgLinkType.PLAYS_ROLE });

  // Требования допусков и компетенций (REQUIRES_COMPETENCY)
  editor.addLink({ sourceId: posOpVacuum.id, targetId: compRtn.id, type: OrgLinkType.REQUIRES_COMPETENCY });
  editor.addLink({ sourceId: posOpVacuum.id, targetId: compElec4.id, type: OrgLinkType.REQUIRES_COMPETENCY });
  editor.addLink({ sourceId: posMasterThermo.id, targetId: compRtn.id, type: OrgLinkType.REQUIRES_COMPETENCY });
  editor.addLink({ sourceId: posLeadDefect.id, targetId: compNDT3.id, type: OrgLinkType.REQUIRES_COMPETENCY });

  // Межфункциональное горизонтальное сотрудничество (COLLABORATES_WITH)
  editor.addLink({
    sourceId: ouShop3.id,
    targetId: ouLabNDT.id,
    type: OrgLinkType.COLLABORATES_WITH,
    label: 'Акты испытаний и образцы-свидетели',
  });

  return editor;
}
