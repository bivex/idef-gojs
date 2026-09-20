import * as go from 'gojs';
import { ArchitectureLinkType } from '../../../../../domain/models/IDEF10Link';

export function createArchitectureLinkTemplate(): go.Link {
  const $ = go.GraphObject.make;

  return $(
    go.Link,
    {
      routing: go.Routing.AvoidsNodes,
      curve: go.Curve.JumpOver,
      corner: 10,
      reshapable: true,
      resegmentable: true,
      selectionObjectName: 'LINK_PATH',
    },
    // The link path shape
    $(
      go.Shape,
      {
        name: 'LINK_PATH',
        strokeWidth: 2,
      },
      new go.Binding('stroke', 'type', (type: ArchitectureLinkType) => {
        switch (type) {
          case ArchitectureLinkType.CALLS:
            return '#2563EB'; // Blue — сетевой вызов
          case ArchitectureLinkType.DEPLOYS_ON:
            return '#059669'; // Emerald — развернут на узле
          case ArchitectureLinkType.PRODUCES_CONSUMES:
            return '#D97706'; // Amber — очередь / брокер
          case ArchitectureLinkType.READS_WRITES:
            return '#9333EA'; // Purple — работа с БД
          case ArchitectureLinkType.PACKAGED_AS:
            return '#4F46E5'; // Indigo — упаковка в образ
          case ArchitectureLinkType.EXPOSES_INTERFACE:
            return '#0D9488'; // Teal — экспорт интерфейса
          default:
            return '#475569';
        }
      }),
      new go.Binding('strokeWidth', 'type', (type: ArchitectureLinkType) => {
        if (type === ArchitectureLinkType.DEPLOYS_ON || type === ArchitectureLinkType.CALLS) return 2.5;
        return 1.8;
      }),
      new go.Binding('strokeDashArray', 'type', (type: ArchitectureLinkType) => {
        if (type === ArchitectureLinkType.DEPLOYS_ON) return [6, 4];
        if (type === ArchitectureLinkType.PRODUCES_CONSUMES) return [8, 3];
        if (type === ArchitectureLinkType.PACKAGED_AS) return [4, 4];
        return null;
      })
    ),
    // Arrowhead
    $(
      go.Shape,
      {
        toArrow: 'Standard',
        strokeWidth: 0,
        scale: 1.2,
      },
      new go.Binding('fill', 'type', (type: ArchitectureLinkType) => {
        switch (type) {
          case ArchitectureLinkType.CALLS:
            return '#2563EB';
          case ArchitectureLinkType.DEPLOYS_ON:
            return '#059669';
          case ArchitectureLinkType.PRODUCES_CONSUMES:
            return '#D97706';
          case ArchitectureLinkType.READS_WRITES:
            return '#9333EA';
          case ArchitectureLinkType.PACKAGED_AS:
            return '#4F46E5';
          case ArchitectureLinkType.EXPOSES_INTERFACE:
            return '#0D9488';
          default:
            return '#475569';
        }
      })
    ),
    // Link type label
    $(
      go.Panel,
      'Auto',
      {
        segmentFraction: 0.35,
        segmentOffset: new go.Point(0, -11),
      },
      new go.Binding('visible', 'type', (t) => !!t),
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 4,
        fill: '#F8FAFC',
        stroke: '#CBD5E1',
        strokeWidth: 1,
      }),
      $(
        go.TextBlock,
        {
          font: '9px monospace',
          stroke: '#334155',
          margin: new go.Margin(2, 5, 2, 5),
        },
        new go.Binding('text', 'type', (t: ArchitectureLinkType) => {
          if (t === ArchitectureLinkType.CALLS) return '⚡ calls';
          if (t === ArchitectureLinkType.DEPLOYS_ON) return '🚢 deploys-on';
          if (t === ArchitectureLinkType.PRODUCES_CONSUMES) return '📬 pub/sub';
          if (t === ArchitectureLinkType.READS_WRITES) return '🗄️ reads/writes';
          if (t === ArchitectureLinkType.PACKAGED_AS) return '📦 packaged-as';
          if (t === ArchitectureLinkType.EXPOSES_INTERFACE) return '🔌 exposes';
          return t;
        })
      )
    ),
    // Optional user label
    $(
      go.Panel,
      'Auto',
      {
        segmentFraction: 0.65,
        segmentOffset: new go.Point(0, -11),
      },
      new go.Binding('visible', 'label', (l) => !!l && l.length > 0),
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 4,
        fill: '#FAFAFA',
        stroke: '#E2E8F0',
        strokeWidth: 1,
      }),
      $(
        go.TextBlock,
        {
          font: 'bold 9px -apple-system, sans-serif',
          stroke: '#1E293B',
          margin: new go.Margin(2, 5, 2, 5),
        },
        new go.Binding('text', 'label')
      )
    )
  );
}
