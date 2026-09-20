export class IDEF12Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDEF12Error';
  }
}

export class IDEF12ValidationError extends IDEF12Error {
  public readonly code: string;
  public readonly severity: 'ERROR' | 'WARNING';

  constructor(code: string, message: string, severity: 'ERROR' | 'WARNING' = 'ERROR') {
    super(`[${code}] ${message}`);
    this.name = 'IDEF12ValidationError';
    this.code = code;
    this.severity = severity;
  }
}
