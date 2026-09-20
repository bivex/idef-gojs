export enum LinkType {
  PRECEDENCE = 'PRECEDENCE',     // Solid line: Source finishes before target begins
  RELATIONAL = 'RELATIONAL',     // Dashed line: General constraint or relation
  OBJECT_FLOW = 'OBJECT_FLOW',   // Double-arrow solid line: Physical/information object transition
}

export interface LinkProps {
  id: string;
  sourceId: string;
  targetId: string;
  type?: LinkType;
  label?: string;
}

export class Link {
  public readonly id: string;
  public readonly sourceId: string;
  public readonly targetId: string;
  private _type: LinkType;
  private _label?: string;

  constructor(props: LinkProps) {
    if (!props.id) throw new Error('Link ID cannot be empty.');
    if (!props.sourceId || !props.targetId) {
      throw new Error('Link must connect both source and target.');
    }
    this.id = props.id;
    this.sourceId = props.sourceId;
    this.targetId = props.targetId;
    this._type = props.type || LinkType.PRECEDENCE;
    this._label = props.label;
  }

  public get type(): LinkType {
    return this._type;
  }

  public setType(type: LinkType): void {
    this._type = type;
  }

  public get label(): string | undefined {
    return this._label;
  }

  public setLabel(label: string | undefined): void {
    this._label = label;
  }

  public toJSON() {
    return {
      id: this.id,
      sourceId: this.sourceId,
      targetId: this.targetId,
      type: this.type,
      label: this.label,
    };
  }
}
