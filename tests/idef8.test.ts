import { describe, it, expect } from 'bun:test';
import { IDEF8Screen, ScreenType, ScreenState } from '../src/idef8/domain/models/IDEF8Screen';
import { IDEF8UserAction, ActionModality } from '../src/idef8/domain/models/IDEF8UserAction';
import { IDEF8SystemResponse, ResponseType } from '../src/idef8/domain/models/IDEF8SystemResponse';
import { IDEF8UserRole, PrivilegeLevel } from '../src/idef8/domain/models/IDEF8UserRole';
import { IDEF8Link, InteractionLinkType } from '../src/idef8/domain/models/IDEF8Link';
import { IDEF8Diagram } from '../src/idef8/domain/models/IDEF8Diagram';
import { IDEF8Model } from '../src/idef8/domain/models/IDEF8Model';
import { IDEF8Rules } from '../src/idef8/domain/rules/IDEF8Rules';
import { IDEF8Editor } from '../src/idef8/infrastructure/adapters/inbound/IDEF8Editor';

describe('IDEF8 Human-System Interaction Design Method (KBSI / US Air Force)', () => {
  it('should create Screen, UserAction, SystemResponse, and UserRole with properties', () => {
    const screen = new IDEF8Screen({
      id: 'scr-1',
      name: 'Главный экран SCADA',
      screenType: ScreenType.DASHBOARD,
      state: ScreenState.ACTIVE,
      widgets: [
        { id: 'w-1', name: 'Кнопка СТОП', widgetType: 'BUTTON' },
        { id: 'w-2', name: 'Датчик температуры', widgetType: 'GAUGE' },
      ],
    });

    expect(screen.id).toBe('scr-1');
    expect(screen.name).toBe('Главный экран SCADA');
    expect(screen.screenType).toBe(ScreenType.DASHBOARD);
    expect(screen.widgets.length).toBe(2);

    const action = new IDEF8UserAction({
      id: 'act-1',
      name: 'Нажатие кнопки СТОП',
      modality: ActionModality.CLICK,
      targetWidgetId: 'w-1',
    });
    expect(action.modality).toBe(ActionModality.CLICK);

    const response = new IDEF8SystemResponse({
      id: 'resp-1',
      name: 'Остановка шпинделя станка',
      responseType: ResponseType.STATE_CHANGE,
    });
    expect(response.responseType).toBe(ResponseType.STATE_CHANGE);

    const role = new IDEF8UserRole({
      id: 'role-1',
      name: 'Оператор ЧПУ',
      privilegeLevel: PrivilegeLevel.OPERATOR,
    });
    expect(role.privilegeLevel).toBe(PrivilegeLevel.OPERATOR);
  });

  it('should handle interaction links between HMI elements', () => {
    const screenMain = new IDEF8Screen({ id: 'scr-main', name: 'Главная панель' });
    const screenModal = new IDEF8Screen({
      id: 'scr-modal',
      name: 'Диалог подтверждения аварии',
      screenType: ScreenType.MODAL_DIALOG,
    });
    const userAction = new IDEF8UserAction({ id: 'act-e-stop', name: 'Нажатие E-Stop' });
    const sysResp = new IDEF8SystemResponse({ id: 'resp-cutoff', name: 'Обесточивание приводов' });

    const diag = new IDEF8Diagram({
      id: 'diag-1',
      name: 'Схема взаимодействия',
    });

    diag.addScreen(screenMain);
    diag.addScreen(screenModal);
    diag.addUserAction(userAction);
    diag.addSystemResponse(sysResp);

    const linkTrigger = new IDEF8Link({
      id: 'link-trig',
      sourceId: userAction.id,
      targetId: sysResp.id,
      type: InteractionLinkType.TRIGGERS,
    });
    const linkModal = new IDEF8Link({
      id: 'link-modal',
      sourceId: userAction.id,
      targetId: screenModal.id,
      type: InteractionLinkType.OPENS_MODAL,
    });
    const linkReturn = new IDEF8Link({
      id: 'link-return',
      sourceId: screenModal.id,
      targetId: screenMain.id,
      type: InteractionLinkType.RETURNS_TO,
    });

    diag.addLink(linkTrigger);
    diag.addLink(linkModal);
    diag.addLink(linkReturn);

    expect(diag.links.length).toBe(3);
    const issues = IDEF8Rules.validate(diag);
    expect(issues.length).toBe(0);
  });

  it('should validate modal without return and unhandled user actions', () => {
    const screenModal = new IDEF8Screen({
      id: 'modal-trap',
      name: 'Ловушка без кнопки возврата',
      screenType: ScreenType.MODAL_DIALOG,
    });
    const orphanAction = new IDEF8UserAction({
      id: 'act-orphan',
      name: 'Клик в пустоту',
    });

    const diag = new IDEF8Diagram({
      id: 'diag-warn',
      name: 'Диаграмма с предупреждениями',
    });
    diag.addScreen(screenModal);
    diag.addUserAction(orphanAction);

    const issues = IDEF8Rules.validate(diag);
    expect(issues.some((i) => i.code === 'IDEF8_MODAL_WITHOUT_RETURN')).toBe(true);
    expect(issues.some((i) => i.code === 'IDEF8_UNHANDLED_USER_ACTION')).toBe(true);
  });

  it('should detect dangling links and duplicate screen names', () => {
    const s1 = new IDEF8Screen({ id: 's-1', name: 'Панель настроек' });
    const s2 = new IDEF8Screen({ id: 's-2', name: 'Панель настроек' }); // Duplicate name

    const diag = new IDEF8Diagram({
      id: 'diag-dang',
      name: 'Диаграмма с ошибками',
    });
    diag.addScreen(s1);
    diag.addScreen(s2);

    const dangling = new IDEF8Link({
      id: 'link-dang',
      sourceId: 'non-existent-source',
      targetId: s1.id,
      type: InteractionLinkType.NAVIGATES_TO,
    });
    diag.addLink(dangling);

    const issues = IDEF8Rules.validate(diag);
    expect(issues.some((i) => i.code === 'IDEF8_DANGLING_LINK_SOURCE')).toBe(true);
    expect(issues.some((i) => i.code === 'IDEF8_DUPLICATE_SCREEN_NAME')).toBe(true);
  });

  it('should serialize and deserialize model to/from JSON', () => {
    const model = new IDEF8Model({
      id: 'model-hmi-1',
      name: 'HMI Участка фрезерных станков ЧПУ',
      version: '2.1.0',
    });

    const diag = model.activeDiagram;
    diag.addScreen(
      new IDEF8Screen({
        id: 'scr-dash',
        name: 'Дашборд цеха',
        screenType: ScreenType.DASHBOARD,
      })
    );
    diag.addUserRole(
      new IDEF8UserRole({
        id: 'role-tech',
        name: 'Главный технолог',
        privilegeLevel: PrivilegeLevel.ENGINEER,
      })
    );

    const json = JSON.stringify(model.toJSON());
    const restored = IDEF8Model.fromJSON(JSON.parse(json));

    expect(restored.id).toBe('model-hmi-1');
    expect(restored.name).toBe('HMI Участка фрезерных станков ЧПУ');
    expect(restored.version).toBe('2.1.0');
    expect(restored.activeDiagram.screens.length).toBe(1);
    expect(restored.activeDiagram.userRoles.length).toBe(1);
  });

  it('should manage elements via IDEF8Editor facade', () => {
    const editor = new IDEF8Editor();
    editor.createModel('m-facade', 'Тестовая модель фасада');

    const screen = editor.addScreen({
      name: 'Экран телеметрии',
      screenType: ScreenType.CONTROL_PANEL,
    });
    expect(screen.name).toBe('Экран телеметрии');

    const action = editor.addUserAction({
      name: 'Переключение шпинделя',
      modality: ActionModality.TOUCH_GESTURE,
    });
    expect(action.name).toBe('Переключение шпинделя');

    const resp = editor.addSystemResponse({
      name: 'Включение охлаждения СОЖ',
      responseType: ResponseType.STATE_CHANGE,
    });
    expect(resp.name).toBe('Включение охлаждения СОЖ');

    const role = editor.addUserRole({
      name: 'Сменный наладчик',
      privilegeLevel: PrivilegeLevel.OPERATOR,
    });
    expect(role.name).toBe('Сменный наладчик');

    const link = editor.addLink({
      sourceId: action.id,
      targetId: resp.id,
      type: InteractionLinkType.TRIGGERS,
      label: 'Запуск помпы',
    });
    expect(link.label).toBe('Запуск помпы');

    const diag = editor.getActiveDiagram();
    expect(diag.screens.length).toBe(1);
    expect(diag.userActions.length).toBe(1);
    expect(diag.systemResponses.length).toBe(1);
    expect(diag.userRoles.length).toBe(1);
    expect(diag.links.length).toBe(1);
  });
});
