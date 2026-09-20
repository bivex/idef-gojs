export class IDEF10Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDEF10Error';
  }
}

export class ComponentNotFoundError extends IDEF10Error {
  constructor(id: string) {
    super(`Component with ID "${id}" was not found.`);
    this.name = 'ComponentNotFoundError';
  }
}

export class ExecutionNodeNotFoundError extends IDEF10Error {
  constructor(id: string) {
    super(`ExecutionNode with ID "${id}" was not found.`);
    this.name = 'ExecutionNodeNotFoundError';
  }
}

export class InterfaceNotFoundError extends IDEF10Error {
  constructor(id: string) {
    super(`Interface with ID "${id}" was not found.`);
    this.name = 'InterfaceNotFoundError';
  }
}

export class ArtifactNotFoundError extends IDEF10Error {
  constructor(id: string) {
    super(`Artifact with ID "${id}" was not found.`);
    this.name = 'ArtifactNotFoundError';
  }
}
