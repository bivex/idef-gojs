import {
  IIDEF3EditorUseCase,
  CreateUOBCommand,
  CreateJunctionCommand,
  CreateLinkCommand,
  CreateReferentCommand,
  DecomposeUOBCommand,
} from '../ports/inbound/IIDEF3EditorUseCase';
import { IIDEF3DiagramRendererPort } from '../ports/outbound/IIDEF3DiagramRendererPort';
import { IIDEF3ModelRepositoryPort } from '../ports/outbound/IIDEF3ModelRepositoryPort';
import { UOBDTO, JunctionDTO, LinkDTO, ReferentDTO, DiagramDTO, ModelDTO } from '../dtos/IDEF3DTO';
import { IDEF3Model } from '../../domain/models/IDEF3Model';
import { IDEF3Diagram } from '../../domain/models/IDEF3Diagram';
import { UOB } from '../../domain/models/UOB';
import { Junction } from '../../domain/models/Junction';
import { Link } from '../../domain/models/Link';
import { Referent } from '../../domain/models/Referent';
import { Position } from '../../../domain/models/Position';
import { IDEF3Rules, IDEF3ValidationIssue } from '../../domain/rules/IDEF3Rules';

export class IDEF3ApplicationService implements IIDEF3EditorUseCase {
  private _model: IDEF3Model;

  constructor(
    private readonly _renderer: IIDEF3DiagramRendererPort,
    private readonly _repository?: IIDEF3ModelRepositoryPort
  ) {
    this._model = new IDEF3Model({
      id: 'default-idef3-model',
      name: 'Default IDEF3 Process Model',
    });
  }

  public get model(): IDEF3Model {
    return this._model;
  }

  public createModel(id: string, name: string): void {
    this._model = new IDEF3Model({ id, name });
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
    this.syncRenderer();
  }

  public drillDown(uobId: string): boolean {
    const child = this._model.drillDown(uobId);
    if (child) {
      this.syncRenderer();
      return true;
    }
    return false;
  }

  public drillUp(): boolean {
    const parent = this._model.drillUp();
    if (parent) {
      this.syncRenderer();
      return true;
    }
    return false;
  }

  public addUOB(command: CreateUOBCommand): UOBDTO {
    const diag = this._model.activeDiagram;
    const count = diag.uobs.length;
    const nodeNum = command.nodeNumber || `${count + 1}`;
    const id = `uob-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const uob = new UOB({
      id,
      name: command.name,
      nodeNumber: nodeNum,
      uobNumber: command.uobNumber || `UOB-${nodeNum}`,
      position: command.x !== undefined && command.y !== undefined
        ? new Position(command.x, command.y)
        : Position.origin(),
    });

    diag.addUOB(uob);
    this.syncRenderer();
    return this.toUOBDTO(uob);
  }

  public updateUOB(uobId: string, name: string): void {
    const diag = this._model.activeDiagram;
    const uob = diag.getUOB(uobId);
    uob.rename(name);
    this.syncRenderer();
  }

  public removeUOB(uobId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeUOB(uobId);
    this.syncRenderer();
  }

  public addJunction(command: CreateJunctionCommand): JunctionDTO {
    const diag = this._model.activeDiagram;
    const id = `junc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const juncNum = command.junctionNumber || `J${diag.junctions.length + 1}`;

    const junction = new Junction({
      id,
      kind: command.kind,
      syncType: command.syncType,
      direction: command.direction,
      junctionNumber: juncNum,
      position: command.x !== undefined && command.y !== undefined
        ? new Position(command.x, command.y)
        : Position.origin(),
    });

    diag.addJunction(junction);
    this.syncRenderer();
    return this.toJunctionDTO(junction);
  }

  public removeJunction(junctionId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeJunction(junctionId);
    this.syncRenderer();
  }

  public addLink(command: CreateLinkCommand): LinkDTO {
    const diag = this._model.activeDiagram;
    const id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const link = new Link({
      id,
      sourceId: command.sourceId,
      targetId: command.targetId,
      type: command.type,
      label: command.label,
    });

    diag.addLink(link);
    this.syncRenderer();
    return this.toLinkDTO(link);
  }

  public removeLink(linkId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeLink(linkId);
    this.syncRenderer();
  }

