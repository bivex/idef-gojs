import { IDEF8Editor } from '../src/idef8/infrastructure/adapters/inbound/IDEF8Editor';
import { ScreenType, ScreenState } from '../src/idef8/domain/models/IDEF8Screen';
import { ActionModality } from '../src/idef8/domain/models/IDEF8UserAction';
import { ResponseType } from '../src/idef8/domain/models/IDEF8SystemResponse';
import { PrivilegeLevel } from '../src/idef8/domain/models/IDEF8UserRole';
import { InteractionLinkType } from '../src/idef8/domain/models/IDEF8Link';

/**
 * Creates and loads an HMI/SCADA Human-System Interaction model for a Russian industrial plant
 * (Человеко-машинный интерфейс АСУ ТП фрезерно-токарного участка ЧПУ)
 * in accordance with the KBSI IDEF8 standard.
 */
export function loadRussianEnterpriseIDEF8Demo(editor: IDEF8Editor): void {
  editor.createModel(
    'enterprise-hmi-01',
    'ЧМИ АСУ ТП и SCADA участка станков с ЧПУ (KBSI IDEF8 Interaction Design)'
  );

  // ==========================================
  // 1. User Roles (Роли пользователей / Акторы)
  // ==========================================
  const roleOperator = editor.addUserRole({
    name: 'Оператор-наладчик станка ЧПУ',
    privilegeLevel: PrivilegeLevel.OPERATOR,
    description: 'Управление технологическим циклом, смена инструмента и наблюдение за датчиками',
    x: 60,
    y: 120,
  });

  const roleForeman = editor.addUserRole({
    name: 'Сменный мастер участка',
    privilegeLevel: PrivilegeLevel.SUPERVISOR,
    description: 'Квитирование аварий, контроль сменных заданий и допуск к оборудованию',
    x: 60,
    y: 360,
  });

  const roleTechnologist = editor.addUserRole({
    name: 'Ведущий технолог-программист',
    privilegeLevel: PrivilegeLevel.ENGINEER,
    description: 'Загрузка и верификация управляющих программ G-кода из CAD/CAM',
    x: 60,
    y: 600,
  });

  // ==========================================
  // 2. Screens & Dialogs (Экраны и диалоговые окна HMI)
  // ==========================================
  const scrDashboard = editor.addScreen({
    name: 'Главный мнемощит мониторинга участка ЧПУ',
    description: 'Обзор состояния 12 станков цеха, индикаторы общей готовности и OEE',
    screenType: ScreenType.DASHBOARD,
    state: ScreenState.ACTIVE,
    widgets: [
      { id: 'w-d1', name: 'Статус участка (12 станков в работе)', widgetType: 'INDICATOR' },
      { id: 'w-d2', name: 'Общий OEE участка (87.4%)', widgetType: 'GAUGE' },
      { id: 'w-d3', name: 'Кнопка "Станок Mazak #3"', widgetType: 'BUTTON' },
      { id: 'w-d4', name: 'Кнопка "Аварийный Стоп (E-Stop)"', widgetType: 'BUTTON' },
      { id: 'w-d5', name: 'Кнопка "Аналитика OEE"', widgetType: 'BUTTON' },
    ],
    x: 320,
    y: 160,
  });

  const scrMachineDetail = editor.addScreen({
    name: 'Панель управления станка Mazak Integrex i-400',
    description: 'Оперативный пульт станка: обороты шпинделя, подачи, температура СОЖ и инструмент',
    screenType: ScreenType.CONTROL_PANEL,
    state: ScreenState.BACKGROUND,
    widgets: [
      { id: 'w-m1', name: 'Тахометр шпинделя (12 000 об/мин)', widgetType: 'GAUGE' },
      { id: 'w-m2', name: 'Датчик вибрации шпиндельной бабки', widgetType: 'GAUGE' },
      { id: 'w-m3', name: 'Кнопка "Загрузить УП (G-код)"', widgetType: 'BUTTON' },
      { id: 'w-m4', name: 'Кнопка "Возврат к участку"', widgetType: 'BUTTON' },
    ],
    x: 750,
    y: 60,
  });

  const scrEmergencyModal = editor.addScreen({
    name: 'Модальное окно аварийной остановки (E-Stop Alarm)',
    description: 'Блокирующий диалог: снятие питающего напряжения, индикация причины и защитный регламент',
    screenType: ScreenType.MODAL_DIALOG,
    state: ScreenState.MODAL,
    widgets: [
      { id: 'w-e1', name: 'Тревога: Перегрузка шпинделя по току', widgetType: 'INDICATOR' },
      { id: 'w-e2', name: 'Поле ввода кода подтверждения мастера', widgetType: 'INPUT' },
      { id: 'w-e3', name: 'Кнопка "Квитировать аварию и снять блокировку"', widgetType: 'BUTTON' },
    ],
    x: 750,
    y: 350,
  });

  const scrGCodeForm = editor.addScreen({
    name: 'Экран загрузки и верификации G-кода',
    description: 'Передача постпроцессированных программ из CAM-системы Teamcenter в стойку ЧПУ',
    screenType: ScreenType.FORM,
    state: ScreenState.BACKGROUND,
    widgets: [
      { id: 'w-g1', name: 'Выбор файла программы (*.nc, *.eia)', widgetType: 'INPUT' },
      { id: 'w-g2', name: 'Кнопка "Запуск 3D-верификации"', widgetType: 'BUTTON' },
      { id: 'w-g3', name: 'Кнопка "Прошить в ЧПУ"', widgetType: 'BUTTON' },
    ],
    x: 750,
    y: 620,
  });

  const scrOeeReport = editor.addScreen({
    name: 'Аналитический отчет сменной выработки и OEE',
    description: 'Гистограмма доступности оборудования, учет микропростоев и распределение брака',
    screenType: ScreenType.REPORT_VIEW,
    state: ScreenState.BACKGROUND,
    widgets: [
      { id: 'w-o1', name: 'График доступности станков (Availability)', widgetType: 'CHART' },
      { id: 'w-o2', name: 'Таблица инцидентов и простоев', widgetType: 'TABLE' },
    ],
    x: 750,
    y: -120,
  });

  // ==========================================
  // 3. User Actions (Действия операторов)
  // ==========================================
  const actSelectMachine = editor.addUserAction({
    name: 'Клик на иконку станка Mazak #3',
    modality: ActionModality.CLICK,
    targetWidgetId: 'w-d3',
    description: 'Выбор станка для просмотра телеметрии приводов',
    x: 540,
    y: 70,
  });

  const actHitEStop = editor.addUserAction({
    name: 'Нажатие физической кнопки E-Stop',
    modality: ActionModality.TOUCH_GESTURE,
    targetWidgetId: 'w-d4',
    description: 'Экстренная остановка при угрозе разрушения детали',
    x: 540,
    y: 280,
  });

  const actAcknowledgeAlarm = editor.addUserAction({
    name: 'Ввод пин-кода и квитирование аварии',
    modality: ActionModality.INPUT_TEXT,
    targetWidgetId: 'w-e3',
    description: 'Мастер подтверждает устранение причины аварии',
    x: 1080,
    y: 350,
  });

  const actValidateGCode = editor.addUserAction({
    name: 'Запуск 3D-симуляции обработки',
    modality: ActionModality.CLICK,
    targetWidgetId: 'w-g2',
    description: 'Проверка траектории инструмента на зарезы',
    x: 540,
    y: 560,
  });

  const actOpenOee = editor.addUserAction({
    name: 'Клик по кнопке "Аналитика OEE"',
    modality: ActionModality.CLICK,
    targetWidgetId: 'w-d5',
    description: 'Переход к аналитическому отчету цеха',
    x: 540,
    y: -80,
  });

  // ==========================================
  // 4. System Responses (Реакции системы АСУ ТП)
  // ==========================================
  const respCutoffPower = editor.addSystemResponse({
    name: 'Мгновенное обесточивание сервоприводов и включение сирены',
    responseType: ResponseType.STATE_CHANGE,
    description: 'Срабатывание реле безопасности Pilz и блокировка защитных ограждений',
    x: 1080,
    y: 250,
  });

  const respDisplayMachineData = editor.addSystemResponse({
    name: 'Подключение к брокеру Kafka и отрисовка телеметрии станка',
    responseType: ResponseType.DATA_UPDATE,
    description: 'Отображение графиков частоты вибраций и токов шпинделя',
    x: 1080,
    y: 70,
  });

  const respGCodePreview = editor.addSystemResponse({
    name: 'Отрисовка 3D-модели обработки и проверка коллизий',
    responseType: ResponseType.DATA_UPDATE,
    description: 'Модуль VERICUT выполняет проверку программы за 1.8 сек',
    x: 1080,
    y: 580,
  });

  const respAuditAlarm = editor.addSystemResponse({
    name: 'Запись инцидента в журнал MES и разблокировка сервоприводов',
    responseType: ResponseType.FEEDBACK_MESSAGE,
    description: 'Снятие аварийного флага в ПЛК Siemens S7-1500',
    x: 1080,
    y: 450,
  });

  // ==========================================
  // 5. Interaction Links (Связи взаимодействия)
  // ==========================================
  // Role executions
  editor.addLink({
    sourceId: roleOperator.id,
    targetId: actSelectMachine.id,
    type: InteractionLinkType.PERFORMED_BY,
    label: 'Выполняет',
  });
  editor.addLink({
    sourceId: roleOperator.id,
    targetId: actHitEStop.id,
    type: InteractionLinkType.PERFORMED_BY,
    label: 'Экстренно нажимает',
  });
  editor.addLink({
    sourceId: roleForeman.id,
    targetId: actAcknowledgeAlarm.id,
    type: InteractionLinkType.PERFORMED_BY,
    label: 'Авторизует',
  });
  editor.addLink({
    sourceId: roleTechnologist.id,
    targetId: actValidateGCode.id,
    type: InteractionLinkType.PERFORMED_BY,
    label: 'Верифицирует',
  });

  // Action -> Screen Navigation
  editor.addLink({
    sourceId: actSelectMachine.id,
    targetId: scrMachineDetail.id,
    type: InteractionLinkType.NAVIGATES_TO,
    label: 'Переход к пульту станка',
  });
  editor.addLink({
    sourceId: actOpenOee.id,
    targetId: scrOeeReport.id,
    type: InteractionLinkType.NAVIGATES_TO,
    label: 'Открытие отчета OEE',
  });

  // Action -> System Triggers
  editor.addLink({
    sourceId: actSelectMachine.id,
    targetId: respDisplayMachineData.id,
    type: InteractionLinkType.TRIGGERS,
    label: 'Запуск потока данных',
  });
  editor.addLink({
    sourceId: actHitEStop.id,
    targetId: respCutoffPower.id,
    type: InteractionLinkType.TRIGGERS,
    label: 'Обесточить станок',
  });
  editor.addLink({
    sourceId: actHitEStop.id,
    targetId: scrEmergencyModal.id,
    type: InteractionLinkType.OPENS_MODAL,
    label: 'Показ окна аварии',
  });
  editor.addLink({
    sourceId: actAcknowledgeAlarm.id,
    targetId: respAuditAlarm.id,
    type: InteractionLinkType.TRIGGERS,
    label: 'Сброс блокировки',
  });
  editor.addLink({
    sourceId: actValidateGCode.id,
    targetId: respGCodePreview.id,
    type: InteractionLinkType.TRIGGERS,
    label: 'Симуляция УП',
  });

  // Returns / Back navigation
  editor.addLink({
    sourceId: scrEmergencyModal.id,
    targetId: scrDashboard.id,
    type: InteractionLinkType.RETURNS_TO,
    label: 'Возврат к мониторингу цеха',
  });
  editor.addLink({
    sourceId: scrMachineDetail.id,
    targetId: scrDashboard.id,
    type: InteractionLinkType.NAVIGATES_TO,
    label: 'Назад к мнемосхеме',
  });
}
