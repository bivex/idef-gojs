/**
 * IDEF3 Junction Types according to KBSI IDEF3 Standard:
 * - AND (&): All paths must complete (Fan-in) or all paths proceed (Fan-out).
 * - OR (O): One or more paths (inclusive OR).
 * - XOR (X): Exactly one path (exclusive OR).
 *
 * Synchronicity:
 * - ASYNC (Single vertical line): Asynchronous execution.
 * - SYNC (Double vertical lines): Synchronous execution.
 */
export enum JunctionKind {
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
}

export enum SyncType {
  ASYNC = 'ASYNC',
  SYNC = 'SYNC',
}

export enum JunctionDirection {
  FAN_OUT = 'FAN_OUT', // Diverging branching
  FAN_IN = 'FAN_IN',   // Converging joining
}
