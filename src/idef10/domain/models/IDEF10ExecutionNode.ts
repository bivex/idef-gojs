import { Position } from '../../../domain/models/Position';

export enum NodeType {
  SERVER = 'SERVER',                         // Выделенный сервер / физический хост
  CONTAINER_CLUSTER = 'CONTAINER_CLUSTER',   // Кластер контейнеризации (Kubernetes, Docker Swarm)
  EDGE_CONTROLLER = 'EDGE_CONTROLLER',       // Промышленный контроллер / Edge IPC
  CLOUD_VM = 'CLOUD_VM',                     // Виртуальная машина в корпоративном облаке
  OPERATOR_PANEL = 'OPERATOR_PANEL',         // Аппаратная сенсорная панель ЧМИ
}

export interface IDEF10ExecutionNodeProps {
  id: string;
  code: string;                              // e.g. "NODE-SRV-01"
  name: string;
  nodeType?: NodeType;
  ipAddress?: string;                        // e.g. "192.168.10.25"
  osPlatform?: string;                       // e.g. "Debian Linux 12 / RT-Preempt", "Siemens S7 OS"
  description?: string;
  position?: Position;
}

export class IDEF10ExecutionNode {
  public readonly id: string;
  private _code: string;
  private _name: string;
  public readonly nodeType: NodeType;
  private _ipAddress?: string;
  private _osPlatform?: string;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF10ExecutionNodeProps) {
    if (!props.id) throw new Error('ExecutionNode ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('ExecutionNode name cannot be empty.');
    if (!props.code || props.code.trim().length === 0) throw new Error('ExecutionNode code cannot be empty.');

    this.id = props.id;
    this._code = props.code.trim().toUpperCase();
    this._name = props.name.trim();
    this.nodeType = props.nodeType || NodeType.SERVER;
    this._ipAddress = props.ipAddress;
    this._osPlatform = props.osPlatform;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get code(): string {
    return this._code;
  }

  public setCode(code: string): void {
    if (!code || code.trim().length === 0) throw new Error('ExecutionNode code cannot be empty.');
    this._code = code.trim().toUpperCase();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('ExecutionNode name cannot be empty.');
    this._name = name.trim();
  }

  public get ipAddress(): string | undefined {
    return this._ipAddress;
  }

  public setIpAddress(ip?: string): void {
    this._ipAddress = ip;
  }

  public get osPlatform(): string | undefined {
    return this._osPlatform;
  }

  public setOsPlatform(os?: string): void {
    this._osPlatform = os;
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
      nodeType: this.nodeType,
      ipAddress: this._ipAddress,
      osPlatform: this._osPlatform,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
