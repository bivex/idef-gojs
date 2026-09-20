export enum InteractionLinkType {
  NAVIGATES_TO = 'NAVIGATES_TO',   // Переход к экрану (Screen -> Screen или UserAction -> Screen)
  TRIGGERS = 'TRIGGERS',           // Действие запускает реакцию системы (UserAction -> SystemResponse)
  OPENS_MODAL = 'OPENS_MODAL',     // Открытие модального диалога (UserAction -> Modal Screen)
  RETURNS_TO = 'RETURNS_TO',       // Возврат из диалога / назад (Modal Screen -> Screen)
  PERFORMED_BY = 'PERFORMED_BY',   // Действие выполняется ролью (UserRole -> UserAction)
  RESTRICTED_TO = 'RESTRICTED_TO', // Экран доступен роли (Screen -> UserRole)
}

export interface IDEF8LinkProps {
  id: string;
  sourceId: string;
  targetId: string;
  type: InteractionLinkType;
  label?: string;
}

export class IDEF8Link {
  public readonly id: string;
  public readonly sourceId: string;
  public readonly targetId: string;
  public readonly type: InteractionLinkType;
  public readonly label?: string;

  constructor(props: IDEF8LinkProps) {
    if (!props.id) throw new Error('Link ID cannot be empty.');
    if (!props.sourceId) throw new Error('Link sourceId cannot be empty.');
    if (!props.targetId) throw new Error('Link targetId cannot be empty.');
    if (!props.type) throw new Error('Link type cannot be empty.');

    this.id = props.id;
    this.sourceId = props.sourceId;
    this.targetId = props.targetId;
    this.type = props.type;
    this.label = props.label;
  }

  public toJSON(): object {
    return {
      id: this.id,
      sourceId: this.sourceId,
      targetId: this.targetId,
      type: this.type,
      label: this.label,
    };
  }
}
