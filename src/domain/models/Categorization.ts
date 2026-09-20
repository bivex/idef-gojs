export interface CategorizationProps {
  id: string;
  genericEntityId: string;
  discriminatorAttributeName: string;
  specificEntityIds: string[];
  isComplete?: boolean; // Complete (double line under circle) or Incomplete (single line)
}

export class CategorizationCluster {
  public readonly id: string;
  public readonly genericEntityId: string;
  private _discriminatorAttributeName: string;
  private _specificEntityIds: Set<string>;
  private _isComplete: boolean;

  constructor(props: CategorizationProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Categorization ID cannot be empty.');
    }
    if (!props.genericEntityId) {
      throw new Error('Categorization must have a generic (supertype) entity.');
    }

    this.id = props.id;
    this.genericEntityId = props.genericEntityId;
    this._discriminatorAttributeName = props.discriminatorAttributeName || '';
    this._specificEntityIds = new Set(props.specificEntityIds || []);
    this._isComplete = props.isComplete ?? false;
  }

  public get discriminatorAttributeName(): string {
    return this._discriminatorAttributeName;
  }

  public get specificEntityIds(): string[] {
    return Array.from(this._specificEntityIds);
  }

  public get isComplete(): boolean {
    return this._isComplete;
  }

  public setDiscriminator(name: string): void {
    this._discriminatorAttributeName = name;
  }

  public setComplete(isComplete: boolean): void {
    this._isComplete = isComplete;
  }

  public addSpecificEntity(entityId: string): void {
    this._specificEntityIds.add(entityId);
  }

  public removeSpecificEntity(entityId: string): void {
    this._specificEntityIds.delete(entityId);
  }

  public toJSON() {
    return {
      id: this.id,
      genericEntityId: this.genericEntityId,
      discriminatorAttributeName: this.discriminatorAttributeName,
      specificEntityIds: this.specificEntityIds,
      isComplete: this.isComplete,
    };
  }
}
