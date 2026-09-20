export class IDEF9Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDEF9Error';
  }
}

export class ConstraintNotFoundError extends IDEF9Error {
  constructor(id: string) {
    super(`Constraint with ID "${id}" was not found.`);
  }
}

export class ControlledObjectNotFoundError extends IDEF9Error {
  constructor(id: string) {
    super(`Controlled object with ID "${id}" was not found.`);
  }
}

export class EnforcementMechanismNotFoundError extends IDEF9Error {
  constructor(id: string) {
    super(`Enforcement mechanism with ID "${id}" was not found.`);
  }
}

export class SourceDocumentNotFoundError extends IDEF9Error {
  constructor(id: string) {
    super(`Source document with ID "${id}" was not found.`);
  }
}

export class LinkNotFoundError extends IDEF9Error {
  constructor(id: string) {
    super(`Link with ID "${id}" was not found.`);
  }
}

export class DiagramNotFoundError extends IDEF9Error {
  constructor(id: string) {
    super(`Diagram with ID "${id}" was not found.`);
  }
}
