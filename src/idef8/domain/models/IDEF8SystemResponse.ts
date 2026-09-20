import { Position } from '../../../domain/models/Position';

export enum ResponseType {
  STATE_CHANGE = 'STATE_CHANGE',       // Изменение состояния системы / привода / датчика
  FEEDBACK_MESSAGE = 'FEEDBACK_MESSAGE', // Уведомление / тост / индикация
  ERROR_ALERT = 'ERROR_ALERT',         // Сообщение об ошибке / блокировка
  EXECUTE_COMMAND = 'EXECUTE_COMMAND', // Выполнение команды / пуск / останов / выгрузка
  DATA_UPDATE = 'DATA_UPDATE',         // Обновление выборки данных / графиков
}

export interface IDEF8SystemResponseProps {
  id: string;
  name: string;
  responseType?: ResponseType;
  description?: string;
  position?: Position;
}

export class IDEF8SystemResponse {
  public readonly id: string;
  private _name: string;
  public readonly responseType: ResponseType;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF8SystemResponseProps) {
    if (!props.id) throw new Error('System response ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('System response name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.responseType = props.responseType || ResponseType.FEEDBACK_MESSAGE;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('System response name cannot be empty.');
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
      responseType: this.responseType,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
