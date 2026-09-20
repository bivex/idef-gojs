import { IDEF10Model } from '../../../domain/models/IDEF10Model';

export interface IIDEF10ModelRepositoryPort {
  findById(id: string): Promise<IDEF10Model | null>;
  save(model: IDEF10Model): Promise<void>;
  delete(id: string): Promise<void>;
}
