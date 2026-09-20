import { Position } from '../../../domain/models/Position';

export enum MechanismType {
  AUTOMATED_PLC = 'AUTOMATED_PLC',       // Аппаратная / ПЛК блокировка привода/станка
  SOFTWARE_RULE = 'SOFTWARE_RULE',       // Программная валидация в MES / SCADA
  QUALITY_INSPECTION = 'QUALITY_INSPECTION', // Ручной контроль ОТК / дефектоскопия
  DIGITAL_SIGNATURE = 'DIGITAL_SIGNATURE',   // ЭЦП мастера / главного металлурга
  ERP_AUDIT = 'ERP_AUDIT',               // Финансовый аудит / проводка в 1C/SAP
}

export interface IDEF9EnforcementMechanismProps {
  id: string;
  name: string;
  mechanismType?: MechanismType;
  description?: string;
  position?: Position;
}

export class IDEF9EnforcementMechanism {
  public readonly id: string;
  private _name: string;
  public readonly mechanismType: MechanismType;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF9EnforcementMechanismProps) {
    if (!props.id) throw new Error('EnforcementMechanism ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('EnforcementMechanism name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.mechanismType = props.mechanismType || MechanismType.SOFTWARE_RULE;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('EnforcementMechanism name cannot be empty.');
    this._name = name.trim();
  }

  public get description(): string | undefined {
    return this._description;
  }

  public setDescription(desc?: string): void {
    this._description = desc;
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this._name,
      mechanismType: this.mechanismType,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
