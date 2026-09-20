import { IDEF6Model } from '../../../domain/models/IDEF6Model';

export interface IIDEF6ModelRepositoryPort {
  save(model: IDEF6Model): Promise<void>;
  findById(id: string): Promise<IDEF6Model | null>;
  delete(id: string): Promise<void>;
}
