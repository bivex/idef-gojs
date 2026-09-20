import {
  IIDEF0EditorUseCase,
  CreateActivityCommand,
  CreateArrowCommand,
  DecomposeActivityCommand,
} from '../ports/inbound/IIDEF0EditorUseCase';
import { IIDEF0DiagramRendererPort } from '../ports/outbound/IIDEF0DiagramRendererPort';
import { IIDEF0ModelRepositoryPort } from '../ports/outbound/IIDEF0ModelRepositoryPort';
import { IIDEF0EventPublisherPort } from '../ports/outbound/IIDEF0EventPublisherPort';
import { ActivityDTO, ArrowDTO, DiagramDTO, ModelDTO } from '../dtos/IDEF0DTO';
import { IDEF0Model } from '../../domain/models/IDEF0Model';
import { IDEF0Diagram } from '../../domain/models/IDEF0Diagram';
import { Activity } from '../../domain/models/Activity';
import { Arrow } from '../../domain/models/Arrow';
import { Position } from '../../../domain/models/Position';
import { IDEF0Rules, IDEF0ValidationIssue } from '../../domain/rules/IDEF0Rules';
import {
  ActivityAddedEvent,
  ActivityRemovedEvent,
  ArrowAddedEvent,
  ArrowRemovedEvent,
  DiagramChangedEvent,
  ActivityDecomposedEvent,
} from '../../domain/events/IDEF0Events';

export class IDEF0ApplicationService implements IIDEF0EditorUseCase {
  private _model: IDEF0Model;

  constructor(
    private readonly _renderer: IIDEF0DiagramRendererPort,
    private readonly _repository?: IIDEF0ModelRepositoryPort,
    private readonly _eventPublisher?: IIDEF0EventPublisherPort
  ) {
    // Default initial model
    this._model = new IDEF0Model({
      id: 'default-model',
      name: 'Default IDEF0 Model',
    });
  }

  public get model(): IDEF0Model {
    return this._model;
  }

  public createModel(id: string, name: string): void {
    this._model = new IDEF0Model({ id, name });
    this.syncRenderer();
  }

  public async loadModel(modelId: string): Promise<ModelDTO> {
    if (!this._repository) throw new Error('Repository port not provided');
    const loaded = await this._repository.findById(modelId);
    if (!loaded) throw new Error(`Model ${modelId} not found`);
    this._model = loaded;
    this.syncRenderer();
    return this.toModelDTO(this._model);
  }

  public async saveModel(): Promise<void> {
    if (this._repository) {
      await this._repository.save(this._model);
    }
  }

  public getActiveDiagram(): DiagramDTO {
    return this.toDiagramDTO(this._model.activeDiagram);
  }

  public setActiveDiagram(diagramId: string): void {
    this._model.setActiveDiagram(diagramId);
    this._eventPublisher?.publish(new DiagramChangedEvent(diagramId));
    this.syncRenderer();
  }

  public drillDown(activityId: string): boolean {
    const child = this._model.drillDown(activityId);
    if (child) {
      this._eventPublisher?.publish(new DiagramChangedEvent(child.id));
      this.syncRenderer();
      return true;
    }
    return false;
  }

  public drillUp(): boolean {
    const parent = this._model.drillUp();
    if (parent) {
      this._eventPublisher?.publish(new DiagramChangedEvent(parent.id));
      this.syncRenderer();
      return true;
    }
    return false;
  }

