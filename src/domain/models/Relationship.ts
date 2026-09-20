export enum RelationshipType {
  IDENTIFYING = 'IDENTIFYING',
  NON_IDENTIFYING = 'NON_IDENTIFYING',
  NON_SPECIFIC = 'NON_SPECIFIC', // IDEF1X Many-to-Many (N:M): solid line with dots on both ends
}

export enum Cardinality {
  ZERO_OR_MORE = 'ZERO_OR_MORE', // Default dot
  ONE_OR_MORE = 'ONE_OR_MORE',   // Dot + 'P'
  ZERO_OR_ONE = 'ZERO_OR_ONE',   // Dot + 'Z'
  EXACTLY_ONE = 'EXACTLY_ONE',   // No dot or '1'
  EXACTLY_N = 'EXACTLY_N',       // Dot + specific number 'N'
  SPECIFIC_RANGE = 'SPECIFIC_RANGE', // Dot + range string (e.g. '2..6')
}

export interface RelationshipProps {
  id: string;
  name: string;
  parentEntityId: string;
  childEntityId: string;
  type?: RelationshipType;
  cardinality?: Cardinality;
  cardinalityValue?: string; // For SPECIFIC_RANGE or EXACTLY_N
  isOptional?: boolean;      // For non-identifying relationships (null foreign key allowed)
  inverseName?: string;     // Child-to-parent verb phrase (IDEF1X dual verb phrases)
  roleName?: string;        // Explicit role name for migrated FK (e.g. manager_no)
}

export class Relationship {
  public readonly id: string;
  private _name: string;
  private _inverseName?: string;
  public readonly parentEntityId: string;
  public readonly childEntityId: string;
  private _type: RelationshipType;
  private _cardinality: Cardinality;
  private _cardinalityValue?: string;
  private _isOptional: boolean;
  private _roleName?: string;

  constructor(props: RelationshipProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Relationship ID cannot be empty.');
    }
    if (!props.parentEntityId || !props.childEntityId) {
      throw new Error('Relationship must connect a parent and a child entity.');
    }

    this.id = props.id;
    this._name = props.name || '';
    this._inverseName = props.inverseName;
    this.parentEntityId = props.parentEntityId;
    this.childEntityId = props.childEntityId;
    this._type = props.type ?? RelationshipType.IDENTIFYING;
    this._cardinality = props.cardinality ?? Cardinality.ZERO_OR_MORE;
    this._cardinalityValue = props.cardinalityValue;
    this._isOptional = props.isOptional ?? false;
    this._roleName = props.roleName;
  }

  public get name(): string {
    return this._name;
  }

  public get type(): RelationshipType {
    return this._type;
  }

  public get cardinality(): Cardinality {
    return this._cardinality;
  }

  public get cardinalityValue(): string | undefined {
    return this._cardinalityValue;
  }

  public get isOptional(): boolean {
    return this._isOptional;
  }

  public get inverseName(): string | undefined {
    return this._inverseName;
  }

  public get roleName(): string | undefined {
    return this._roleName;
  }

  public isIdentifying(): boolean {
    return this._type === RelationshipType.IDENTIFYING;
  }

  public isNonIdentifying(): boolean {
    return this._type === RelationshipType.NON_IDENTIFYING;
  }

  public isNonSpecific(): boolean {
    return this._type === RelationshipType.NON_SPECIFIC;
  }

  public setName(name: string): void {
    this._name = name.trim();
  }

  public setInverseName(inverseName?: string): void {
    this._inverseName = inverseName?.trim();
  }

  public setRoleName(roleName?: string): void {
    this._roleName = roleName?.trim();
  }

  public setType(type: RelationshipType): void {
    this._type = type;
  }

  public setCardinality(cardinality: Cardinality, value?: string): void {
    this._cardinality = cardinality;
    this._cardinalityValue = value;
  }

  public setOptional(isOptional: boolean): void {
    this._isOptional = isOptional;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      inverseName: this.inverseName,
      roleName: this.roleName,
      parentEntityId: this.parentEntityId,
      childEntityId: this.childEntityId,
      type: this.type,
      cardinality: this.cardinality,
      cardinalityValue: this.cardinalityValue,
      isOptional: this.isOptional,
    };
  }
}
