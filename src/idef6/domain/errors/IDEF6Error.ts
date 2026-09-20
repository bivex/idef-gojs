export class IDEF6Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDEF6Error';
  }
}

export class IssueNotFoundError extends IDEF6Error {
  constructor(id: string) {
    super(`Issue with ID "${id}" was not found.`);
  }
}

export class AlternativeNotFoundError extends IDEF6Error {
  constructor(id: string) {
    super(`Alternative with ID "${id}" was not found.`);
  }
}

export class CriterionNotFoundError extends IDEF6Error {
  constructor(id: string) {
    super(`Criterion with ID "${id}" was not found.`);
  }
}

export class ArgumentNotFoundError extends IDEF6Error {
  constructor(id: string) {
    super(`Argument with ID "${id}" was not found.`);
  }
}

export class LinkNotFoundError extends IDEF6Error {
  constructor(id: string) {
    super(`Link with ID "${id}" was not found.`);
  }
}

export class DiagramNotFoundError extends IDEF6Error {
  constructor(id: string) {
    super(`Diagram with ID "${id}" was not found.`);
  }
}
