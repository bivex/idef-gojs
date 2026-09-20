import { DiagramDTO } from '../../dtos/IDEF10DTO';

export type IDEF10SelectionCallback = (
  elementId: string,
  elementType: 'component' | 'executionNode' | 'interface' | 'artifact' | 'link'
) => void;

export interface IIDEF10DiagramRendererPort {
  initialize(container: HTMLElement | string): void;
  renderDiagram(diagram: DiagramDTO): void;
  autoLayout(): void;
  zoomToFit(): void;
  onSelectionChanged(callback: IDEF10SelectionCallback): void;
  destroy(): void;
}
