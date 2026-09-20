export class IDEF4Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDEF4Error';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ClassNotFoundError extends IDEF4Error {
  constructor(classId: string) {
    super(`IDEF4 Class with ID "${classId}" not found.`);
    this.name = 'ClassNotFoundError';
  }
}

export class RelationshipNotFoundError extends IDEF4Error {
  constructor(relId: string) {
    super(`IDEF4 Relationship with ID "${relId}" not found.`);
    this.name = 'RelationshipNotFoundError';
  }
}

export class DiagramNotFoundError extends IDEF4Error {
  constructor(diagId: string) {
    super(`IDEF4 Diagram with ID "${diagId}" not found.`);
    this.name = 'DiagramNotFoundError';
  }
}
