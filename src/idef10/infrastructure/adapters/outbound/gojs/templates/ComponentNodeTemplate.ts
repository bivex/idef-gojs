import * as go from 'gojs';
import { ComponentType, ComponentLifecycle } from '../../../../../domain/models/IDEF10Component';
import { NodeType } from '../../../../../domain/models/IDEF10ExecutionNode';
import { InterfaceProtocol } from '../../../../../domain/models/IDEF10Interface';
import { ArtifactType } from '../../../../../domain/models/IDEF10Artifact';

export function createIDEF10NodeTemplateMap(): go.Map<string, go.Node> {
  const $ = go.GraphObject.make;
  const map = new go.Map<string, go.Node>();

  // ==========================================
  // 1. Component Template (Компонент реализации)
  // ==========================================
  const componentTemplate = $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'CARD',
      resizable: true,
      resizeObjectName: 'CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Panel,
      'Auto',
      { name: 'CARD', minSize: new go.Size(230, 120) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 8,
        fill: '#FFFFFF',
        strokeWidth: 2,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      },
      new go.Binding('stroke', 'componentType', (t) => {
        if (t === ComponentType.SERVICE) return '#2563EB'; // Blue
        if (t === ComponentType.DATABASE) return '#9333EA'; // Purple
        if (t === ComponentType.UI_CLIENT) return '#059669'; // Emerald
        if (t === ComponentType.HARDWARE_DEVICE) return '#D97706'; // Amber
        return '#0D9488'; // Teal for module
      })),
      $(
        go.Panel,
        'Vertical',
        { margin: 0, stretch: go.Stretch.Fill },
        // Header
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            padding: new go.Margin(5, 8, 5, 8),
          },
          new go.Binding('background', 'componentType', (t) => {
            if (t === ComponentType.SERVICE) return '#EFF6FF';
            if (t === ComponentType.DATABASE) return '#FAF5FF';
            if (t === ComponentType.UI_CLIENT) return '#ECFDF5';
            if (t === ComponentType.HARDWARE_DEVICE) return '#FFFBEB';
            return '#F0FDFA';
          }),
          // Code badge
          $(
            go.Panel,
            'Auto',
            { margin: new go.Margin(0, 6, 0, 0) },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 4,
              fill: '#0F172A',
              strokeWidth: 0,
            }),
            $(go.TextBlock, {
              font: 'bold 9px monospace',
              stroke: '#F8FAFC',
              margin: new go.Margin(2, 5, 2, 5),
            },
            new go.Binding('text', 'code'))
          ),
          // Type label
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
          },
          new go.Binding('text', 'componentType', (t) => {
            if (t === ComponentType.SERVICE) return '⚙️ СЕРВИС';
            if (t === ComponentType.DATABASE) return '🗄️ СУБД';
            if (t === ComponentType.UI_CLIENT) return '🖥️ КЛИЕНТ ЧМИ';
            if (t === ComponentType.HARDWARE_DEVICE) return '🤖 КОНТРОЛЛЕР';
            return '📦 МОДУЛЬ';
          }),
          new go.Binding('stroke', 'componentType', (t) => {
            if (t === ComponentType.SERVICE) return '#1D4ED8';
            if (t === ComponentType.DATABASE) return '#7E22CE';
            if (t === ComponentType.UI_CLIENT) return '#047857';
            if (t === ComponentType.HARDWARE_DEVICE) return '#B45309';
            return '#0F766E';
          })),
          // Version badge (right-aligned)
          $(
            go.Panel,
            'Auto',
            { alignment: go.Spot.Right },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 4,
              fill: '#E2E8F0',
              strokeWidth: 0,
            }),
            $(go.TextBlock, {
              font: 'bold 9px monospace',
              stroke: '#334155',
              margin: new go.Margin(2, 5, 2, 5),
            },
            new go.Binding('text', 'version'))
          )
        ),
        // Name
        $(
          go.TextBlock,
          {
            font: 'bold 12px -apple-system, sans-serif',
            stroke: '#0F172A',
            margin: new go.Margin(6, 10, 2, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),
        // Tech stack tag
        $(
          go.Panel,
          'Horizontal',
          { margin: new go.Margin(2, 10, 4, 10) },
          $(go.TextBlock, '🛠️ Стек: ', { font: '9px -apple-system, sans-serif', stroke: '#64748B' }),
          $(go.TextBlock, {
            font: 'bold 10px monospace',
            stroke: '#0284C7',
          },
          new go.Binding('text', 'techStack'))
        ),
        // Lifecycle footer
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#F8FAFC',
            padding: new go.Margin(4, 10, 5, 10),
          },
          $(go.TextBlock, {
            font: '9px monospace',
            stroke: '#475569',
          },
          new go.Binding('text', 'lifecycle', (l) => {
            if (l === ComponentLifecycle.ACTIVE) return '🟢 ACTIVE';
            if (l === ComponentLifecycle.TESTING) return '🟡 TESTING';
            if (l === ComponentLifecycle.DEVELOPMENT) return '🔵 DEV';
            return '⚪ DEPRECATED';
          }))
        )
      )
    )
  );

  // ==========================================
  // 2. Execution Node Template (Узел исполнения)
  // ==========================================
  const executionNodeTemplate = $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'CARD',
      resizable: true,
      resizeObjectName: 'CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Panel,
      'Auto',
      { name: 'CARD', minSize: new go.Size(220, 100) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 6,
        fill: '#F8FAFC',
        stroke: '#475569', // Slate
        strokeWidth: 2,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      }),
      $(
        go.Panel,
        'Vertical',
        { margin: 0, stretch: go.Stretch.Fill },
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#E2E8F0',
            padding: new go.Margin(5, 10, 5, 10),
          },
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#1E293B',
          },
          new go.Binding('text', 'nodeType', (t) => {
            if (t === NodeType.SERVER) return '🖥️ СЕРВЕР';
            if (t === NodeType.CONTAINER_CLUSTER) return '☸️ КЛАСТЕР K8S';
            if (t === NodeType.EDGE_CONTROLLER) return '🏭 EDGE IPC';
            if (t === NodeType.CLOUD_VM) return '☁️ ОБЛАКО VM';
            return '🎛️ ПАНЕЛЬ ЧМИ';
          })),
          $(
            go.Panel,
            'Auto',
            { alignment: go.Spot.Right },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 4,
              fill: '#334155',
              strokeWidth: 0,
            }),
            $(go.TextBlock, {
              font: 'bold 9px monospace',
              stroke: '#F8FAFC',
              margin: new go.Margin(2, 5, 2, 5),
            },
            new go.Binding('text', 'code'))
          )
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 12px -apple-system, sans-serif',
            stroke: '#0F172A',
            margin: new go.Margin(6, 10, 2, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),
        $(
          go.TextBlock,
          {
            font: '9px monospace',
            stroke: '#2563EB',
            margin: new go.Margin(0, 10, 2, 10),
          },
          new go.Binding('text', 'ipAddress', (ip) => ip ? `🌐 IP: ${ip}` : '')
        ),
        $(
          go.TextBlock,
          {
            font: 'italic 9px -apple-system, sans-serif',
            stroke: '#64748B',
            margin: new go.Margin(0, 10, 6, 10),
          },
          new go.Binding('text', 'osPlatform', (os) => os ? `OS: ${os}` : '')
        )
      )
    )
  );

  // ==========================================
  // 3. Interface Template (Интерфейс / Эндпоинт)
  // ==========================================
  const interfaceTemplate = $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'CARD',
      resizable: true,
      resizeObjectName: 'CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Panel,
      'Auto',
      { name: 'CARD', minSize: new go.Size(200, 85) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 14, // Pill
        fill: '#FEFCE8',
        stroke: '#CA8A04', // Yellow/amber
        strokeWidth: 2,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      }),
      $(
        go.Panel,
        'Vertical',
        { margin: 0, stretch: go.Stretch.Fill },
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#FEF9C3',
            padding: new go.Margin(5, 10, 5, 10),
          },
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#854D0E',
          },
          new go.Binding('text', 'protocol', (p) => {
            if (p === InterfaceProtocol.REST_API) return '🌐 REST API';
            if (p === InterfaceProtocol.GRPC) return '⚡ gRPC RPC';
            if (p === InterfaceProtocol.OPC_UA) return '📡 OPC-UA';
            if (p === InterfaceProtocol.MQTT_KAFKA) return '📬 MQTT/KAFKA';
            if (p === InterfaceProtocol.SQL_TCP) return '🗄️ SQL TCP';
            return '🔌 MODBUS TCP';
          })),
          $(
            go.TextBlock,
            {
              font: 'bold 9px monospace',
              stroke: '#A16207',
              margin: new go.Margin(0, 0, 0, 6),
              alignment: go.Spot.Right,
            },
            new go.Binding('text', 'portNumber', (p) => p ? `:${p}` : '')
          )
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 11px -apple-system, sans-serif',
            stroke: '#1E293B',
            margin: new go.Margin(6, 10, 4, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),
        $(
          go.TextBlock,
          {
            font: 'italic 9px monospace',
            stroke: '#64748B',
            margin: new go.Margin(0, 10, 6, 10),
          },
          new go.Binding('text', 'specification', (s) => s ? `spec: ${s}` : '')
        )
      )
    )
  );

  // ==========================================
  // 4. Artifact Template (Артефакт сборки)
  // ==========================================
  const artifactTemplate = $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'CARD',
      resizable: true,
      resizeObjectName: 'CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Panel,
      'Auto',
      { name: 'CARD', minSize: new go.Size(200, 85) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 6,
        fill: '#F5F3FF',
        stroke: '#7C3AED', // Violet
        strokeWidth: 2,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      }),
      $(
        go.Panel,
        'Vertical',
        { margin: 0, stretch: go.Stretch.Fill },
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#EDE9FE',
            padding: new go.Margin(5, 10, 5, 10),
          },
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#6D28D9',
          },
          new go.Binding('text', 'artifactType', (t) => {
            if (t === ArtifactType.DOCKER_IMAGE) return '🐳 DOCKER OCI';
            if (t === ArtifactType.BINARY_EXECUTABLE) return '⚙️ BINARY ELF/EXE';
            if (t === ArtifactType.LIBRARY_PACKAGE) return '📦 PACKAGE';
            if (t === ArtifactType.PLC_FIRMWARE) return '💾 ПРОШИВКА ПЛК';
            return '📄 YAML MANIFEST';
          }))
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 11px -apple-system, sans-serif',
            stroke: '#1E293B',
            margin: new go.Margin(6, 10, 4, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),
        $(
          go.TextBlock,
          {
            font: '9px monospace',
            stroke: '#7C3AED',
            margin: new go.Margin(0, 10, 6, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
          },
          new go.Binding('text', 'repositoryUrl')
        )
      )
    )
  );

  map.add('component', componentTemplate);
  map.add('executionNode', executionNodeTemplate);
  map.add('interface', interfaceTemplate);
  map.add('artifact', artifactTemplate);

  return map;
}
