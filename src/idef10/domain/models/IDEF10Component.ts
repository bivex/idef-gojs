import { Position } from '../../../domain/models/Position';

export enum ComponentType {
  SERVICE = 'SERVICE',                 // Микросервис / системная служба бэкенда
  MODULE = 'MODULE',                   // Библиотека / программный модуль
  DATABASE = 'DATABASE',               // СУБД / реляционное или TSDB хранилище
  UI_CLIENT = 'UI_CLIENT',             // Клиентский интерфейс (Web HMI / Desktop)
  HARDWARE_DEVICE = 'HARDWARE_DEVICE', // Промышленный контроллер / ПЛК / ЧПУ
}

export enum ComponentLifecycle {
  DEVELOPMENT = 'DEVELOPMENT', // В разработке
  TESTING = 'TESTING',         // На тестировании / ПНР
  ACTIVE = 'ACTIVE',           // В промышленной эксплуатации
  DEPRECATED = 'DEPRECATED',   // Выводится из эксплуатации
}

export interface IDEF10ComponentProps {
  id: string;
  code: string;                        // e.g. "CMP-MES-01"
  name: string;
  techStack: string;                   // e.g. "Go / gRPC", "Siemens SCL / Step 7", "PostgreSQL"
  version?: string;                    // e.g. "v2.4.1"
  componentType?: ComponentType;
  lifecycle?: ComponentLifecycle;
  description?: string;
  position?: Position;
}

export class IDEF10Component {
  public readonly id: string;
  private _code: string;
  private _name: string;
  private _techStack: string;
  private _version: string;
  public readonly componentType: ComponentType;
  private _lifecycle: ComponentLifecycle;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF10ComponentProps) {
    if (!props.id) throw new Error('Component ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Component name cannot be empty.');
    if (!props.code || props.code.trim().length === 0) throw new Error('Component code cannot be empty.');

    this.id = props.id;
    this._code = props.code.trim().toUpperCase();
    this._name = props.name.trim();
    this._techStack = props.techStack || 'Generic';
    this._version = props.version || '1.0.0';
    this.componentType = props.componentType || ComponentType.SERVICE;
    this._lifecycle = props.lifecycle || ComponentLifecycle.ACTIVE;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get code(): string {
    return this._code;
  }

  public setCode(code: string): void {
    if (!code || code.trim().length === 0) throw new Error('Component code cannot be empty.');
    this._code = code.trim().toUpperCase();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Component name cannot be empty.');
    this._name = name.trim();
  }

  public get techStack(): string {
    return this._techStack;
  }

  public setTechStack(stack: string): void {
    this._techStack = stack;
  }

  public get version(): string {
    return this._version;
  }

  public setVersion(v: string): void {
    this._version = v;
  }

  public get lifecycle(): ComponentLifecycle {
    return this._lifecycle;
  }

  public setLifecycle(l: ComponentLifecycle): void {
    this._lifecycle = l;
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
      code: this._code,
      name: this._name,
      techStack: this._techStack,
      version: this._version,
      componentType: this.componentType,
      lifecycle: this._lifecycle,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
