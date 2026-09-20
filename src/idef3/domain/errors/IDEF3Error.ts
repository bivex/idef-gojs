export class IDEF3Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDEF3Error';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UOBNotFoundError extends IDEF3Error {
  constructor(uobId: string) {
    super(`IDEF3 UOB with ID "${uobId}" not found.`);
    this.name = 'UOBNotFoundError';
  }
}

export class JunctionNotFoundError extends IDEF3Error {
  constructor(junctionId: string) {
    super(`IDEF3 Junction with ID "${junctionId}" not found.`);
    this.name = 'JunctionNotFoundError';
  }
}

export class LinkNotFoundError extends IDEF3Error {
  constructor(linkId: string) {
    super(`IDEF3 Link with ID "${linkId}" not found.`);
    this.name = 'LinkNotFoundError';
  }
}

export class ReferentNotFoundError extends IDEF3Error {
  constructor(referentId: string) {
    super(`IDEF3 Referent with ID "${referentId}" not found.`);
    this.name = 'ReferentNotFoundError';
  }
}

export class DiagramNotFoundError extends IDEF3Error {
  constructor(diagramId: string) {
    super(`IDEF3 Scenario/Diagram with ID "${diagramId}" not found.`);
    this.name = 'DiagramNotFoundError';
  }
}
