import { Position } from '../../../domain/models/Position';

export enum ArtifactType {
  DOCKER_IMAGE = 'DOCKER_IMAGE',           // OCI / Docker образ контейнера
  BINARY_EXECUTABLE = 'BINARY_EXECUTABLE', // Исполняемый файл (ELF / Windows .exe)
  LIBRARY_PACKAGE = 'LIBRARY_PACKAGE',     // Пакет (NPM / NuGet / Maven jar)
  PLC_FIRMWARE = 'PLC_FIRMWARE',           // Прошивка / скомпилированный блок ПЛК
  CONFIG_MANIFEST = 'CONFIG_MANIFEST',     // Kubernetes Manifest / Helm chart / YAML
}

export interface IDEF10ArtifactProps {
  id: string;
  name: string;
  artifactType?: ArtifactType;
  fileName?: string;                       // e.g. "mes-backend:2.4.1.tar", "opc-gateway.exe"
  repositoryUrl?: string;                  // e.g. "registry.corp.avia/mes/core:latest"
  description?: string;
  position?: Position;
}

export class IDEF10Artifact {
  public readonly id: string;
  private _name: string;
  public readonly artifactType: ArtifactType;
  private _fileName?: string;
  private _repositoryUrl?: string;
  private _description?: string;
  private _position: Position;

  constructor(props: IDEF10ArtifactProps) {
    if (!props.id) throw new Error('Artifact ID cannot be empty.');
    if (!props.name || props.name.trim().length === 0) throw new Error('Artifact name cannot be empty.');

    this.id = props.id;
    this._name = props.name.trim();
    this.artifactType = props.artifactType || ArtifactType.DOCKER_IMAGE;
    this._fileName = props.fileName;
    this._repositoryUrl = props.repositoryUrl;
    this._description = props.description;
    this._position = props.position || Position.origin();
  }

  public get name(): string {
    return this._name;
  }

  public rename(name: string): void {
    if (!name || name.trim().length === 0) throw new Error('Artifact name cannot be empty.');
    this._name = name.trim();
  }

  public get fileName(): string | undefined {
    return this._fileName;
  }

  public setFileName(name?: string): void {
    this._fileName = name;
  }

  public get repositoryUrl(): string | undefined {
    return this._repositoryUrl;
  }

  public setRepositoryUrl(url?: string): void {
    this._repositoryUrl = url;
  }

  public get description(): string | undefined {
    return this._description;
  }

  public setDescription(desc?: string): void {
    this._description = desc;
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(pos: Position): void {
    this._position = pos;
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this._name,
      artifactType: this.artifactType,
      fileName: this._fileName,
      repositoryUrl: this._repositoryUrl,
      description: this._description,
      position: this._position.toJSON(),
    };
  }
}
