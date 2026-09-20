import { IDEF5Model } from '../../../domain/models/IDEF5Model';

export interface IIDEF5ModelRepositoryPort {
  save(model: IDEF5Model): Promise<void>;
  findById(id: string): Promise<IDEF5Model | null>;
  delete(id: string): Promise<void>;
}
