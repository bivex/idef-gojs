import { Position } from '../../../domain/models/Position';

export enum InterfaceProtocol {
  REST_API = 'REST_API',             // HTTP/JSON REST интерфейс
  GRPC = 'GRPC',                     // Высокоскоростной бинарный RPC
  OPC_UA = 'OPC_UA',                 // Промышленный стандарт телеметрии
  MQTT_KAFKA = 'MQTT_KAFKA',         // Очередь / брокер сообщений
  SQL_TCP = 'SQL_TCP',               // Сетевое подключение к СУБД (Postgres, ODBC)
  MODBUS_TCP = 'MODBUS_TCP',         // Промышленный сетевой протокол ПЛК
}

export enum InterfaceRole {
  PROVIDED = 'PROVIDED',             // Экспортируемый / серверный интерфейс
  REQUIRED = 'REQUIRED',             // Потребляемый / клиентский контракт
}

export interface IDEF10InterfaceProps {
  id: string;
  name: string;
  protocol?: InterfaceProtocol;
  role?: InterfaceRole;
  portNumber?: number;               // e.g. 50051, 4840, 5432
  specification?: string;            // e.g. "openapi.yaml", "sensor_stream.proto"
  description?: string;
  position?: Position;
}

export class IDEF10Interface {
  public readonly id: string;
  private _name: string;
  public readonly protocol: InterfaceProtocol;
  public readonly role: InterfaceRole;
  private _portNumber?: number;
  private _specification?: string;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF10InterfaceProps) {
    if (!props.id) throw new Error('Interface ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Interface name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.protocol = props.protocol || InterfaceProtocol.REST_API;
    this.role = props.role || InterfaceRole.PROVIDED;
    this._portNumber = props.portNumber;
    this._specification = props.specification;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Interface name cannot be empty.');
    this._name = name.trim();
  }

  public get portNumber(): number | undefined {
    return this._portNumber;
  }

  public setPortNumber(port?: number): void {
    this._portNumber = port;
  }

  public get specification(): string | undefined {
    return this._specification;
  }

  public setSpecification(spec?: string): void {
    this._specification = spec;
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
      protocol: this.protocol,
      role: this.role,
      portNumber: this._portNumber,
      specification: this._specification,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
