import type { DiagramDTO } from '../../dtos/IDEF3DTO';

export interface IDEF3SelectionCallback {
  onUOBSelected?: (uobId: string) => void;
  onUOBDoubleClicked?: (uobId: string) => void;
  onJunctionSelected?: (junctionId: string) => void;
  onLinkSelected?: (linkId: string) => void;
  onReferentSelected?: (referentId: string) => void;
}

export interface IIDEF3DiagramRendererPort {
  initialize(containerElement: HTMLElement | string): void;
  render(diagram: DiagramDTO): void;
  setSelectionListeners(callbacks: IDEF3SelectionCallback): void;
  autoLayout(): void;
  zoomToFit(): void;
  destroy(): void;
}
