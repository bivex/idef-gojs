import { Visibility } from './IDEF4Attribute';

export interface MethodParameter {
  name: string;
  type: string;
  defaultValue?: string;
}

export interface IDEF4MethodProps {
  name: string;
  returnType?: string;
  parameters?: MethodParameter[];
  visibility?: Visibility;
  isAbstract?: boolean;
  isStatic?: boolean;
}

export class IDEF4Method {
  public readonly name: string;
  public readonly returnType: string;
  public readonly parameters: MethodParameter[];
  public readonly visibility: Visibility;
  public readonly isAbstract: boolean;
  public readonly isStatic: boolean;

  constructor(props: IDEF4MethodProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Method name cannot be empty.');
    }
    this.name = props.name.trim();
    this.returnType = props.returnType || 'void';
    this.parameters = props.parameters || [];
    this.visibility = props.visibility || 'public';
    this.isAbstract = props.isAbstract ?? false;
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
    const params = this.parameters.map((p) => `${p.name}: ${p.type}`).join(', ');
    const absPrefix = this.isAbstract ? '{abstract} ' : '';
    const staticPrefix = this.isStatic ? 'static ' : '';
    return `${this.getVisibilitySymbol()} ${absPrefix}${staticPrefix}${this.name}(${params}): ${this.returnType}`;
  }

  public toJSON() {
    return {
      name: this.name,
      returnType: this.returnType,
      parameters: this.parameters,
      visibility: this.visibility,
      isAbstract: this.isAbstract,
      isStatic: this.isStatic,
    };
  }
}
