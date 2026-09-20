import * as go from 'gojs';
import { OntologyRelationType } from '../../../../../domain/models/IDEF5Relation';

export function createOntologyLinkTemplate(): go.Link {
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
        strokeWidth: 1.5,
        stroke: '#1E293B',
      },
      new go.Binding('strokeDashArray', 'type', (t) =>
        t === OntologyRelationType.INSTANTIATES ? [4, 4] : null
      ),
      new go.Binding('stroke', 'type', (t) => {
        switch (t) {
          case OntologyRelationType.SUBKIND_OF:
            return '#0F172A';
          case OntologyRelationType.PART_OF:
            return '#0284C7';
          case OntologyRelationType.INSTANTIATES:
            return '#7C3AED';
          default:
            return '#334155';
        }
      })
    ),

    // Source adornment (Diamond for PART_OF mereological relation)
    $(
      go.Shape,
      {
        fromArrow: 'Diamond',
        scale: 1.3,
        stroke: '#0284C7',
        fill: '#E0F2FE',
        strokeWidth: 1.5,
      },
      new go.Binding('visible', 'type', (t) => t === OntologyRelationType.PART_OF)
    ),

    // Target adornment: Closed Hollow Triangle for SUBKIND_OF (Taxonomy)
    $(
      go.Shape,
      {
        toArrow: 'Triangle',
        scale: 1.4,
        fill: '#FFFFFF',
        stroke: '#0F172A',
        strokeWidth: 1.5,
      },
      new go.Binding('visible', 'type', (t) => t === OntologyRelationType.SUBKIND_OF)
    ),

    // Target adornment: Standard Arrow for relations and instantiates
    $(
      go.Shape,
      {
        toArrow: 'Standard',
        scale: 1.2,
        stroke: '#334155',
        fill: '#334155',
        strokeWidth: 1,
      },
      new go.Binding(
        'visible',
        'type',
        (t) => t === OntologyRelationType.FIRST_ORDER_RELATION || t === OntologyRelationType.INSTANTIATES
      ),
      new go.Binding('stroke', 'type', (t) =>
        t === OntologyRelationType.INSTANTIATES ? '#7C3AED' : '#334155'
      ),
      new go.Binding('fill', 'type', (t) =>
        t === OntologyRelationType.INSTANTIATES ? '#7C3AED' : '#334155'
      )
    ),

    // Central relation badge/tag
    $(
      go.Panel,
      'Auto',
      {
        segmentFraction: 0.5,
        segmentOrientation: go.Link.OrientUpright,
      },
      new go.Binding('visible', 'name', (n) => !!n && n.trim().length > 0),
      $(
        go.Shape,
        'RoundedRectangle',
        {
          fill: '#FFFFFF',
          stroke: '#CBD5E1',
          strokeWidth: 1,
          parameter1: 4,
        },
        new go.Binding('stroke', 'type', (t) => {
          if (t === OntologyRelationType.PART_OF) return '#BAE6FD';
          if (t === OntologyRelationType.INSTANTIATES) return '#DDD6FE';
          return '#CBD5E1';
        })
      ),
      $(
        go.TextBlock,
        {
          font: '500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          stroke: '#334155',
          margin: new go.Margin(2, 6, 2, 6),
        },
        new go.Binding('text', 'name'),
        new go.Binding('stroke', 'type', (t) => {
          if (t === OntologyRelationType.PART_OF) return '#0369A1';
          if (t === OntologyRelationType.INSTANTIATES) return '#6D28D9';
          return '#334155';
        })
      )
    )
  );
}
