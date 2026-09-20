import { Position } from '../../../domain/models/Position';

export enum ReferentType {
  SCENARIO = 'SCENARIO',       // Link to another process scenario
  UOB = 'UOB',                 // Link to another Unit of Behavior
  OBJECT_STATE = 'OBJECT_STATE', // State of an object, e.g. [Деталь: Закалена]
  NOTE = 'NOTE',               // Elaboration note
  GOTO = 'GOTO',               // Unconditional branch / loop back
}

export interface ReferentProps {
  id: string;
  name: string;
  type: ReferentType;
  locator?: string; // Reference target ID or code
  position?: Position;
}

export class Referent {
  public readonly id: string;
  private _name: string;
  private _type: ReferentType;
  private _locator?: string;
  private _position: Position;

  constructor(props: ReferentProps) {
    if (!props.id) throw new Error('Referent ID cannot be empty.');
    this.id = props.id;
    this._name = props.name || 'Referent';
    this._type = props.type;
    this._locator = props.locator;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public get type(): ReferentType {
    return this._type;
  }

  public get locator(): string | undefined {
    return this._locator;
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      locator: this.locator,
      position: this.position.toJSON(),
    };
  }
}
