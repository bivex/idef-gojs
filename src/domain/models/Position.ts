export class Position {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error(`Invalid position coordinates: (${x}, ${y})`);
    }
  }

  public static origin(): Position {
    return new Position(0, 0);
  }

  public moveBy(dx: number, dy: number): Position {
    return new Position(this.x + dx, this.y + dy);
  }

  public equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public toJSON(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
