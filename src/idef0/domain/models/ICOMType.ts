/**
 * ICOM Type according to IDEF0 (FIPS PUB 183):
 * - INPUT (I): Enters from the LEFT. Transformed into output.
 * - CONTROL (C): Enters from the TOP. Guides or constrains operation.
 * - OUTPUT (O): Exits from the RIGHT. Result of the activity.
 * - MECHANISM (M): Enters from the BOTTOM. Resources, tools, people, software.
 * - CALL: Exits from BOTTOM pointing downwards. Refers to another model/mechanism.
 */
export enum ICOMType {
  INPUT = 'INPUT',
  CONTROL = 'CONTROL',
  OUTPUT = 'OUTPUT',
  MECHANISM = 'MECHANISM',
  CALL = 'CALL',
}

export enum TunnelType {
  NONE = 'NONE',
  AT_SOURCE = 'AT_SOURCE',   // Arrow tunneled at source (hidden in parent diagram)
  AT_TARGET = 'AT_TARGET',   // Arrow tunneled at target (hidden in child diagram)
  BOTH = 'BOTH',
}
