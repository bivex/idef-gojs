import * as go from 'gojs';
import { ConstraintLinkType } from '../../../../../domain/models/IDEF9Link';

export function createConstraintLinkTemplate(): go.Link {
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
      new go.Binding('stroke', 'type', (type: ConstraintLinkType) => {
        switch (type) {
          case ConstraintLinkType.CONSTRAINS:
            return '#DC2626'; // Red — ограничивает
          case ConstraintLinkType.ENFORCED_BY:
            return '#16A34A'; // Green — исполняется
          case ConstraintLinkType.DERIVED_FROM:
            return '#D97706'; // Amber — производное от документа
          case ConstraintLinkType.CONFLICTS_WITH:
            return '#9333EA'; // Purple — конфликт
          case ConstraintLinkType.SUPERSEDES:
            return '#64748B'; // Slate — вытесняет
          default:
            return '#475569';
        }
      }),
      new go.Binding('strokeWidth', 'type', (type: ConstraintLinkType) => {
        if (type === ConstraintLinkType.CONSTRAINS || type === ConstraintLinkType.ENFORCED_BY) return 2.5;
        return 1.8;
      }),
      new go.Binding('strokeDashArray', 'type', (type: ConstraintLinkType) => {
        if (type === ConstraintLinkType.CONFLICTS_WITH) return [6, 4];
        if (type === ConstraintLinkType.SUPERSEDES) return [4, 4];
        if (type === ConstraintLinkType.DERIVED_FROM) return [8, 3];
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
      new go.Binding('fill', 'type', (type: ConstraintLinkType) => {
        switch (type) {
          case ConstraintLinkType.CONSTRAINS:
            return '#DC2626';
          case ConstraintLinkType.ENFORCED_BY:
            return '#16A34A';
          case ConstraintLinkType.DERIVED_FROM:
            return '#D97706';
          case ConstraintLinkType.CONFLICTS_WITH:
            return '#9333EA';
          case ConstraintLinkType.SUPERSEDES:
            return '#64748B';
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
        new go.Binding('text', 'type', (t: ConstraintLinkType) => {
          if (t === ConstraintLinkType.CONSTRAINS) return '⛔ constrains';
          if (t === ConstraintLinkType.ENFORCED_BY) return '✅ enforced-by';
          if (t === ConstraintLinkType.DERIVED_FROM) return '📄 derived-from';
          if (t === ConstraintLinkType.CONFLICTS_WITH) return '⚡ conflicts-with';
          if (t === ConstraintLinkType.SUPERSEDES) return '🔄 supersedes';
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
