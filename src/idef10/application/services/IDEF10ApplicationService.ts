import {
  IIDEF10EditorUseCase,
  CreateComponentCommand,
  CreateExecutionNodeCommand,
  CreateInterfaceCommand,
  CreateArtifactCommand,
  CreateIDEF10LinkCommand,
} from '../ports/inbound/IIDEF10EditorUseCase';
import {
  ComponentDTO,
  ExecutionNodeDTO,
  InterfaceDTO,
  ArtifactDTO,
  LinkDTO,
  DiagramDTO,
  ModelDTO,
} from '../dtos/IDEF10DTO';
import { IIDEF10DiagramRendererPort } from '../ports/outbound/IIDEF10DiagramRendererPort';
import { IIDEF10ModelRepositoryPort } from '../ports/outbound/IIDEF10ModelRepositoryPort';
import { IDEF10Model } from '../../domain/models/IDEF10Model';
import { IDEF10Diagram } from '../../domain/models/IDEF10Diagram';
import { IDEF10Component, ComponentLifecycle } from '../../domain/models/IDEF10Component';
import { IDEF10ExecutionNode } from '../../domain/models/IDEF10ExecutionNode';
import { IDEF10Interface } from '../../domain/models/IDEF10Interface';
import { IDEF10Artifact } from '../../domain/models/IDEF10Artifact';
import { IDEF10Link } from '../../domain/models/IDEF10Link';
import { Position } from '../../../domain/models/Position';
import { IDEF10Rules, IDEF10ValidationIssue } from '../../domain/rules/IDEF10Rules';
import { ComponentNotFoundError } from '../../domain/errors/IDEF10Error';

export class IDEF10ApplicationService implements IIDEF10EditorUseCase {
  private _model: IDEF10Model;
  private readonly _renderer?: IIDEF10DiagramRendererPort;
  private readonly _repository?: IIDEF10ModelRepositoryPort;

  constructor(
    renderer?: IIDEF10DiagramRendererPort,
    repository?: IIDEF10ModelRepositoryPort
  ) {
    this._renderer = renderer;
    this._repository = repository;
    this._model = new IDEF10Model({
      id: 'arch-model-default',
      name: 'Default Implementation Architecture Model',
    });
  }

  public createModel(id: string, name: string): void {
    this._model = new IDEF10Model({ id, name });
    this.syncRenderer();
  }

