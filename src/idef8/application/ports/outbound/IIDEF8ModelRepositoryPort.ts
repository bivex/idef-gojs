import { IDEF8Model } from '../../../domain/models/IDEF8Model';

export interface IIDEF8ModelRepositoryPort {
  save(model: IDEF8Model): Promise<void>;
  findById(id: string): Promise<IDEF8Model | null>;
}
