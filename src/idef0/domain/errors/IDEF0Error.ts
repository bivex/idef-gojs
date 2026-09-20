export class IDEF0Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDEF0Error';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ActivityNotFoundError extends IDEF0Error {
  constructor(activityId: string) {
    super(`IDEF0 Activity with ID "${activityId}" not found.`);
    this.name = 'ActivityNotFoundError';
  }
}

export class ArrowNotFoundError extends IDEF0Error {
  constructor(arrowId: string) {
    super(`IDEF0 Arrow with ID "${arrowId}" not found.`);
    this.name = 'ArrowNotFoundError';
  }
}

export class DiagramNotFoundError extends IDEF0Error {
  constructor(diagramId: string) {
    super(`IDEF0 Diagram with ID "${diagramId}" not found.`);
    this.name = 'DiagramNotFoundError';
  }
}

export class InvalidIDEF0RuleError extends IDEF0Error {
  constructor(ruleName: string, reason: string) {
    super(`IDEF0 Rule Violation [${ruleName}]: ${reason}`);
    this.name = 'InvalidIDEF0RuleError';
  }
}
