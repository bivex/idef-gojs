export enum OntologyRelationType {
  SUBKIND_OF = 'SUBKIND_OF',                   // Taxonomy / Specialization
  PART_OF = 'PART_OF',                         // Mereology / Composition
  INSTANTIATES = 'INSTANTIATES',               // Individual is instance of Kind
  FIRST_ORDER_RELATION = 'FIRST_ORDER_RELATION', // Custom ontology relation (e.g. operates, consumes)
}

export interface IDEF5RelationProps {
  id: string;
  sourceKindId: string;
  targetKindId: string;
  type: OntologyRelationType;
  name?: string;
  isTransitive?: boolean;
  isSymmetric?: boolean;
  isReflexive?: boolean;
}

export class IDEF5Relation {
  public readonly id: string;
  public readonly sourceKindId: string;
  public readonly targetKindId: string;
  public readonly type: OntologyRelationType;
  public readonly name?: string;
  public readonly isTransitive: boolean;
  public readonly isSymmetric: boolean;
  public readonly isReflexive: boolean;

  constructor(props: IDEF5RelationProps) {
    if (!props.id) throw new Error('Relation ID cannot be empty.');
    if (!props.sourceKindId || !props.targetKindId) {
      throw new Error('Relation must connect source and target kinds.');
    }
    this.id = props.id;
    this.sourceKindId = props.sourceKindId;
    this.targetKindId = props.targetKindId;
    this.type = props.type;
    this.name = props.name || (props.type === OntologyRelationType.SUBKIND_OF ? 'subkind-of' : props.type === OntologyRelationType.PART_OF ? 'part-of' : '');
    this.isTransitive = props.isTransitive ?? (props.type === OntologyRelationType.SUBKIND_OF || props.type === OntologyRelationType.PART_OF);
    this.isSymmetric = props.isSymmetric ?? false;
    this.isReflexive = props.isReflexive ?? false;
  }

  public isSubkindOf(): boolean {
    return this.type === OntologyRelationType.SUBKIND_OF;
  }

  public isPartOf(): boolean {
    return this.type === OntologyRelationType.PART_OF;
  }

  public isInstantiates(): boolean {
    return this.type === OntologyRelationType.INSTANTIATES;
  }

  public toJSON() {
    return {
      id: this.id,
      sourceKindId: this.sourceKindId,
      targetKindId: this.targetKindId,
      type: this.type,
      name: this.name,
      isTransitive: this.isTransitive,
      isSymmetric: this.isSymmetric,
      isReflexive: this.isReflexive,
    };
  }
}
