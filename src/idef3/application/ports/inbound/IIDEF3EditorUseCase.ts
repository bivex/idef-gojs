import type { UOBDTO, JunctionDTO, LinkDTO, ReferentDTO, DiagramDTO, ModelDTO } from '../../dtos/IDEF3DTO';
import { JunctionKind, SyncType, JunctionDirection } from '../../../domain/models/JunctionType';
import { LinkType } from '../../../domain/models/Link';
import { ReferentType } from '../../../domain/models/Referent';
import type { IDEF3ValidationIssue } from '../../../domain/rules/IDEF3Rules';

export interface CreateUOBCommand {
  name: string;
  nodeNumber?: string;
  uobNumber?: string;
  x?: number;
  y?: number;
}

export interface CreateJunctionCommand {
  kind: JunctionKind;
  syncType?: SyncType;
  direction?: JunctionDirection;
  junctionNumber?: string;
  x?: number;
  y?: number;
}

export interface CreateLinkCommand {
  sourceId: string;
  targetId: string;
  type?: LinkType;
  label?: string;
}

export interface CreateReferentCommand {
  name: string;
  type: ReferentType;
  locator?: string;
  x?: number;
  y?: number;
}

export interface DecomposeUOBCommand {
  parentUOBId: string;
  childScenarioNumber: string;
  childTitle: string;
  uobs?: CreateUOBCommand[];
}

export interface IIDEF3EditorUseCase {
  createModel(id: string, name: string): void;
  loadModel(modelId: string): Promise<ModelDTO>;
  saveModel(): Promise<void>;

  getActiveDiagram(): DiagramDTO;
  setActiveDiagram(diagramId: string): void;
  drillDown(uobId: string): boolean;
  drillUp(): boolean;

  addUOB(command: CreateUOBCommand): UOBDTO;
  updateUOB(uobId: string, name: string): void;
  removeUOB(uobId: string): void;

  addJunction(command: CreateJunctionCommand): JunctionDTO;
  removeJunction(junctionId: string): void;

  addLink(command: CreateLinkCommand): LinkDTO;
  removeLink(linkId: string): void;

  addReferent(command: CreateReferentCommand): ReferentDTO;
  removeReferent(referentId: string): void;

  decomposeUOB(command: DecomposeUOBCommand): DiagramDTO;

  validateCurrentDiagram(): IDEF3ValidationIssue[];
  autoLayout(): void;
  exportJSON(): string;
  importJSON(jsonString: string): void;
}
