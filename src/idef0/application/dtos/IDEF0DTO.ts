import { ICOMType, TunnelType } from '../../domain/models/ICOMType';

export interface ActivityDTO {
  id: string;
  name: string;
  nodeNumber: string;
  detailNumber: number;
  dNumber?: string;
  hasDecomposition: boolean;
  x: number;
  y: number;
}

export interface ArrowDTO {
  id: string;
  name: string;
  sourceActivityId?: string;
  targetActivityId?: string;
  icomType: ICOMType;
  tunnel?: TunnelType;
  cNumber?: string;
}

export interface DiagramDTO {
  id: string;
  nodeNumber: string;
  title: string;
  parentDiagramId?: string;
  parentActivityId?: string;
  activities: ActivityDTO[];
  arrows: ArrowDTO[];
}

export interface ModelDTO {
  id: string;
  name: string;
  activeDiagramId: string;
  rootDiagramId: string;
  diagrams: DiagramDTO[];
}
