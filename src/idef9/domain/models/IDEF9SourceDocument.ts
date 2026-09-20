import { Position } from '../../../domain/models/Position';

export enum DocumentType {
  STATE_STANDARD = 'STATE_STANDARD',   // ГОСТ / ISO / DIN
  INDUSTRY_CODE = 'INDUSTRY_CODE',     // ОСТ / авиационные нормы (АР МАК, EASA)
  LAW_REGULATION = 'LAW_REGULATION',   // Федеральный закон / Трудовой кодекс / СанПиН
  FACTORY_POLICY = 'FACTORY_POLICY',   // СТП / стандарт предприятия / регламент
  CONTRACT = 'CONTRACT',               // Контракт с заказчиком / ТЗ
}

export interface IDEF9SourceDocumentProps {
  id: string;
  code: string;                        // e.g. "ГОСТ Р 53843-2010"
  name: string;
  documentType?: DocumentType;
  description?: string;
  position?: Position;
}

export class IDEF9SourceDocument {
  public readonly id: string;
  private _code: string;
  private _name: string;
  public readonly documentType: DocumentType;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF9SourceDocumentProps) {
    if (!props.id) throw new Error('SourceDocument ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('SourceDocument name cannot be empty.');
    if (!props.code || props.code.trim().length === 0) throw new Error('SourceDocument code cannot be empty.');

    this.id = props.id;
    this._code = props.code.trim();
    this._name = props.name.trim();
    this.documentType = props.documentType || DocumentType.STATE_STANDARD;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get code(): string {
    return this._code;
  }

  public setCode(code: string): void {
    if (!code || code.trim().length === 0) throw new Error('SourceDocument code cannot be empty.');
    this._code = code.trim();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('SourceDocument name cannot be empty.');
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
      code: this._code,
      name: this._name,
      documentType: this.documentType,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
