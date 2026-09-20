import { Position } from '../../../domain/models/Position';

export enum ConstraintType {
  TECHNICAL = 'TECHNICAL',     // Физические / технические / технологические параметры
  REGULATORY = 'REGULATORY',   // Отраслевые стандарты, ГОСТ, безопасность, экология
  POLICY = 'POLICY',           // Корпоративные регламенты и процедуры предприятия
  FINANCIAL = 'FINANCIAL',     // Бюджетные, стоимостные, контрактные лимиты
  TIME = 'TIME',               // Временные ограничения, SLA, директивные сроки
}

export enum ConstraintSeverity {
  MANDATORY = 'MANDATORY',     // Жесткое ограничение (Hard constraint) - нарушение блокирует операцию
  CONDITIONAL = 'CONDITIONAL', // Условное ограничение (Soft constraint) - допустимо при эскалации
  WARNING = 'WARNING',         // Предупреждение / уведомление
}

export enum ConstraintStatus {
  ACTIVE = 'ACTIVE',           // Действующее ограничение
  SUSPENDED = 'SUSPENDED',     // Временно приостановлено
  DEPRECATED = 'DEPRECATED',   // Устаревшее / аннулированное
}

export interface IDEF9ConstraintProps {
  id: string;
  code: string;                // e.g. "CR-01", "BR-104"
  name: string;
  statement: string;           // Текстовая формулировка правила / математическое выражение
  constraintType?: ConstraintType;
  severity?: ConstraintSeverity;
  status?: ConstraintStatus;
  position?: Position;
}

export class IDEF9Constraint {
  public readonly id: string;
  private _code: string;
  private _name: string;
  private _statement: string;
  public readonly constraintType: ConstraintType;
  public readonly severity: ConstraintSeverity;
  private _status: ConstraintStatus;
  private _position: Position;

  constructor(props: IDEF9ConstraintProps) {
    if (!props.id) throw new Error('Constraint ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Constraint name cannot be empty.');
    if (!props.code || props.code.trim().length === 0) throw new Error('Constraint code cannot be empty.');

    this.id = props.id;
    this._code = props.code.trim().toUpperCase();
    this._name = props.name.trim();
    this._statement = props.statement || '';
    this.constraintType = props.constraintType || ConstraintType.TECHNICAL;
    this.severity = props.severity || ConstraintSeverity.MANDATORY;
    this._status = props.status || ConstraintStatus.ACTIVE;
    this._position = props.position || Position.origin();
  }

  public get code(): string {
    return this._code;
  }

  public setCode(code: string): void {
    if (!code || code.trim().length === 0) throw new Error('Constraint code cannot be empty.');
    this._code = code.trim().toUpperCase();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Constraint name cannot be empty.');
    this._name = name.trim();
  }

  public get statement(): string {
    return this._statement;
  }

  public setStatement(stmt: string): void {
    this._statement = stmt;
  }

  public get status(): ConstraintStatus {
    return this._status;
  }

  public setStatus(status: ConstraintStatus): void {
    this._status = status;
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
      code: this._code,
      name: this._name,
      statement: this._statement,
      constraintType: this.constraintType,
      severity: this.severity,
      status: this._status,
      position: this._position.toJSON(),
    };
  }
}
