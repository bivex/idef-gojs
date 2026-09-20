import { IDEF9Model } from '../../../domain/models/IDEF9Model';

export interface IIDEF9ModelRepositoryPort {
  save(model: IDEF9Model): Promise<void>;
  findById(id: string): Promise<IDEF9Model | null>;
}
