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
      routing: go.Routing.AvoidsNodes,
      curve: go.Curve.JumpOver,
      corner: 8,
      selectionAdorned: true,
      cursor: 'pointer',
      relinkableFrom: true,
      relinkableTo: true,
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

    // Parent marker:
    // - Solid dot on parent end for NON_SPECIFIC (Many-to-Many)
    // - Diamond on parent end for Optional Non-Identifying
    $(
      go.Shape,
      {
        segmentIndex: 0,
        segmentFraction: 0,
        alignmentFocus: go.Spot.Center,
        visible: false,
        stroke: '#1E293B',
        fill: '#1E293B',
      },
      new go.Binding('visible', '', (data: any) => {
        return (
          data.type === RelationshipType.NON_SPECIFIC ||
          (data.type === RelationshipType.NON_IDENTIFYING && !!data.isOptional)
        );
      }),
      new go.Binding('figure', '', (data: any) => {
        if (data.type === RelationshipType.NON_SPECIFIC) return 'Circle';
        if (data.type === RelationshipType.NON_IDENTIFYING && !!data.isOptional) return 'Diamond';
        return 'Circle';
      }),
      new go.Binding('width', '', (data: any) =>
        data.type === RelationshipType.NON_SPECIFIC ? 10 : 12
      ),
      new go.Binding('height', '', (data: any) =>
        data.type === RelationshipType.NON_SPECIFIC ? 10 : 12
      )
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

    // Relationship Verb Phrase (Name & Inverse Name) in the middle of the link
    $(
      go.Panel,
      'Auto',
      {
        segmentIndex: NaN,
        segmentFraction: 0.5,
      },
      new go.Binding('visible', '', (data: any) => !!(data.name || data.inverseName)),
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
        new go.Binding('text', '', (data: any) => {
          if (data.name && data.inverseName) {
            return `${data.name} / ${data.inverseName}`;
          }
          return data.name || data.inverseName || '';
        })
      )
    )
  );
}
