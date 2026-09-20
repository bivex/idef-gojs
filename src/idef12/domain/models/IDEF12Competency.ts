import { Position } from '../../../domain/models/Position';

export enum CompetencyCriticality {
  MANDATORY_LEGAL = 'MANDATORY_LEGAL', // Требование закона / Государственная аттестация
  SAFETY_CRITICAL = 'SAFETY_CRITICAL', // Критично для промышленной и радиационной безопасности
  TECHNICAL_SKILL = 'TECHNICAL_SKILL', // Производственно-технологический навык
}

export interface IDEF12CompetencyProps {
  id?: string;
  code: string;
  name: string;
  criticality?: CompetencyCriticality;
  certificationBody?: string;
  validityMonths?: number;
  x?: number;
  y?: number;
}

export class IDEF12Competency {
  public readonly id: string;
  public code: string;
  public name: string;
  public criticality: CompetencyCriticality;
  public certificationBody?: string;
  public validityMonths?: number;
  public position: Position;

  constructor(props: IDEF12CompetencyProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Competency code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Competency name cannot be empty.');
    }

    this.id = props.id || `comp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.code = props.code.trim();
    this.name = props.name.trim();
    this.criticality = props.criticality || CompetencyCriticality.TECHNICAL_SKILL;
    this.certificationBody = props.certificationBody?.trim();
    this.validityMonths = props.validityMonths;
    this.position = new Position(props.x ?? 0, props.y ?? 0);
  }

  public toJSON(): IDEF12CompetencyProps & { id: string; x: number; y: number } {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      criticality: this.criticality,
      certificationBody: this.certificationBody,
      validityMonths: this.validityMonths,
      x: this.position.x,
      y: this.position.y,
    };
  }

  public static fromJSON(json: any): IDEF12Competency {
    return new IDEF12Competency({
      id: json.id,
      code: json.code,
      name: json.name,
      criticality: json.criticality,
      certificationBody: json.certificationBody,
      validityMonths: json.validityMonths,
      x: json.x,
      y: json.y,
    });
  }
}