  public async loadModel(modelId: string): Promise<ModelDTO> {
    if (!this._repository) throw new Error('Repository port not configured.');
    const loaded = await this._repository.findById(modelId);
    if (!loaded) throw new Error(`IDEF10 Model "${modelId}" not found.`);
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

  // Components
  public addComponent(cmd: CreateComponentCommand): ComponentDTO {
    const id = `cmp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const comp = new IDEF10Component({
      id,
      code: cmd.code,
      name: cmd.name,
      techStack: cmd.techStack || 'Generic',
      version: cmd.version || '1.0.0',
      componentType: cmd.componentType,
      lifecycle: cmd.lifecycle,
      description: cmd.description,
      position: new Position(cmd.x ?? 100, cmd.y ?? 100),
    });
    this._model.activeDiagram.addComponent(comp);
    this.syncRenderer();
    return this.toComponentDTO(comp);
  }

  public updateComponent(id: string, name: string, lifecycle?: ComponentLifecycle): void {
    const comp = this._model.activeDiagram.getComponent(id);
    if (!comp) throw new ComponentNotFoundError(id);
    comp.rename(name);
    if (lifecycle) comp.setLifecycle(lifecycle);
    this.syncRenderer();
  }

  public removeComponent(id: string): void {
    this._model.activeDiagram.removeComponent(id);
    this.syncRenderer();
  }

  // Execution Nodes
  public addExecutionNode(cmd: CreateExecutionNodeCommand): ExecutionNodeDTO {
    const id = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const node = new IDEF10ExecutionNode({
      id,
      code: cmd.code,
      name: cmd.name,
      nodeType: cmd.nodeType,
      ipAddress: cmd.ipAddress,
      osPlatform: cmd.osPlatform,
      description: cmd.description,
      position: new Position(cmd.x ?? 450, cmd.y ?? 100),
    });
    this._model.activeDiagram.addExecutionNode(node);
    this.syncRenderer();
    return this.toExecutionNodeDTO(node);
  }

  public removeExecutionNode(id: string): void {
    this._model.activeDiagram.removeExecutionNode(id);
    this.syncRenderer();
  }

  // Interfaces
  public addInterface(cmd: CreateInterfaceCommand): InterfaceDTO {
    const id = `intf-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const intf = new IDEF10Interface({
      id,
      name: cmd.name,
      protocol: cmd.protocol,
      role: cmd.role,
      portNumber: cmd.portNumber,
      specification: cmd.specification,
      description: cmd.description,
      position: new Position(cmd.x ?? 300, cmd.y ?? 300),
    });
    this._model.activeDiagram.addInterface(intf);
    this.syncRenderer();
    return this.toInterfaceDTO(intf);
  }

  public removeInterface(id: string): void {
    this._model.activeDiagram.removeInterface(id);
    this.syncRenderer();
  }

  // Artifacts
  public addArtifact(cmd: CreateArtifactCommand): ArtifactDTO {
    const id = `art-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const art = new IDEF10Artifact({
      id,
      name: cmd.name,
      artifactType: cmd.artifactType,
      fileName: cmd.fileName,
      repositoryUrl: cmd.repositoryUrl,
      description: cmd.description,
      position: new Position(cmd.x ?? 100, cmd.y ?? 450),
    });
    this._model.activeDiagram.addArtifact(art);
    this.syncRenderer();
    return this.toArtifactDTO(art);
  }

  public removeArtifact(id: string): void {
    this._model.activeDiagram.removeArtifact(id);
    this.syncRenderer();
  }

  // Links
  public addLink(cmd: CreateIDEF10LinkCommand): LinkDTO {
    const id = `link-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const link = new IDEF10Link({
      id,
      sourceId: cmd.sourceId,
      targetId: cmd.targetId,
      type: cmd.type,
      label: cmd.label,
    });
    this._model.activeDiagram.addLink(link);
    this.syncRenderer();
    return this.toLinkDTO(link);
  }

  public removeLink(id: string): void {
    this._model.activeDiagram.removeLink(id);
    this.syncRenderer();
  }

  public validateCurrentDiagram(): IDEF10ValidationIssue[] {
    return IDEF10Rules.validate(this._model.activeDiagram);
  }

  public autoLayout(): void {
    if (this._renderer) {
      this._renderer.autoLayout();
    }
  }

  public exportJSON(): string {
    return JSON.stringify(this._model.toJSON(), null, 2);
  }

  public importJSON(jsonString: string): void {
    const parsed = JSON.parse(jsonString);
    this._model = IDEF10Model.fromJSON(parsed);
    this.syncRenderer();
  }

  public syncRenderer(): void {
    if (this._renderer) {
      this._renderer.renderDiagram(this.getActiveDiagram());
    }
  }

  // DTO Mappings
  private toComponentDTO(c: IDEF10Component): ComponentDTO {
    return {
      id: c.id,
      code: c.code,
      name: c.name,
      techStack: c.techStack,
      version: c.version,
      componentType: c.componentType,
      lifecycle: c.lifecycle,
      description: c.description,
      x: c.position.x,
      y: c.position.y,
    };
  }

  private toExecutionNodeDTO(n: IDEF10ExecutionNode): ExecutionNodeDTO {
    return {
      id: n.id,
      code: n.code,
      name: n.name,
      nodeType: n.nodeType,
      ipAddress: n.ipAddress,
      osPlatform: n.osPlatform,
      description: n.description,
      x: n.position.x,
      y: n.position.y,
    };
  }

  private toInterfaceDTO(i: IDEF10Interface): InterfaceDTO {
    return {
      id: i.id,
      name: i.name,
      protocol: i.protocol,
      role: i.role,
      portNumber: i.portNumber,
      specification: i.specification,
      description: i.description,
      x: i.position.x,
      y: i.position.y,
    };
  }

  private toArtifactDTO(a: IDEF10Artifact): ArtifactDTO {
    return {
      id: a.id,
      name: a.name,
      artifactType: a.artifactType,
      fileName: a.fileName,
      repositoryUrl: a.repositoryUrl,
      description: a.description,
      x: a.position.x,
      y: a.position.y,
    };
  }

  private toLinkDTO(l: IDEF10Link): LinkDTO {
    return {
      id: l.id,
      sourceId: l.sourceId,
      targetId: l.targetId,
      type: l.type,
      label: l.label,
    };
  }

  private toDiagramDTO(d: IDEF10Diagram): DiagramDTO {
    return {
      id: d.id,
      name: d.name,
      description: d.description,
      components: d.components.map((c) => this.toComponentDTO(c)),
      executionNodes: d.executionNodes.map((n) => this.toExecutionNodeDTO(n)),
      interfaces: d.interfaces.map((i) => this.toInterfaceDTO(i)),
      artifacts: d.artifacts.map((a) => this.toArtifactDTO(a)),
      links: d.links.map((l) => this.toLinkDTO(l)),
    };
  }

  private toModelDTO(m: IDEF10Model): ModelDTO {
    return {
      id: m.id,
      name: m.name,
      version: m.version,
      activeDiagramId: m.activeDiagram.id,
      diagrams: m.diagrams.map((d) => this.toDiagramDTO(d)),
    };
  }
}
