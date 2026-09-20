import type { DiagramDTO } from '../../dtos/IDEF5DTO';

export interface IDEF5SelectionCallback {
  onKindSelected?: (kindId: string) => void;
  onRelationSelected?: (relationId: string) => void;
}

export interface IIDEF5DiagramRendererPort {
  initialize(containerElement: HTMLElement | string): void;
  render(diagram: DiagramDTO): void;
  setSelectionListeners(callbacks: IDEF5SelectionCallback): void;
  autoLayout(): void;
  zoomToFit(): void;
  destroy(): void;
}