  public addActivity(command: CreateActivityCommand): ActivityDTO {
    const diag = this._model.activeDiagram;
    const count = diag.activities.length;
    const detailNum = command.detailNumber ?? (count + 1);
    const nodeNum = command.nodeNumber ?? (diag.nodeNumber === 'A-0' ? 'A0' : `${diag.nodeNumber}.${detailNum}`);
    const id = `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const activity = new Activity({
      id,
      name: command.name,
      nodeNumber: nodeNum,
      detailNumber: detailNum,
      position: command.x !== undefined && command.y !== undefined
        ? new Position(command.x, command.y)
        : Position.origin(),
    });

    diag.addActivity(activity);
    this._eventPublisher?.publish(new ActivityAddedEvent(diag.id, activity));
    this.syncRenderer();
    return this.toActivityDTO(activity);
  }

  public updateActivity(activityId: string, name: string): void {
    const diag = this._model.activeDiagram;
    const act = diag.getActivity(activityId);
    act.rename(name);
    this.syncRenderer();
  }

  public removeActivity(activityId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeActivity(activityId);
    this._eventPublisher?.publish(new ActivityRemovedEvent(diag.id, activityId));
    this.syncRenderer();
  }

  public addArrow(command: CreateArrowCommand): ArrowDTO {
    const diag = this._model.activeDiagram;
    const id = `arr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const arrow = new Arrow({
      id,
      name: command.name,
      sourceActivityId: command.sourceActivityId,
      targetActivityId: command.targetActivityId,
      icomType: command.icomType,
      tunnel: command.tunnel,
    });

    diag.addArrow(arrow);
    this._eventPublisher?.publish(new ArrowAddedEvent(diag.id, arrow));
    this.syncRenderer();
    return this.toArrowDTO(arrow);
  }

  public removeArrow(arrowId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeArrow(arrowId);
    this._eventPublisher?.publish(new ArrowRemovedEvent(diag.id, arrowId));
    this.syncRenderer();
  }

  public decomposeActivity(command: DecomposeActivityCommand): DiagramDTO {
    const childDiagId = `diag-${command.childNodeNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const childActivities = (command.activities || []).map((cmd, idx) => {
      return new Activity({
        id: `act-${childDiagId}-${idx + 1}`,
        name: cmd.name,
        nodeNumber: `${command.childNodeNumber}.${cmd.detailNumber ?? idx + 1}`,
        detailNumber: cmd.detailNumber ?? idx + 1,
        position: cmd.x !== undefined && cmd.y !== undefined ? new Position(cmd.x, cmd.y) : Position.origin(),
      });
    });

    const child = this._model.decomposeActivity(
      command.parentActivityId,
      {
        id: childDiagId,
        nodeNumber: command.childNodeNumber,
        title: command.childTitle,
      },
      childActivities
    );

    this._eventPublisher?.publish(
      new ActivityDecomposedEvent(this._model.activeDiagramId, command.parentActivityId, child)
    );

    return this.toDiagramDTO(child);
  }

  public validateCurrentDiagram(): IDEF0ValidationIssue[] {
    return IDEF0Rules.validateDiagram(this._model.activeDiagram);
  }

  public autoLayout(): void {
    this._renderer.autoLayout();
  }

  public exportJSON(): string {
    return JSON.stringify(this._model.toJSON(), null, 2);
  }

  public importJSON(jsonString: string): void {
    const json = JSON.parse(jsonString);
    this._model = IDEF0Model.fromJSON(json);
    this.syncRenderer();
  }

  public syncRenderer(): void {
    this._renderer.render(this.getActiveDiagram());
  }

  private toActivityDTO(act: Activity): ActivityDTO {
    return {
      id: act.id,
      name: act.name,
      nodeNumber: act.nodeNumber,
      detailNumber: act.detailNumber,
      dNumber: act.dNumber,
      hasDecomposition: act.hasDecomposition,
      x: act.position.x,
      y: act.position.y,
    };
  }

  private toArrowDTO(arr: Arrow): ArrowDTO {
    return {
      id: arr.id,
      name: arr.name,
      sourceActivityId: arr.sourceActivityId,
      targetActivityId: arr.targetActivityId,
      icomType: arr.icomType,
      tunnel: arr.tunnel,
      cNumber: arr.cNumber,
    };
  }

  private toDiagramDTO(diag: IDEF0Diagram): DiagramDTO {
    return {
      id: diag.id,
      nodeNumber: diag.nodeNumber,
      title: diag.title,
      parentDiagramId: diag.parentDiagramId,
      parentActivityId: diag.parentActivityId,
      activities: diag.activities.map((a) => this.toActivityDTO(a)),
      arrows: diag.arrows.map((a) => this.toArrowDTO(a)),
    };
  }

  private toModelDTO(model: IDEF0Model): ModelDTO {
    return {
      id: model.id,
      name: model.name,
      activeDiagramId: model.activeDiagramId,
      rootDiagramId: model.rootDiagramId,
      diagrams: model.diagrams.map((d) => this.toDiagramDTO(d)),
    };
  }
}
