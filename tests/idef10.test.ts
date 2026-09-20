import { describe, it, expect } from 'bun:test';
import {
  IDEF10Component,
  ComponentType,
  ComponentLifecycle,
} from '../src/idef10/domain/models/IDEF10Component';
import {
  IDEF10ExecutionNode,
  NodeType,
} from '../src/idef10/domain/models/IDEF10ExecutionNode';
import {
  IDEF10Interface,
  InterfaceProtocol,
  InterfaceRole,
} from '../src/idef10/domain/models/IDEF10Interface';
import {
  IDEF10Artifact,
  ArtifactType,
} from '../src/idef10/domain/models/IDEF10Artifact';
import {
  IDEF10Link,
  ArchitectureLinkType,
} from '../src/idef10/domain/models/IDEF10Link';
import { IDEF10Diagram } from '../src/idef10/domain/models/IDEF10Diagram';
import { IDEF10Model } from '../src/idef10/domain/models/IDEF10Model';
import { IDEF10Rules } from '../src/idef10/domain/rules/IDEF10Rules';
import { IDEF10Editor } from '../src/idef10/infrastructure/adapters/inbound/IDEF10Editor';

describe('IDEF10 Implementation Architecture Modeling Method (KBSI)', () => {
  it('should create Component, ExecutionNode, Interface, and Artifact with proper domain properties', () => {
    const comp = new IDEF10Component({
      id: 'cmp-1',
      code: 'CMP-MES',
      name: 'MES Core Dispatcher',
      techStack: 'Go / gRPC',
      version: 'v2.4.1',
      componentType: ComponentType.SERVICE,
      lifecycle: ComponentLifecycle.ACTIVE,
    });

    expect(comp.id).toBe('cmp-1');
    expect(comp.code).toBe('CMP-MES');
    expect(comp.componentType).toBe(ComponentType.SERVICE);
    expect(comp.lifecycle).toBe(ComponentLifecycle.ACTIVE);

    const node = new IDEF10ExecutionNode({
      id: 'node-1',
      code: 'NODE-K8S',
      name: 'Kubernetes Worker 1',
      nodeType: NodeType.CONTAINER_CLUSTER,
      ipAddress: '192.168.10.15',
      osPlatform: 'Debian Linux 12',
    });
    expect(node.nodeType).toBe(NodeType.CONTAINER_CLUSTER);
    expect(node.ipAddress).toBe('192.168.10.15');

    const intf = new IDEF10Interface({
      id: 'intf-1',
      name: 'OPC-UA Telemetry Server',
      protocol: InterfaceProtocol.OPC_UA,
      role: InterfaceRole.PROVIDED,
      portNumber: 4840,
    });
    expect(intf.protocol).toBe(InterfaceProtocol.OPC_UA);
    expect(intf.portNumber).toBe(4840);

    const art = new IDEF10Artifact({
      id: 'art-1',
      name: 'mes-core-container',
      artifactType: ArtifactType.DOCKER_IMAGE,
      repositoryUrl: 'registry.avia/mes:latest',
    });
    expect(art.artifactType).toBe(ArtifactType.DOCKER_IMAGE);
  });

  it('should manage architecture links and clean up dangling links on removal', () => {
    const comp = new IDEF10Component({ id: 'c-1', code: 'C-1', name: 'Сервис 1' });
    const node = new IDEF10ExecutionNode({ id: 'n-1', code: 'N-1', name: 'Сервер 1' });
    const intf = new IDEF10Interface({ id: 'i-1', name: 'REST Порт' });

    const diag = new IDEF10Diagram({ id: 'diag-1', name: 'Диаграмма архитектуры' });
    diag.addComponent(comp);
    diag.addExecutionNode(node);
    diag.addInterface(intf);

    const linkDeploy = new IDEF10Link({
      id: 'l-dep',
      sourceId: comp.id,
      targetId: node.id,
      type: ArchitectureLinkType.DEPLOYS_ON,
    });
    const linkIntf = new IDEF10Link({
      id: 'l-intf',
      sourceId: comp.id,
      targetId: intf.id,
      type: ArchitectureLinkType.EXPOSES_INTERFACE,
    });

    diag.addLink(linkDeploy);
    diag.addLink(linkIntf);

    expect(diag.links.length).toBe(2);
    expect(diag.hasElement(comp.id)).toBe(true);

    // Remove component → its links must be cleaned up
    diag.removeComponent(comp.id);
    expect(diag.links.length).toBe(0);
  });

  it('should validate: undeployed active service warning', () => {
    const activeService = new IDEF10Component({
      id: 'svc-orphan',
      code: 'SVC-ORPHAN',
      name: 'Висящий в воздухе сервис',
      componentType: ComponentType.SERVICE,
      lifecycle: ComponentLifecycle.ACTIVE,
    });

    const diag = new IDEF10Diagram({ id: 'diag-v', name: 'Проверка правил' });
    diag.addComponent(activeService);

    const issues = IDEF10Rules.validate(diag);
    expect(issues.some((i) => i.code === 'IDEF10_UNDEPLOYED_ACTIVE_COMPONENT')).toBe(true);
    expect(issues.some((i) => i.code === 'IDEF10_ISOLATED_COMPONENT')).toBe(true);
  });

  it('should validate: duplicate component codes and orphan interfaces', () => {
    const c1 = new IDEF10Component({ id: 'c-dup-1', code: 'CMP-DUP', name: 'Компонент А' });
    const c2 = new IDEF10Component({ id: 'c-dup-2', code: 'CMP-DUP', name: 'Компонент Б (дубль)' });
    const orphanIntf = new IDEF10Interface({ id: 'intf-orphan', name: 'Одинокий интерфейс' });

    const diag = new IDEF10Diagram({ id: 'diag-dup', name: 'Диаграмма с ошибками' });
    diag.addComponent(c1);
    diag.addComponent(c2);
    diag.addInterface(orphanIntf);

    const issues = IDEF10Rules.validate(diag);
    expect(issues.some((i) => i.code === 'IDEF10_DUPLICATE_COMPONENT_CODE')).toBe(true);
    expect(issues.some((i) => i.code === 'IDEF10_ORPHAN_INTERFACE')).toBe(true);
  });

  it('should serialize and deserialize model to/from JSON without data loss', () => {
    const model = new IDEF10Model({
      id: 'model-arch-1',
      name: 'АСУ ТП цеха термической обработки',
      version: '1.2.0',
    });

    const diag = model.activeDiagram;
    diag.addComponent(
      new IDEF10Component({
        id: 'c-ser',
        code: 'CMP-SER',
        name: 'Сервис сериализации',
        techStack: 'Rust / Actix',
      })
    );
    diag.addExecutionNode(
      new IDEF10ExecutionNode({
        id: 'n-ser',
        code: 'NODE-SER',
        name: 'Хост виртуализации',
      })
    );

    const json = JSON.stringify(model.toJSON());
    const restored = IDEF10Model.fromJSON(JSON.parse(json));

    expect(restored.id).toBe('model-arch-1');
    expect(restored.name).toBe('АСУ ТП цеха термической обработки');
    expect(restored.version).toBe('1.2.0');
    expect(restored.activeDiagram.components.length).toBe(1);
    expect(restored.activeDiagram.components[0].code).toBe('CMP-SER');
    expect(restored.activeDiagram.executionNodes.length).toBe(1);
  });

  it('should manage architecture elements via IDEF10Editor facade', () => {
    const editor = new IDEF10Editor();
    editor.createModel('facade-test', 'Тест фасада IDEF10');

    const comp = editor.addComponent({
      code: 'CMP-TEST',
      name: 'Шлюз телеметрии',
      techStack: 'C# / .NET 8',
      componentType: ComponentType.SERVICE,
      lifecycle: ComponentLifecycle.ACTIVE,
    });
    expect(comp.code).toBe('CMP-TEST');

    const node = editor.addExecutionNode({
      code: 'NODE-TEST',
      name: 'Сервер приложений',
      nodeType: NodeType.SERVER,
    });
    expect(node.name).toBe('Сервер приложений');

    const intf = editor.addInterface({
      name: 'gRPC порт',
      protocol: InterfaceProtocol.GRPC,
      portNumber: 50051,
    });
    expect(intf.portNumber).toBe(50051);

    const art = editor.addArtifact({
      name: 'telemetry-gw.tar',
      artifactType: ArtifactType.DOCKER_IMAGE,
    });
    expect(art.name).toBe('telemetry-gw.tar');

    // Link: deploys_on
    editor.addLink({
      sourceId: comp.id,
      targetId: node.id,
      type: ArchitectureLinkType.DEPLOYS_ON,
    });

    // Link: exposes_interface
    editor.addLink({
      sourceId: comp.id,
      targetId: intf.id,
      type: ArchitectureLinkType.EXPOSES_INTERFACE,
    });

    const diag = editor.getActiveDiagram();
    expect(diag.components.length).toBe(1);
    expect(diag.executionNodes.length).toBe(1);
    expect(diag.interfaces.length).toBe(1);
    expect(diag.artifacts.length).toBe(1);
    expect(diag.links.length).toBe(2);

    // Validation: now that it is deployed and exposes the interface, check issues
    const issues = editor.validate();
    expect(issues.some((i) => i.code === 'IDEF10_UNDEPLOYED_ACTIVE_COMPONENT')).toBe(false);
    expect(issues.some((i) => i.code === 'IDEF10_ISOLATED_COMPONENT')).toBe(false);

    // JSON export/import test
    const json = editor.exportJSON();
    expect(json).toContain('CMP-TEST');
    editor.importJSON(json);
    const diag2 = editor.getActiveDiagram();
    expect(diag2.components.length).toBe(1);
  });
});
