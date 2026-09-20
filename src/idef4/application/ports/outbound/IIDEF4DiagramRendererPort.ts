import type { DiagramDTO } from '../../dtos/IDEF4DTO';

export interface IDEF4SelectionCallback {
  onClassSelected?: (classId: string) => void;
  onRelationshipSelected?: (relationshipId: string) => void;
}

export interface IIDEF4DiagramRendererPort {
  initialize(containerElement: HTMLElement | string): void;
  render(diagram: DiagramDTO): void;
  setSelectionListeners(callbacks: IDEF4SelectionCallback): void;
  autoLayout(): void;
  zoomToFit(): void;
  destroy(): void;
}
