import { DiagramDTO } from '../../dtos/IDEF8DTO';

export type IDEF8SelectionCallback = (elementId: string, elementType: 'screen' | 'userAction' | 'systemResponse' | 'userRole' | 'link') => void;

export interface IIDEF8DiagramRendererPort {
  initialize(container: HTMLElement | string): void;
  renderDiagram(diagram: DiagramDTO): void;
  autoLayout(): void;
  zoomToFit(): void;
  onSelectionChanged(callback: IDEF8SelectionCallback): void;
  destroy(): void;
}
