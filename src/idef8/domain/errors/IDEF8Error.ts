export class IDEF8Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDEF8Error';
  }
}

export class ScreenNotFoundError extends IDEF8Error {
  constructor(id: string) {
    super(`Screen with ID "${id}" was not found.`);
  }
}

export class UserActionNotFoundError extends IDEF8Error {
  constructor(id: string) {
    super(`User action with ID "${id}" was not found.`);
  }
}

export class SystemResponseNotFoundError extends IDEF8Error {
  constructor(id: string) {
    super(`System response with ID "${id}" was not found.`);
  }
}

export class UserRoleNotFoundError extends IDEF8Error {
  constructor(id: string) {
    super(`User role with ID "${id}" was not found.`);
  }
}

export class LinkNotFoundError extends IDEF8Error {
  constructor(id: string) {
    super(`Link with ID "${id}" was not found.`);
  }
}

export class DiagramNotFoundError extends IDEF8Error {
  constructor(id: string) {
    super(`Diagram with ID "${id}" was not found.`);
  }
}
