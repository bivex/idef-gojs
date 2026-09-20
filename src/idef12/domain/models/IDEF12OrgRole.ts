import { Position } from '../../../domain/models/Position';

export enum OrgRoleType {
  ACCOUNTABLE = 'ACCOUNTABLE', // Утверждающий / Несущий ответственность за итог
  RESPONSIBLE = 'RESPONSIBLE', // Непосредственный исполнитель
  CONSULTED = 'CONSULTED',     // Консультирующий эксперт
  INFORMED = 'INFORMED',       // Информируемое лицо
  AUDITOR = 'AUDITOR',         // Независимый контролёр / Аудитор
}

export interface IDEF12OrgRoleProps {
  id?: string;
  code: string;
  name: string;
  roleType?: OrgRoleType;
  scope?: string;
  x?: number;
  y?: number;
}

export class IDEF12OrgRole {
  public readonly id: string;
  public code: string;
  public name: string;
  public roleType: OrgRoleType;
  public scope?: string;
  public position: Position;

  constructor(props: IDEF12OrgRoleProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('OrgRole code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('OrgRole name cannot be empty.');
    }

    this.id = props.id || `role-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.code = props.code.trim();
    this.name = props.name.trim();
    this.roleType = props.roleType || OrgRoleType.RESPONSIBLE;
    this.scope = props.scope?.trim();
    this.position = new Position(props.x ?? 0, props.y ?? 0);
  }

  public toJSON(): IDEF12OrgRoleProps & { id: string; x: number; y: number } {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      roleType: this.roleType,
      scope: this.scope,
      x: this.position.x,
      y: this.position.y,
    };
  }

  public static fromJSON(json: any): IDEF12OrgRole {
    return new IDEF12OrgRole({
      id: json.id,
      code: json.code,
      name: json.name,
      roleType: json.roleType,
      scope: json.scope,
      x: json.x,
      y: json.y,
    });
  }
}
