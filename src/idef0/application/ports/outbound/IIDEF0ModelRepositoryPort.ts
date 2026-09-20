import { IDEF0Model } from '../../../domain/models/IDEF0Model';

export interface IIDEF0ModelRepositoryPort {
  save(model: IDEF0Model): Promise<void>;
  findById(id: string): Promise<IDEF0Model | null>;
  delete(id: string): Promise<void>;
}
