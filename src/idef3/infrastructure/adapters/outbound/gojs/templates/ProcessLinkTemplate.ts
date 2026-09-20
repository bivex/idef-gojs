import * as go from 'gojs';
import { LinkType } from '../../../../../domain/models/Link';

export function createProcessLinkTemplate(): go.Link {
  const $ = go.GraphObject.make;

  return $(
    go.Link,
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 5,
      reshapable: true,
      resegmentable: true,
      selectionAdorned: true,
    },
    // The link path line
    $(
      go.Shape,
      {
        strokeWidth: 1.5,
        stroke: '#1E293B',
      },
      new go.Binding('strokeDashArray', 'type', (t) =>
        t === LinkType.RELATIONAL ? [4, 4] : null
      )
    ),

    // Standard arrowhead for Precedence & Relational & Object Flow
    $(
      go.Shape,
      {
        toArrow: 'Standard',
        fill: '#1E293B',
        stroke: '#1E293B',
        scale: 1.2,
      }
    ),

    // Secondary arrowhead behind first for Object Flow (double arrowhead)
    $(
      go.Shape,
      {
        toArrow: 'Standard',
        fill: '#1E293B',
        stroke: '#1E293B',
        scale: 1.2,
        segmentIndex: -1,
        segmentFraction: 0.85,
      },
      new go.Binding('visible', 'type', (t) => t === LinkType.OBJECT_FLOW)
    ),

    // Optional label along link
    $(
      go.Panel,
      'Auto',
      {
        segmentFraction: 0.5,
        segmentOrientation: go.Link.OrientUpright,
      },
      new go.Binding('visible', 'label', (lbl) => !!lbl),
      $(go.Shape, 'RoundedRectangle', {
        fill: '#FFFFFF',
        stroke: '#CBD5E1',
        strokeWidth: 1,
        parameter1: 2,
      }),
      $(
        go.TextBlock,
        {
          font: '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          stroke: '#334155',
          margin: new go.Margin(1, 4, 1, 4),
        },
        new go.Binding('text', 'label')
      )
    )
  );
}
