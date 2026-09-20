import * as go from 'gojs';
import { RelationshipType, Cardinality } from '../../../../../domain/models/Relationship';

const $ = go.GraphObject.make;

/**
 * Creates the GoJS Link template for IDEF1X relationships.
 */
export function createRelationshipLinkTemplate(): go.Link {
  return $(
    go.Link,
    {
      routing: go.Routing.Orthogonal,
      corner: 5,
      curve: go.Curve.None,
      selectionAdorned: true,
      cursor: 'pointer',
    },
    // The main link line: Solid for Identifying, Dashed for Non-Identifying
    $(
      go.Shape,
      {
        strokeWidth: 1.5,
        stroke: '#1E293B',
      },
      new go.Binding('strokeDashArray', 'type', (type: RelationshipType) =>
        type === RelationshipType.NON_IDENTIFYING ? [6, 4] : null
      )
    ),

    // Optional parent marker (diamond) if non-identifying & optional
    $(
      go.Shape,
      {
        fromArrow: '',
        visible: false,
        stroke: '#1E293B',
        fill: '#1E293B',
        scale: 0.8,
      },
      new go.Binding('visible', '', (data: any) => {
        return data.type === RelationshipType.NON_IDENTIFYING && !!data.isOptional;
      }),
      new go.Binding('fromArrow', '', (data: any) => {
        return data.type === RelationshipType.NON_IDENTIFYING && !!data.isOptional
          ? 'Diamond'
          : '';
      })
    ),

    // Child marker (Circle / Dot for IDEF1X)
    $(
      go.Shape,
      'Circle',
      {
        segmentIndex: -1,
        segmentFraction: 1,
        alignmentFocus: go.Spot.Center,
        width: 10,
        height: 10,
        fill: '#1E293B',
        stroke: '#1E293B',
      }
    ),

    // Cardinality label near the dot (P, Z, N, etc.)
    $(
      go.TextBlock,
      {
        segmentIndex: -1,
        segmentOffset: new go.Point(-10, -10),
        font: 'bold 11px sans-serif',
        stroke: '#0F172A',
      },
      new go.Binding('text', '', (data: any) => {
        switch (data.cardinality) {
          case Cardinality.ONE_OR_MORE:
            return 'P';
          case Cardinality.ZERO_OR_ONE:
            return 'Z';
          case Cardinality.EXACTLY_N:
            return data.cardinalityValue || '1';
          case Cardinality.SPECIFIC_RANGE:
            return data.cardinalityValue || '';
          case Cardinality.ZERO_OR_MORE:
          default:
            return '';
        }
      })
    ),

    // Relationship Verb Phrase (Name) in the middle of the link
    $(
      go.Panel,
      'Auto',
      {
        segmentIndex: NaN,
        segmentFraction: 0.5,
      },
      $(go.Shape, 'RoundedRectangle', {
        fill: '#FFFFFF',
        stroke: '#CBD5E1',
        strokeWidth: 0.8,
        parameter1: 3,
      }),
      $(
        go.TextBlock,
        {
          margin: new go.Margin(2, 6, 2, 6),
          font: 'italic 10px "Segoe UI", sans-serif',
          stroke: '#475569',
        },
        new go.Binding('text', 'name')
      )
    )
  );
}
