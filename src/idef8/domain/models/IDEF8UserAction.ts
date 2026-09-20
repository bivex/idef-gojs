import { Position } from '../../../domain/models/Position';

export enum ActionModality {
  CLICK = 'CLICK',
  DOUBLE_CLICK = 'DOUBLE_CLICK',
  INPUT_TEXT = 'INPUT_TEXT',
  SELECT_OPTION = 'SELECT_OPTION',
  HOTKEY = 'HOTKEY',
  DRAG_DROP = 'DRAG_DROP',
  TOUCH_GESTURE = 'TOUCH_GESTURE',
}

export interface IDEF8UserActionProps {
  id: string;
  name: string;
  modality?: ActionModality;
  targetWidgetId?: string;
  description?: string;
  position?: Position;
}

export class IDEF8UserAction {
  public readonly id: string;
  private _name: string;
  public readonly modality: ActionModality;
  public readonly targetWidgetId?: string;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF8UserActionProps) {
    if (!props.id) throw new Error('User action ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('User action name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.modality = props.modality || ActionModality.CLICK;
    this.targetWidgetId = props.targetWidgetId;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('User action name cannot be empty.');
    this._name = name.trim();
  }

  public get description(): string | undefined {
    return this._description;
  }

  public setDescription(desc?: string): void {
    this._description = desc;
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
      modality: this.modality,
      targetWidgetId: this.targetWidgetId,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
