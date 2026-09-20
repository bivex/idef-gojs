import * as go from 'gojs';
import { RationaleLinkType } from '../../../../../domain/models/IDEF6Link';

export function createRationaleLinkTemplate(): go.Link {
  const $ = go.GraphObject.make;

  return $(
    go.Link,
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 8,
      reshapable: true,
      resegmentable: true,
      selectionAdorned: true,
    },
    // The link path line
    $(
      go.Shape,
      {
        strokeWidth: 1.8,
      },
      new go.Binding('strokeDashArray', 'type', (t) =>
        t === RationaleLinkType.OBJECTS_TO ? [5, 4] : null
      ),
      new go.Binding('strokeWidth', 'type', (t) =>
        t === RationaleLinkType.RESOLVES ? 2.5 : 1.8
      ),
      new go.Binding('stroke', 'type', (t) => {
        switch (t) {
          case RationaleLinkType.RESPONDS_TO:
            return '#2563EB';
          case RationaleLinkType.SUPPORTS:
            return '#059669';
          case RationaleLinkType.OBJECTS_TO:
            return '#DC2626';
          case RationaleLinkType.EVALUATES:
            return '#7C3AED';
          case RationaleLinkType.RESOLVES:
            return '#10B981';
          default:
            return '#475569';
        }
      })
    ),

    // Arrowhead
    $(
      go.Shape,
      {
        toArrow: 'Standard',
        scale: 1.2,
      },
      new go.Binding('fill', 'type', (t) => {
        switch (t) {
          case RationaleLinkType.RESPONDS_TO:
            return '#2563EB';
          case RationaleLinkType.SUPPORTS:
            return '#059669';
          case RationaleLinkType.OBJECTS_TO:
            return '#DC2626';
          case RationaleLinkType.EVALUATES:
            return '#7C3AED';
          case RationaleLinkType.RESOLVES:
            return '#10B981';
          default:
            return '#475569';
        }
      }),
      new go.Binding('stroke', 'type', (t) => {
        switch (t) {
          case RationaleLinkType.RESPONDS_TO:
            return '#2563EB';
          case RationaleLinkType.SUPPORTS:
            return '#059669';
          case RationaleLinkType.OBJECTS_TO:
            return '#DC2626';
          case RationaleLinkType.EVALUATES:
            return '#7C3AED';
          case RationaleLinkType.RESOLVES:
            return '#10B981';
          default:
            return '#475569';
        }
      })
    ),

    // Central label badge
    $(
      go.Panel,
      'Auto',
      {
        segmentFraction: 0.5,
        segmentOrientation: go.Link.OrientUpright,
      },
      new go.Binding('visible', 'label', (l) => !!l && l.trim().length > 0),
      $(
        go.Shape,
        'RoundedRectangle',
        {
          fill: '#FFFFFF',
          strokeWidth: 1,
          parameter1: 4,
        },
        new go.Binding('stroke', 'type', (t) => {
          switch (t) {
            case RationaleLinkType.SUPPORTS:
              return '#A7F3D0';
            case RationaleLinkType.OBJECTS_TO:
              return '#FECDD3';
            case RationaleLinkType.RESOLVES:
              return '#A7F3D0';
            case RationaleLinkType.EVALUATES:
              return '#DDD6FE';
            default:
              return '#BFDBFE';
          }
        })
      ),
      $(
        go.TextBlock,
        {
          font: 'bold 9px -apple-system, sans-serif',
          margin: new go.Margin(2, 6, 2, 6),
        },
        new go.Binding('text', 'label'),
        new go.Binding('stroke', 'type', (t) => {
          switch (t) {
            case RationaleLinkType.SUPPORTS:
              return '#065F46';
            case RationaleLinkType.OBJECTS_TO:
              return '#991B1B';
            case RationaleLinkType.RESOLVES:
              return '#065F46';
            case RationaleLinkType.EVALUATES:
              return '#5B21B6';
            default:
              return '#1E40AF';
          }
        })
      )
    )
  );
}
