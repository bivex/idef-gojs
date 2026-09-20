import { Position } from '../../../domain/models/Position';

export enum PrivilegeLevel {
  GUEST = 'GUEST',
  OPERATOR = 'OPERATOR',
  SUPERVISOR = 'SUPERVISOR',
  ENGINEER = 'ENGINEER',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

export interface IDEF8UserRoleProps {
  id: string;
  name: string;
  privilegeLevel?: PrivilegeLevel;
  description?: string;
  position?: Position;
}

export class IDEF8UserRole {
  public readonly id: string;
  private _name: string;
  public readonly privilegeLevel: PrivilegeLevel;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF8UserRoleProps) {
    if (!props.id) throw new Error('User role ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('User role name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.privilegeLevel = props.privilegeLevel || PrivilegeLevel.OPERATOR;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('User role name cannot be empty.');
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
      privilegeLevel: this.privilegeLevel,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
