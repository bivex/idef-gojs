export enum ConstraintLinkType {
  CONSTRAINS = 'CONSTRAINS',         // Ограничение накладывается на объект/процесс (Constraint -> ControlledObject)
  ENFORCED_BY = 'ENFORCED_BY',       // Ограничение обеспечивается механизмом (Constraint -> EnforcementMechanism)
  DERIVED_FROM = 'DERIVED_FROM',     // Ограничение выведено из документа/ГОСТа (Constraint -> SourceDocument)
  CONFLICTS_WITH = 'CONFLICTS_WITH', // Противоречие/конфликт между ограничениями (Constraint -> Constraint)
  SUPERSEDES = 'SUPERSEDES',         // Новое ограничение замещает устаревшее (Constraint -> Constraint)
}

export interface IDEF9LinkProps {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConstraintLinkType;
  label?: string;
}

export class IDEF9Link {
  public readonly id: string;
  public readonly sourceId: string;
  public readonly targetId: string;
  public readonly type: ConstraintLinkType;
  public readonly label?: string;

  constructor(props: IDEF9LinkProps) {
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
