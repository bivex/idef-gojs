/**
 * IDEF10 Demo — Архитектура реализации программно-аппаратного комплекса
 * Авиационное / металлургическое предприятие: ОАО «Металл-Авиа»
 * Комплекс АСУ ТП, MES, SCADA и контроллеров ЧПУ
 */

import { IDEF10Editor } from '../src/idef10/infrastructure/adapters/inbound/IDEF10Editor';
import { ComponentType, ComponentLifecycle } from '../src/idef10/domain/models/IDEF10Component';
import { NodeType } from '../src/idef10/domain/models/IDEF10ExecutionNode';
import { InterfaceProtocol, InterfaceRole } from '../src/idef10/domain/models/IDEF10Interface';
import { ArtifactType } from '../src/idef10/domain/models/IDEF10Artifact';
import { ArchitectureLinkType } from '../src/idef10/domain/models/IDEF10Link';

export function setupIDEF10(): IDEF10Editor {
  const editor = new IDEF10Editor();
  editor.initialize('diagramDiv');

  editor.createModel(
    'metal-avia-arch-v1',
    'IDEF10: Архитектура реализации АСУ ТП и MES — ОАО «Металл-Авиа»'
  );

  // ─── 1. Компоненты реализации (Components) ──────────────────────────────────

  const cmpHmi = editor.addComponent({
    code: 'CMP-HMI-01',
    name: 'Веб-дашборд диспетчера цеха',
    techStack: 'Vue 3 / TypeScript / Vite',
    version: 'v3.2.0',
    componentType: ComponentType.UI_CLIENT,
    lifecycle: ComponentLifecycle.ACTIVE,
    description: 'Интерфейс оперативного мониторинга заказов и статусов печей',
    x: 50, y: 80,
  });

  const cmpMes = editor.addComponent({
    code: 'CMP-MES-01',
    name: 'MES Core — Диспетчеризация партий',
    techStack: 'Golang / gRPC / pgx',
    version: 'v2.4.1',
    componentType: ComponentType.SERVICE,
    lifecycle: ComponentLifecycle.ACTIVE,
    description: 'Центральный сервис расчета маршрутных карт и балансировки печей',
    x: 380, y: 80,
  });

  const cmpDb = editor.addComponent({
    code: 'CMP-TSDB-01',
    name: 'Хранилище телеметрии и партий (TSDB)',
    techStack: 'PostgreSQL 16 / TimescaleDB',
    version: 'v16.2',
    componentType: ComponentType.DATABASE,
    lifecycle: ComponentLifecycle.ACTIVE,
    description: 'Партиционированная база данных временных рядов температуры и давления',
    x: 720, y: 80,
  });

  const cmpScada = editor.addComponent({
    code: 'CMP-SCADA-01',
    name: 'Шлюз сбора телеметрии цеха (SCADA Collector)',
    techStack: 'C# / .NET 8 / OPC Foundation SDK',
    version: 'v1.8.0',
    componentType: ComponentType.SERVICE,
    lifecycle: ComponentLifecycle.ACTIVE,
    description: 'Драйвер опроса ПЛК термоагрегатов по промышленным шинам',
    x: 380, y: 350,
  });

  const cmpPlc = editor.addComponent({
    code: 'CMP-PLC-01',
    name: 'Управляющая программа печи ПАП-6',
    techStack: 'Siemens Step 7 / Structured Control Language',
    version: 'v4.1.2',
    componentType: ComponentType.HARDWARE_DEVICE,
    lifecycle: ComponentLifecycle.ACTIVE,
    description: 'Реализация ПИД-регулятора температуры и защитных блокировок OB35',
    x: 380, y: 600,
  });

  // ─── 2. Интерфейсы / Порты (Interfaces) ────────────────────────────────────

  const intfRest = editor.addInterface({
    name: 'REST API шлюза заказов',
    protocol: InterfaceProtocol.REST_API,
    role: InterfaceRole.PROVIDED,
    portNumber: 8080,
    specification: 'openapi_mes_orders.yaml',
    x: 50, y: 280,
  });

  const intfGrpc = editor.addInterface({
    name: 'gRPC шина телеметрии печей',
    protocol: InterfaceProtocol.GRPC,
    role: InterfaceRole.PROVIDED,
    portNumber: 50051,
    specification: 'telemetry_stream.proto',
    x: 380, y: 220,
  });

  const intfOpc = editor.addInterface({
    name: 'OPC-UA Endpoint ПЛК печи',
    protocol: InterfaceProtocol.OPC_UA,
    role: InterfaceRole.PROVIDED,
    portNumber: 4840,
    specification: 'opc.tcp://192.168.20.5:4840',
    x: 380, y: 480,
  });

  // ─── 3. Узлы исполнения / Серверы (Execution Nodes) ───────────────────────

  const nodeK8s = editor.addExecutionNode({
    code: 'NODE-K8S-01',
    name: 'Кластер серверов MES (Worker-1)',
    nodeType: NodeType.CONTAINER_CLUSTER,
    ipAddress: '192.168.10.15',
    osPlatform: 'Debian Linux 12 / Kubernetes v1.30',
    description: 'Отказоустойчивый кластер для микросервисов верхнего уровня',
    x: 720, y: 320,
  });

  const nodeDbHost = editor.addExecutionNode({
    code: 'NODE-DB-HOST',
    name: 'Выделенный сервер БД (Bare Metal)',
    nodeType: NodeType.SERVER,
    ipAddress: '192.168.10.20',
    osPlatform: 'RHEL 9.3 / NVMe RAID-10',
    description: 'Высокопроизводительный хост СУБД с аппаратным зеркалированием',
    x: 1040, y: 80,
  });

  const nodeIpc = editor.addExecutionNode({
    code: 'NODE-IPC-01',
    name: 'Промышленный ПК Advantech UNO-2484G',
    nodeType: NodeType.EDGE_CONTROLLER,
    ipAddress: '192.168.20.5',
    osPlatform: 'Ubuntu Core RT / Docker Engine',
    description: 'Шлюз сбора данных в термоотделении цеха',
    x: 720, y: 560,
  });

  // ─── 4. Артефакты сборки (Artifacts) ──────────────────────────────────────

  const artMesOci = editor.addArtifact({
    name: 'mes-core-service:2.4.1',
    artifactType: ArtifactType.DOCKER_IMAGE,
    fileName: 'mes-core-v2.4.1.tar',
    repositoryUrl: 'registry.corp.avia/mes/core:2.4.1',
    x: 1040, y: 320,
  });

  // ─── 5. Связи архитектуры (Links) ─────────────────────────────────────────

  // HMI вызывает REST API
  editor.addLink({
    sourceId: cmpHmi.id,
    targetId: intfRest.id,
    type: ArchitectureLinkType.CALLS,
    label: 'HTTP/JSON GET/POST',
  });

  // MES экспортирует REST API
  editor.addLink({
    sourceId: cmpMes.id,
    targetId: intfRest.id,
    type: ArchitectureLinkType.EXPOSES_INTERFACE,
  });

  // MES экспортирует gRPC
  editor.addLink({
    sourceId: cmpMes.id,
    targetId: intfGrpc.id,
    type: ArchitectureLinkType.EXPOSES_INTERFACE,
  });

  // SCADA передает данные в MES через gRPC
  editor.addLink({
    sourceId: cmpScada.id,
    targetId: intfGrpc.id,
    type: ArchitectureLinkType.CALLS,
    label: 'gRPC stream',
  });

  // SCADA опрашивает ПЛК через OPC-UA
  editor.addLink({
    sourceId: cmpScada.id,
    targetId: intfOpc.id,
    type: ArchitectureLinkType.CALLS,
    label: 'OPC.TCP',
  });

  // ПЛК предоставляет OPC-UA интерфейс
  editor.addLink({
    sourceId: cmpPlc.id,
    targetId: intfOpc.id,
    type: ArchitectureLinkType.EXPOSES_INTERFACE,
  });

  // MES пишет и читает БД TimescaleDB
  editor.addLink({
    sourceId: cmpMes.id,
    targetId: cmpDb.id,
    type: ArchitectureLinkType.READS_WRITES,
    label: 'SQL TCP / SSL',
  });

  // Развертывание компонентов на узлах
  editor.addLink({
    sourceId: cmpMes.id,
    targetId: nodeK8s.id,
    type: ArchitectureLinkType.DEPLOYS_ON,
    label: 'K8s Pod (3 реплики)',
  });

  editor.addLink({
    sourceId: cmpDb.id,
    targetId: nodeDbHost.id,
    type: ArchitectureLinkType.DEPLOYS_ON,
    label: 'Systemd служба',
  });

  editor.addLink({
    sourceId: cmpScada.id,
    targetId: nodeIpc.id,
    type: ArchitectureLinkType.DEPLOYS_ON,
    label: 'Docker container',
  });

  editor.addLink({
    sourceId: cmpMes.id,
    targetId: artMesOci.id,
    type: ArchitectureLinkType.PACKAGED_AS,
    label: 'CI/CD билд',
  });

  return editor;
}
