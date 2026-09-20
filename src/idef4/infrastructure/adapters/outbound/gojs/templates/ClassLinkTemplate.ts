import * as go from 'gojs';
import { RelationshipKind } from '../../../../../domain/models/IDEF4Relationship';

export function createClassLinkTemplate(): go.Link {
  const $ = go.GraphObject.make;

  return $(
    go.Link,
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 6,
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
      new go.Binding('strokeDashArray', 'kind', (k) =>
        k === RelationshipKind.CLIENT_SERVER ? [4, 3] : null
      )
    ),

    // Source adornment (Diamond for Aggregation / Composition)
    $(
      go.Shape,
      {
        fromArrow: 'Diamond',
        scale: 1.4,
        stroke: '#1E293B',
        strokeWidth: 1.5,
      },
      new go.Binding('visible', 'kind', (k) =>
        k === RelationshipKind.AGGREGATION || k === RelationshipKind.COMPOSITION
      ),
      new go.Binding('fill', 'kind', (k) =>
        k === RelationshipKind.COMPOSITION ? '#1E293B' : '#FFFFFF'
      )
    ),

    // Target adornment: Closed Hollow Triangle for Inheritance
    $(
      go.Shape,
      {
        toArrow: 'Triangle',
        scale: 1.5,
        fill: '#FFFFFF',
        stroke: '#1E293B',
        strokeWidth: 1.5,
      },
      new go.Binding('visible', 'kind', (k) => k === RelationshipKind.INHERITANCE)
    ),

    // Target adornment: Open Arrow for Client-Server / Association
    $(
      go.Shape,
      {
        toArrow: 'OpenTriangle',
        scale: 1.2,
        stroke: '#1E293B',
        strokeWidth: 1.5,
      },
      new go.Binding('visible', 'kind', (k) =>
        k === RelationshipKind.CLIENT_SERVER || k === RelationshipKind.INSTANTIATION
      )
    ),

    // Source multiplicity label
    $(
      go.TextBlock,
      {
        segmentIndex: 0,
        segmentFraction: 0.2,
        segmentOffset: new go.Point(0, -10),
        font: 'bold 10px monospace',
        stroke: '#475569',
      },
      new go.Binding('text', 'sourceMultiplicity'),
      new go.Binding('visible', 'sourceMultiplicity', (m) => !!m)
    ),

    // Target multiplicity label
    $(
      go.TextBlock,
      {
        segmentIndex: -1,
        segmentFraction: 0.8,
        segmentOffset: new go.Point(0, -10),
        font: 'bold 10px monospace',
        stroke: '#475569',
      },
      new go.Binding('text', 'targetMultiplicity'),
      new go.Binding('visible', 'targetMultiplicity', (m) => !!m)
    ),

    // Central relationship name / role
    $(
      go.Panel,
      'Auto',
      {
        segmentFraction: 0.5,
        segmentOrientation: go.Link.OrientUpright,
      },
      new go.Binding('visible', 'name', (n) => !!n),
      $(go.Shape, 'RoundedRectangle', {
        fill: '#FFFFFF',
        stroke: '#CBD5E1',
        strokeWidth: 1,
        parameter1: 2,
      }),
      $(
        go.TextBlock,
        {
          font: 'italic 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          stroke: '#334155',
          margin: new go.Margin(1, 4, 1, 4),
        },
        new go.Binding('text', 'name')
      )
    )
  );
}
