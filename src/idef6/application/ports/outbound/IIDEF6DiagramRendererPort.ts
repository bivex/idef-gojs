import type { DiagramDTO } from '../../dtos/IDEF6DTO';

export interface IDEF6SelectionCallback {
  onElementSelected?: (id: string, category: 'issue' | 'alternative' | 'criterion' | 'argument') => void;
  onLinkSelected?: (linkId: string) => void;
}

export interface IIDEF6DiagramRendererPort {
  initialize(containerElement: HTMLElement | string): void;
  render(diagram: DiagramDTO): void;
  setSelectionListeners(callbacks: IDEF6SelectionCallback): void;
  autoLayout(): void;
  zoomToFit(): void;
  destroy(): void;
}
