export enum OrgLinkType {
  SUBORDINATE_TO = 'SUBORDINATE_TO',           // Административное подчинение (снизу вверх к руководству)
  FUNCTIONAL_REPORTS = 'FUNCTIONAL_REPORTS',   // Функциональное подчинение / матричное руководство
  ASSIGNED_TO = 'ASSIGNED_TO',                 // Привязка должности к подразделению / штатная расстановка
  PLAYS_ROLE = 'PLAYS_ROLE',                   // Исполнение организационной роли должностью/подразделением
  REQUIRES_COMPETENCY = 'REQUIRES_COMPETENCY', // Должность или роль требует наличия допуска/компетенции
  COLLABORATES_WITH = 'COLLABORATES_WITH',     // Межфункциональное горизонтальное взаимодействие
}

export interface IDEF12LinkProps {
  id?: string;
  sourceId: string;
  targetId: string;
  type: OrgLinkType;
  label?: string;
}

export class IDEF12Link {
  public readonly id: string;
  public readonly sourceId: string;
  public readonly targetId: string;
  public readonly type: OrgLinkType;
  public label?: string;

  constructor(props: IDEF12LinkProps) {
    if (!props.sourceId) throw new Error('Org link sourceId cannot be empty.');
    if (!props.targetId) throw new Error('Org link targetId cannot be empty.');

    this.id = props.id || `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.sourceId = props.sourceId;
    this.targetId = props.targetId;
    this.type = props.type;
    this.label = props.label?.trim();
  }

  public toJSON(): IDEF12LinkProps & { id: string } {
    return {
      id: this.id,
      sourceId: this.sourceId,
      targetId: this.targetId,
      type: this.type,
      label: this.label,
    };
  }

  public static fromJSON(json: any): IDEF12Link {
    return new IDEF12Link({
      id: json.id,
      sourceId: json.sourceId,
      targetId: json.targetId,
      type: json.type,
      label: json.label,
    });
  }
}
