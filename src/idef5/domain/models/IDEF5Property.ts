export interface IDEF5PropertyProps {
  name: string;
  dataType?: string;
  valueType?: string;
  isMandatory?: boolean;
  defaultValue?: string;
  value?: string;
  description?: string;
}

export class IDEF5Property {
  public readonly name: string;
  public readonly dataType: string;
  public readonly valueType: string;
  public readonly isMandatory: boolean;
  public readonly defaultValue?: string;
  public readonly value?: string;
  public readonly description?: string;

  constructor(props: IDEF5PropertyProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Property name cannot be empty.');
    }
    this.name = props.name.trim();
    const type = props.valueType || props.dataType || 'string';
    this.dataType = type;
    this.valueType = type;
    this.isMandatory = props.isMandatory ?? false;
    this.defaultValue = props.defaultValue;
    this.value = props.value ?? props.defaultValue;
    this.description = props.description;
  }

  public toString(): string {
    const val = this.value ? ` = ${this.value}` : '';
    const req = this.isMandatory ? '*' : '';
    return `${this.name}${req}: ${this.valueType}${val}`;
  }

  public toJSON() {
    return {
      name: this.name,
      dataType: this.dataType,
      valueType: this.valueType,
      isMandatory: this.isMandatory,
      defaultValue: this.defaultValue,
      value: this.value,
      description: this.description,
    };
  }
}
