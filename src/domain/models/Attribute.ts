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
    public readonly isOptional: boolean = false,
    public readonly alternateKeyIndex?: number | number[] // IDEF1X FIPS 184 §3.8.2 (AK1, AK2, ...)
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Attribute name cannot be empty.');
    }
    if (isPrimaryKey && isOptional) {
      throw new Error('Primary Key attributes cannot be optional (nullable) in IDEF1X.');
    }
  }

  /**
   * Formatted IDEF1X display label per FIPS 184 §3.8.2 & §3.9.2
   * Example: "customer_id : INTEGER" or "dept_no (FK)" or "ssn (AK1)" or "manager.emp_no (AK1, FK)"
   */
  public get formattedName(): string {
    const baseName = this.roleName ? `${this.roleName}.${this.name}` : this.name;
    const tags: string[] = [];

    // Alternate Key tags (AK1, AK2) per FIPS 184 §3.8.2
    if (this.alternateKeyIndex !== undefined) {
      const akIndices = Array.isArray(this.alternateKeyIndex)
        ? this.alternateKeyIndex
        : [this.alternateKeyIndex];
      for (const idx of akIndices) {
        tags.push(`AK${idx}`);
      }
    }

    // Foreign Key tag per FIPS 184 §3.9.2
    if (this.isForeignKey) {
      tags.push('FK');
    }

    let result = baseName;
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
      isPk ? false : this.isOptional,
      this.alternateKeyIndex
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
      this.isOptional,
      this.alternateKeyIndex
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
      alternateKeyIndex: this.alternateKeyIndex,
    };
  }
}
