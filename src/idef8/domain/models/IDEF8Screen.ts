import { Position } from '../../../domain/models/Position';

export enum ScreenType {
  DASHBOARD = 'DASHBOARD',         // Главный экран / панель мониторинга
  CONTROL_PANEL = 'CONTROL_PANEL', // Панель телеуправления и кнопок
  FORM = 'FORM',                   // Форма ввода данных / параметров
  MODAL_DIALOG = 'MODAL_DIALOG',   // Модальное окно подтверждения / ошибки
  REPORT_VIEW = 'REPORT_VIEW',     // Экран аналитики / отчетов
}

export enum ScreenState {
  ACTIVE = 'ACTIVE',
  BACKGROUND = 'BACKGROUND',
  MODAL = 'MODAL',
  HIDDEN = 'HIDDEN',
}

export interface UIWidget {
  id: string;
  name: string;
  widgetType: 'BUTTON' | 'INPUT' | 'TABLE' | 'GAUGE' | 'CHART' | 'TOGGLE' | 'INDICATOR';
  label?: string;
}

export interface IDEF8ScreenProps {
  id: string;
  name: string;
  description?: string;
  screenType?: ScreenType;
  state?: ScreenState;
  widgets?: UIWidget[];
  position?: Position;
}

export class IDEF8Screen {
  public readonly id: string;
  private _name: string;
  private _description?: string;
  public readonly screenType: ScreenType;
  private _state: ScreenState;
  private _widgets: UIWidget[];
  private _position: Position;

  constructor(props: IDEF8ScreenProps) {
    if (!props.id) throw new Error('Screen ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Screen name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this._description = props.description;
    this.screenType = props.screenType || ScreenType.DASHBOARD;
    this._state = props.state || ScreenState.ACTIVE;
    this._widgets = props.widgets ? [...props.widgets] : [];
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Screen name cannot be empty.');
    this._name = name.trim();
  }

  public get description(): string | undefined {
    return this._description;
  }

  public setDescription(desc?: string): void {
    this._description = desc;
  }

  public get state(): ScreenState {
    return this._state;
  }

  public setState(state: ScreenState): void {
    this._state = state;
  }

  public get widgets(): ReadonlyArray<UIWidget> {
    return this._widgets;
  }

  public addWidget(widget: UIWidget): void {
    if (this._widgets.some((w) => w.id === widget.id)) {
      throw new Error(`Widget with ID "${widget.id}" already exists on screen "${this._name}".`);
    }
    this._widgets.push(widget);
  }

  public removeWidget(widgetId: string): void {
    this._widgets = this._widgets.filter((w) => w.id !== widgetId);
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      screenType: this.screenType,
      state: this._state,
      widgets: this._widgets,
      position: this._position.toJSON(),
    };
  }
}
