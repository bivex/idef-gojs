import { IDEF12Diagram } from '../../../domain/models/IDEF12Diagram';

export interface IIDEF12DiagramRendererPort {
  renderDiagram(diagram: IDEF12Diagram): void;
  clear(): void;
  autoLayout(): void;
  zoomToFit(): void;
  exportSVG(): string;
  destroy(): void;
}
