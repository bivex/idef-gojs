import { Position } from '../../../domain/models/Position';

export enum ControlledObjectType {
  PROCESS = 'PROCESS',         // Бизнес-процесс / технологическая операция (IDEF0/IDEF3)
  PRODUCT = 'PRODUCT',         // Изделие / сборочная единица / деталь
  EQUIPMENT = 'EQUIPMENT',     // Станок, агрегат, инструмент
  RESOURCE = 'RESOURCE',       // Материал, сплав, полуфабрикат, энергия
  PERSONNEL = 'PERSONNEL',     // Персонал, рабочая смена, операторы
}

export interface IDEF9ControlledObjectProps {
  id: string;
  name: string;
  objectType?: ControlledObjectType;
  description?: string;
  position?: Position;
}

export class IDEF9ControlledObject {
  public readonly id: string;
  private _name: string;
  public readonly objectType: ControlledObjectType;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF9ControlledObjectProps) {
    if (!props.id) throw new Error('ControlledObject ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('ControlledObject name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.objectType = props.objectType || ControlledObjectType.PROCESS;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('ControlledObject name cannot be empty.');
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
      objectType: this.objectType,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
