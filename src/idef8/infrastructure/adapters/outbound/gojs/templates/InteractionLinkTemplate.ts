import * as go from 'gojs';
import { InteractionLinkType } from '../../../../../domain/models/IDEF8Link';

export function createInteractionLinkTemplate(): go.Link {
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
      new go.Binding('stroke', 'type', (type: InteractionLinkType) => {
        switch (type) {
          case InteractionLinkType.NAVIGATES_TO:
            return '#2563EB'; // Blue
          case InteractionLinkType.TRIGGERS:
            return '#D97706'; // Amber / Orange
          case InteractionLinkType.OPENS_MODAL:
            return '#DC2626'; // Red
          case InteractionLinkType.RETURNS_TO:
            return '#64748B'; // Slate grey
          case InteractionLinkType.PERFORMED_BY:
            return '#9333EA'; // Purple
          case InteractionLinkType.RESTRICTED_TO:
            return '#059669'; // Emerald
          default:
            return '#475569';
        }
      }),
      new go.Binding('strokeWidth', 'type', (type: InteractionLinkType) => {
        if (type === InteractionLinkType.NAVIGATES_TO || type === InteractionLinkType.TRIGGERS) return 2.5;
        return 1.8;
      }),
      new go.Binding('strokeDashArray', 'type', (type: InteractionLinkType) => {
        if (type === InteractionLinkType.OPENS_MODAL) return [6, 4];
        if (type === InteractionLinkType.RETURNS_TO) return [4, 4];
        if (type === InteractionLinkType.PERFORMED_BY || type === InteractionLinkType.RESTRICTED_TO) return [2, 3];
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
      new go.Binding('fill', 'type', (type: InteractionLinkType) => {
        switch (type) {
          case InteractionLinkType.NAVIGATES_TO:
            return '#2563EB';
          case InteractionLinkType.TRIGGERS:
            return '#D97706';
          case InteractionLinkType.OPENS_MODAL:
            return '#DC2626';
          case InteractionLinkType.RETURNS_TO:
            return '#64748B';
          case InteractionLinkType.PERFORMED_BY:
            return '#9333EA';
          case InteractionLinkType.RESTRICTED_TO:
            return '#059669';
          default:
            return '#475569';
        }
      })
    ),
    // Link label
    $(
      go.Panel,
      'Auto',
      {
        segmentFraction: 0.5,
        segmentOffset: new go.Point(0, -10),
      },
      new go.Binding('visible', 'label', (l) => !!l && l.length > 0),
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 4,
        fill: '#F8FAFC',
        stroke: '#CBD5E1',
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
