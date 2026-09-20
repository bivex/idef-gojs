export enum RelationshipKind {
  INHERITANCE = 'INHERITANCE',         // Generalization / Specialization
  CLIENT_SERVER = 'CLIENT_SERVER',     // Association / Method invocation
  AGGREGATION = 'AGGREGATION',         // Part-of (shared)
  COMPOSITION = 'COMPOSITION',         // Part-of (composite/exclusive)
  INSTANTIATION = 'INSTANTIATION',     // Class instantiates objects of another class
}

export interface IDEF4RelationshipProps {
  id: string;
  sourceClassId: string;
  targetClassId: string;
  kind: RelationshipKind;
  name?: string;
  sourceMultiplicity?: string; // e.g. "1", "0..*"
  targetMultiplicity?: string; // e.g. "1", "1..*"
  roleName?: string;
}

export class IDEF4Relationship {
  public readonly id: string;
  public readonly sourceClassId: string;
  public readonly targetClassId: string;
  public readonly kind: RelationshipKind;
  public readonly name?: string;
  public readonly sourceMultiplicity?: string;
  public readonly targetMultiplicity?: string;
  public readonly roleName?: string;

  constructor(props: IDEF4RelationshipProps) {
    if (!props.id) throw new Error('Relationship ID cannot be empty.');
    if (!props.sourceClassId || !props.targetClassId) {
      throw new Error('Relationship must connect source and target classes.');
    }
    this.id = props.id;
    this.sourceClassId = props.sourceClassId;
    this.targetClassId = props.targetClassId;
    this.kind = props.kind;
    this.name = props.name;
    this.sourceMultiplicity = props.sourceMultiplicity;
    this.targetMultiplicity = props.targetMultiplicity;
    this.roleName = props.roleName;
  }

  public isInheritance(): boolean {
    return this.kind === RelationshipKind.INHERITANCE;
  }

  public isClientServer(): boolean {
    return this.kind === RelationshipKind.CLIENT_SERVER;
  }

  public isAggregation(): boolean {
    return this.kind === RelationshipKind.AGGREGATION;
  }

  public isComposition(): boolean {
    return this.kind === RelationshipKind.COMPOSITION;
  }

  public toJSON() {
    return {
      id: this.id,
      sourceClassId: this.sourceClassId,
      targetClassId: this.targetClassId,
      kind: this.kind,
      name: this.name,
      sourceMultiplicity: this.sourceMultiplicity,
      targetMultiplicity: this.targetMultiplicity,
      roleName: this.roleName,
    };
  }
}
