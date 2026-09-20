import { Position } from '../../../domain/models/Position';

export enum OrgUnitType {
  DIVISION = 'DIVISION',       // Дирекция / Дивизион / Филиал
  DEPARTMENT = 'DEPARTMENT',   // Управление / Отдел / Служба
  WORKSHOP = 'WORKSHOP',       // Производственный цех
  LABORATORY = 'LABORATORY',   // Лаборатория / Исследовательское бюро
  BRIGADE = 'BRIGADE',         // Производственный участок / Бригада
  EXTERNAL = 'EXTERNAL',       // Внешний контрагент / Партнёр / Субподрядчик
}

export interface IDEF12OrgUnitProps {
  id?: string;
  code: string;
  name: string;
  unitType?: OrgUnitType;
  headPositionName?: string;
  headCount?: number;
  location?: string;
  x?: number;
  y?: number;
}

export class IDEF12OrgUnit {
  public readonly id: string;
  public code: string;
  public name: string;
  public unitType: OrgUnitType;
  public headPositionName?: string;
  public headCount: number;
  public location?: string;
  public position: Position;

  constructor(props: IDEF12OrgUnitProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('OrgUnit code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('OrgUnit name cannot be empty.');
    }

    this.id = props.id || `ou-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.code = props.code.trim();
    this.name = props.name.trim();
    this.unitType = props.unitType || OrgUnitType.DEPARTMENT;
    this.headPositionName = props.headPositionName?.trim();
    this.headCount = typeof props.headCount === 'number' ? props.headCount : 0;
    this.location = props.location?.trim();
    this.position = new Position(props.x ?? 0, props.y ?? 0);
  }

  public toJSON(): IDEF12OrgUnitProps & { id: string; x: number; y: number } {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      unitType: this.unitType,
      headPositionName: this.headPositionName,
      headCount: this.headCount,
      location: this.location,
      x: this.position.x,
      y: this.position.y,
    };
  }

  public static fromJSON(json: any): IDEF12OrgUnit {
    return new IDEF12OrgUnit({
      id: json.id,
      code: json.code,
      name: json.name,
      unitType: json.unitType,
      headPositionName: json.headPositionName,
      headCount: json.headCount,
      location: json.location,
      x: json.x,
      y: json.y,
    });
  }
}
