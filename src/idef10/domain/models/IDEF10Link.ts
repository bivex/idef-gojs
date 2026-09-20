export enum ArchitectureLinkType {
  CALLS = 'CALLS',                         // Сетевой вызов компонента/сервиса
  DEPLOYS_ON = 'DEPLOYS_ON',               // Развертывание компонента/артефакта на узле
  PRODUCES_CONSUMES = 'PRODUCES_CONSUMES', // Потоковая передача / брокер сообщений
  READS_WRITES = 'READS_WRITES',           // Чтение / запись данных в хранилище (СУБД)
  PACKAGED_AS = 'PACKAGED_AS',             // Упаковка компонента в артефакт (Docker/Binary)
  EXPOSES_INTERFACE = 'EXPOSES_INTERFACE', // Экспорт или привязка сетевого интерфейса/порта
}

export interface IDEF10LinkProps {
  id: string;
  sourceId: string;
  targetId: string;
  type: ArchitectureLinkType;
  label?: string;
}

export class IDEF10Link {
  public readonly id: string;
  public readonly sourceId: string;
  public readonly targetId: string;
  public readonly type: ArchitectureLinkType;
  public readonly label?: string;

  constructor(props: IDEF10LinkProps) {
    if (!props.id) throw new Error('Link ID cannot be empty.');
    if (!props.sourceId) throw new Error('Link sourceId cannot be empty.');
    if (!props.targetId) throw new Error('Link targetId cannot be empty.');
    if (!props.type) throw new Error('Link type cannot be empty.');

    this.id = props.id;
    this.sourceId = props.sourceId;
    this.targetId = props.targetId;
    this.type = props.type;
    this.label = props.label;
  }

  public toJSON(): object {
    return {
      id: this.id,
      sourceId: this.sourceId,
      targetId: this.targetId,
      type: this.type,
      label: this.label,
    };
  }
}
