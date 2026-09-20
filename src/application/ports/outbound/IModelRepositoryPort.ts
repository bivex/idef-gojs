import { IDEF1Model } from '../../../domain/models/IDEF1Model';

export interface IModelRepositoryPort {
  save(model: IDEF1Model): Promise<void>;
  findById(id: string): Promise<IDEF1Model | null>;
  delete(id: string): Promise<void>;
}
