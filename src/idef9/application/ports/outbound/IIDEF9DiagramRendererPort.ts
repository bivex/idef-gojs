import { DiagramDTO } from '../../dtos/IDEF9DTO';

export type IDEF9SelectionCallback = (elementId: string, elementType: 'constraint' | 'controlledObject' | 'enforcementMechanism' | 'sourceDocument' | 'link') => void;

export interface IIDEF9DiagramRendererPort {
  initialize(container: HTMLElement | string): void;
  renderDiagram(diagram: DiagramDTO): void;
  autoLayout(): void;
  zoomToFit(): void;
  onSelectionChanged(callback: IDEF9SelectionCallback): void;
  destroy(): void;
}