  public addReferent(command: CreateReferentCommand): ReferentDTO {
    const diag = this._model.activeDiagram;
    const id = `ref-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const referent = new Referent({
      id,
      name: command.name,
      type: command.type,
      locator: command.locator,
      position: command.x !== undefined && command.y !== undefined
        ? new Position(command.x, command.y)
        : Position.origin(),
    });

    diag.addReferent(referent);
    this.syncRenderer();
    return this.toReferentDTO(referent);
  }

  public removeReferent(referentId: string): void {
    const diag = this._model.activeDiagram;
    diag.removeReferent(referentId);
    this.syncRenderer();
  }

  public decomposeUOB(command: DecomposeUOBCommand): DiagramDTO {
    const childDiagId = `scenario-${command.childScenarioNumber.replace(/[^a-z0-9]/gi, '-')}`;
    const childUOBs = (command.uobs || []).map((cmd, idx) => {
      return new UOB({
        id: `uob-${childDiagId}-${idx + 1}`,
        name: cmd.name,
        nodeNumber: `${command.childScenarioNumber}.${idx + 1}`,
        uobNumber: cmd.uobNumber || `UOB-${command.childScenarioNumber}.${idx + 1}`,
        position: cmd.x !== undefined && cmd.y !== undefined ? new Position(cmd.x, cmd.y) : Position.origin(),
      });
    });

    const child = this._model.decomposeUOB(
      command.parentUOBId,
      {
        id: childDiagId,
        scenarioNumber: command.childScenarioNumber,
        title: command.childTitle,
      },
      childUOBs
    );

    return this.toDiagramDTO(child);
  }

  public validateCurrentDiagram(): IDEF3ValidationIssue[] {
    return IDEF3Rules.validateDiagram(this._model.activeDiagram);
  }

  public autoLayout(): void {
    this._renderer.autoLayout();
  }

  public exportJSON(): string {
    return JSON.stringify(this._model.toJSON(), null, 2);
  }

  public importJSON(jsonString: string): void {
    const json = JSON.parse(jsonString);
    this._model = IDEF3Model.fromJSON(json);
    this.syncRenderer();
  }

  public syncRenderer(): void {
    this._renderer.render(this.getActiveDiagram());
  }

  private toUOBDTO(uob: UOB): UOBDTO {
    return {
      id: uob.id,
      name: uob.name,
      nodeNumber: uob.nodeNumber,
      uobNumber: uob.uobNumber,
      hasDecomposition: uob.hasDecomposition,
      dNumber: uob.dNumber,
      x: uob.position.x,
      y: uob.position.y,
    };
  }

  private toJunctionDTO(j: Junction): JunctionDTO {
    return {
      id: j.id,
      kind: j.kind,
      syncType: j.syncType,
      direction: j.direction,
      junctionNumber: j.junctionNumber,
      x: j.position.x,
      y: j.position.y,
    };
  }

  private toLinkDTO(l: Link): LinkDTO {
    return {
      id: l.id,
      sourceId: l.sourceId,
      targetId: l.targetId,
      type: l.type,
      label: l.label,
    };
  }

  private toReferentDTO(r: Referent): ReferentDTO {
    return {
      id: r.id,
      name: r.name,
      type: r.type,
      locator: r.locator,
      x: r.position.x,
      y: r.position.y,
    };
  }

  private toDiagramDTO(diag: IDEF3Diagram): DiagramDTO {
    return {
      id: diag.id,
      scenarioNumber: diag.scenarioNumber,
      title: diag.title,
      parentDiagramId: diag.parentDiagramId,
      parentUOBId: diag.parentUOBId,
      uobs: diag.uobs.map((u) => this.toUOBDTO(u)),
      junctions: diag.junctions.map((j) => this.toJunctionDTO(j)),
      links: diag.links.map((l) => this.toLinkDTO(l)),
      referents: diag.referents.map((r) => this.toReferentDTO(r)),
    };
  }

  private toModelDTO(model: IDEF3Model): ModelDTO {
    return {
      id: model.id,
      name: model.name,
      rootDiagramId: model.rootDiagramId,
      activeDiagramId: model.activeDiagramId,
      diagrams: model.diagrams.map((d) => this.toDiagramDTO(d)),
    };
  }
}
