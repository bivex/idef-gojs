export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityId: string) {
    super(`Entity with ID "${entityId}" not found in model.`);
    this.name = 'EntityNotFoundError';
  }
}

export class RelationshipNotFoundError extends DomainError {
  constructor(relationshipId: string) {
    super(`Relationship with ID "${relationshipId}" not found in model.`);
    this.name = 'RelationshipNotFoundError';
  }
}

export class InvalidIDEF1RuleError extends DomainError {
  constructor(ruleName: string, reason: string) {
    super(`IDEF1/IDEF1X Rule Violation [${ruleName}]: ${reason}`);
    this.name = 'InvalidIDEF1RuleError';
  }
}
