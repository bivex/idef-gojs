export class IDEF5Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDEF5Error';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class KindNotFoundError extends IDEF5Error {
  constructor(kindId: string) {
    super(`IDEF5 Kind with ID "${kindId}" not found.`);
    this.name = 'KindNotFoundError';
  }
}

export class RelationNotFoundError extends IDEF5Error {
  constructor(relId: string) {
    super(`IDEF5 Relation with ID "${relId}" not found.`);
    this.name = 'RelationNotFoundError';
  }
}

export class DiagramNotFoundError extends IDEF5Error {
  constructor(diagId: string) {
    super(`IDEF5 Schematic with ID "${diagId}" not found.`);
    this.name = 'DiagramNotFoundError';
  }
}
