import { ActivityDTO, ArrowDTO, DiagramDTO, ModelDTO } from '../../dtos/IDEF0DTO';
import { ICOMType, TunnelType } from '../../../domain/models/ICOMType';
import { IDEF0ValidationIssue } from '../../../domain/rules/IDEF0Rules';

export interface CreateActivityCommand {
  name: string;
  nodeNumber?: string;
  detailNumber?: number;
  x?: number;
  y?: number;
}

export interface CreateArrowCommand {
  name: string;
  sourceActivityId?: string;
  targetActivityId?: string;
  icomType: ICOMType;
  tunnel?: TunnelType;
}

export interface DecomposeActivityCommand {
  parentActivityId: string;
  childNodeNumber: string;
  childTitle: string;
  activities?: CreateActivityCommand[];
}

export interface IIDEF0EditorUseCase {
  createModel(id: string, name: string): void;
  loadModel(modelId: string): Promise<ModelDTO>;
  saveModel(): Promise<void>;

  getActiveDiagram(): DiagramDTO;
  setActiveDiagram(diagramId: string): void;
  drillDown(activityId: string): boolean;
  drillUp(): boolean;

  addActivity(command: CreateActivityCommand): ActivityDTO;
  updateActivity(activityId: string, name: string): void;
  removeActivity(activityId: string): void;

  addArrow(command: CreateArrowCommand): ArrowDTO;
  removeArrow(arrowId: string): void;

  decomposeActivity(command: DecomposeActivityCommand): DiagramDTO;

  validateCurrentDiagram(): IDEF0ValidationIssue[];
  autoLayout(): void;
  exportJSON(): string;
  importJSON(jsonString: string): void;
}
