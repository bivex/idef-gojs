import { JunctionKind, SyncType, JunctionDirection } from '../../domain/models/JunctionType';
import { LinkType } from '../../domain/models/Link';
import { ReferentType } from '../../domain/models/Referent';

export interface UOBDTO {
  id: string;
  name: string;
  nodeNumber: string;
  uobNumber: string;
  hasDecomposition: boolean;
  dNumber?: string;
  x: number;
  y: number;
}

export interface JunctionDTO {
  id: string;
  kind: JunctionKind;
  syncType: SyncType;
  direction: JunctionDirection;
  junctionNumber: string;
  x: number;
  y: number;
}

export interface LinkDTO {
  id: string;
  sourceId: string;
  targetId: string;
  type: LinkType;
  label?: string;
}

export interface ReferentDTO {
  id: string;
  name: string;
  type: ReferentType;
  locator?: string;
  x: number;
  y: number;
}

export interface DiagramDTO {
  id: string;
  scenarioNumber: string;
  title: string;
  parentDiagramId?: string;
  parentUOBId?: string;
  uobs: UOBDTO[];
  junctions: JunctionDTO[];
  links: LinkDTO[];
  referents: ReferentDTO[];
}

export interface ModelDTO {
  id: string;
  name: string;
  rootDiagramId: string;
  activeDiagramId: string;
  diagrams: DiagramDTO[];
}
