import { DiagramDTO } from '../../dtos/IDEF0DTO';

export interface DiagramSelectionCallback {
  onActivitySelected?: (activityId: string) => void;
  onActivityDoubleClicked?: (activityId: string) => void;
  onArrowSelected?: (arrowId: string) => void;
}

export interface IIDEF0DiagramRendererPort {
  initialize(containerElement: HTMLElement | string): void;
  render(diagram: DiagramDTO): void;
  setSelectionListeners(callbacks: DiagramSelectionCallback): void;
  autoLayout(): void;
  zoomToFit(): void;
  destroy(): void;
}
