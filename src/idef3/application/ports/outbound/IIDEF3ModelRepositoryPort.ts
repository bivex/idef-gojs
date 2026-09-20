import { IDEF3Model } from '../../../domain/models/IDEF3Model';

export interface IIDEF3ModelRepositoryPort {
  save(model: IDEF3Model): Promise<void>;
  findById(id: string): Promise<IDEF3Model | null>;
  delete(id: string): Promise<void>;
}
