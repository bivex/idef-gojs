import { IDEF12Model } from '../../../domain/models/IDEF12Model';

export interface IIDEF12ModelRepositoryPort {
  save(model: IDEF12Model): Promise<void>;
  findById(id: string): Promise<IDEF12Model | null>;
}
