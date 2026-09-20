export type Visibility = 'public' | 'protected' | 'private';

export interface IDEF4AttributeProps {
  name: string;
  dataType: string;
  visibility?: Visibility;
  defaultValue?: string;
  isStatic?: boolean;
}

export class IDEF4Attribute {
  public readonly name: string;
  public readonly dataType: string;
  public readonly visibility: Visibility;
  public readonly defaultValue?: string;
  public readonly isStatic: boolean;

  constructor(props: IDEF4AttributeProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Attribute name cannot be empty.');
    }
    this.name = props.name.trim();
    this.dataType = props.dataType || 'any';
    this.visibility = props.visibility || 'public';
    this.defaultValue = props.defaultValue;
    this.isStatic = props.isStatic ?? false;
  }

  public getVisibilitySymbol(): string {
    switch (this.visibility) {
      case 'public': return '+';
      case 'protected': return '#';
      case 'private': return '-';
    }
  }

  public toString(): string {
    const staticPrefix = this.isStatic ? 'static ' : '';
    const def = this.defaultValue ? ` = ${this.defaultValue}` : '';
    return `${this.getVisibilitySymbol()} ${staticPrefix}${this.name}: ${this.dataType}${def}`;
  }

  public toJSON() {
    return {
      name: this.name,
      dataType: this.dataType,
      visibility: this.visibility,
      defaultValue: this.defaultValue,
      isStatic: this.isStatic,
    };
  }
}
