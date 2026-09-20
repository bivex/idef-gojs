export interface ForeignKeyReference {
  parentEntityId: string;
  parentAttributeName: string;
}

export class Attribute {
  constructor(
    public readonly name: string,
    public readonly isPrimaryKey: boolean = false,
    public readonly isForeignKey: boolean = false,
    public readonly dataType: string = 'VARCHAR(50)',
    public readonly foreignKeyRef?: ForeignKeyReference,
    public readonly roleName?: string,
    public readonly isOptional: boolean = false
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Attribute name cannot be empty.');
    }
    if (isPrimaryKey && isOptional) {
      throw new Error('Primary Key attributes cannot be optional (nullable) in IDEF1X.');
    }
  }

  /**
   * Formatted IDEF1X display label
   * Example: "customer_id [PK] (INTEGER)" or "dept_no (FK)"
   */
  public get formattedName(): string {
    const parts: string[] = [];
    if (this.roleName) {
      parts.push(`${this.roleName}.${this.name}`);
    } else {
      parts.push(this.name);
    }

    const tags: string[] = [];
    if (this.isPrimaryKey) tags.push('PK');
    if (this.isForeignKey) tags.push('FK');

    let result = parts[0];
    if (tags.length > 0) {
      result += ` (${tags.join(', ')})`;
    }
    if (this.dataType) {
      result += `: ${this.dataType}`;
    }
    return result;
  }

  public withPrimaryKey(isPk: boolean): Attribute {
    return new Attribute(
      this.name,
      isPk,
      this.isForeignKey,
      this.dataType,
      this.foreignKeyRef,
      this.roleName,
      isPk ? false : this.isOptional
    );
  }

  public withForeignKey(isFk: boolean, ref?: ForeignKeyReference): Attribute {
    return new Attribute(
      this.name,
      this.isPrimaryKey,
      isFk,
      this.dataType,
      ref ?? this.foreignKeyRef,
      this.roleName,
      this.isOptional
    );
  }

  public toJSON() {
    return {
      name: this.name,
      isPrimaryKey: this.isPrimaryKey,
      isForeignKey: this.isForeignKey,
      dataType: this.dataType,
      foreignKeyRef: this.foreignKeyRef,
      roleName: this.roleName,
      isOptional: this.isOptional,
    };
  }
}
