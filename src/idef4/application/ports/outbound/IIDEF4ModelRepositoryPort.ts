import { IDEF4Model } from '../../../domain/models/IDEF4Model';

export interface IIDEF4ModelRepositoryPort {
  save(model: IDEF4Model): Promise<void>;
  findById(id: string): Promise<IDEF4Model | null>;
  delete(id: string): Promise<void>;
}
