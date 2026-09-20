import { Position } from '../../../domain/models/Position';

export enum PositionLevel {
  EXECUTIVE = 'EXECUTIVE',     // Высшее руководство / Топ-менеджмент
  MANAGEMENT = 'MANAGEMENT',   // Линейные руководители / Начальники
  ENGINEER = 'ENGINEER',       // Главные специалисты / Инженеры / Технологи
  OPERATOR = 'OPERATOR',       // Производственный персонал / Операторы
}

export interface IDEF12PositionProps {
  id?: string;
  code: string;
  name: string;
  positionLevel?: PositionLevel;
  responsibilities?: string[];
  grade?: string;
  x?: number;
  y?: number;
}

export class IDEF12Position {
  public readonly id: string;
  public code: string;
  public name: string;
  public positionLevel: PositionLevel;
  public responsibilities: string[];
  public grade?: string;
  public position: Position;

  constructor(props: IDEF12PositionProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Position code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Position name cannot be empty.');
    }

    this.id = props.id || `pos-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.code = props.code.trim();
    this.name = props.name.trim();
    this.positionLevel = props.positionLevel || PositionLevel.ENGINEER;
    this.responsibilities = Array.isArray(props.responsibilities) ? [...props.responsibilities] : [];
    this.grade = props.grade?.trim();
    this.position = new Position(props.x ?? 0, props.y ?? 0);
  }

  public toJSON(): IDEF12PositionProps & { id: string; x: number; y: number } {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      positionLevel: this.positionLevel,
      responsibilities: [...this.responsibilities],
      grade: this.grade,
      x: this.position.x,
      y: this.position.y,
    };
  }

  public static fromJSON(json: any): IDEF12Position {
    return new IDEF12Position({
      id: json.id,
      code: json.code,
      name: json.name,
      positionLevel: json.positionLevel,
      responsibilities: json.responsibilities,
      grade: json.grade,
      x: json.x,
      y: json.y,
    });
  }
}
