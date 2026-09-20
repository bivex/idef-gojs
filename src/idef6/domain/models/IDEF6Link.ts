export enum RationaleLinkType {
  RESPONDS_TO = 'RESPONDS_TO',   // Alternative addresses/responds to an Issue
  SUPPORTS = 'SUPPORTS',         // Argument (PRO) supports an Alternative
  OBJECTS_TO = 'OBJECTS_TO',     // Argument (CON) objects/refutes an Alternative
  EVALUATES = 'EVALUATES',       // Alternative evaluates against a Criterion
  RESOLVES = 'RESOLVES',         // Alternative chosen to resolve an Issue
}

export interface IDEF6LinkProps {
  id: string;
  sourceId: string;
  targetId: string;
  type: RationaleLinkType;
  label?: string;
  weight?: number;
}

export class IDEF6Link {
  public readonly id: string;
  public readonly sourceId: string;
  public readonly targetId: string;
  public readonly type: RationaleLinkType;
  public readonly label?: string;
  public readonly weight?: number;

  constructor(props: IDEF6LinkProps) {
    if (!props.id) throw new Error('Link ID cannot be empty.');
    if (!props.sourceId || !props.targetId) {
      throw new Error('Link must connect source and target elements.');
    }
    this.id = props.id;
    this.sourceId = props.sourceId;
    this.targetId = props.targetId;
    this.type = props.type;
    this.label = props.label || this.defaultLabel(props.type);
    this.weight = props.weight;
  }

  private defaultLabel(type: RationaleLinkType): string {
    switch (type) {
      case RationaleLinkType.RESPONDS_TO:
        return 'отвечает на';
      case RationaleLinkType.SUPPORTS:
        return '+ поддерживает';
      case RationaleLinkType.OBJECTS_TO:
        return '- возражает';
      case RationaleLinkType.EVALUATES:
        return 'оценивает';
      case RationaleLinkType.RESOLVES:
        return '✓ решает';
      default:
        return '';
    }
  }

  public isSupport(): boolean {
    return this.type === RationaleLinkType.SUPPORTS;
  }

  public isObject(): boolean {
    return this.type === RationaleLinkType.OBJECTS_TO;
  }

  public isResolves(): boolean {
    return this.type === RationaleLinkType.RESOLVES;
  }

  public toJSON() {
    return {
      id: this.id,
      sourceId: this.sourceId,
      targetId: this.targetId,
      type: this.type,
      label: this.label,
      weight: this.weight,
    };
  }
}
