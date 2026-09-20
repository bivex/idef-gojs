import * as go from 'gojs';

const $ = go.GraphObject.make;

/**
 * Creates the GoJS Node template for IDEF1X Subtype / Categorization clusters.
 */
export function createSubtypeNodeTemplate(): go.Node {
  return $(
    go.Node,
    'Spot',
    {
      selectionAdorned: true,
      cursor: 'pointer',
      fromLinkable: true,
      toLinkable: true,
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

    $(
      go.Panel,
      'Vertical',
      { alignment: go.Spot.Center },

      // Subtype Circle
      $(go.Shape, 'Circle', {
        width: 18,
        height: 18,
        fill: '#FFFFFF',
        stroke: '#1E293B',
        strokeWidth: 1.5,
        portId: '',
      }),

      // Underline (single for incomplete, double for complete categorization)
      $(
        go.Panel,
        'Vertical',
        { margin: new go.Margin(2, 0, 0, 0) },
        $(go.Shape, 'LineH', {
          width: 26,
          height: 1,
          stroke: '#1E293B',
          strokeWidth: 1.5,
        }),
        $(
          go.Shape,
          'LineH',
          {
            width: 26,
            height: 1,
            stroke: '#1E293B',
            strokeWidth: 1.5,
            margin: new go.Margin(2, 0, 0, 0),
          },
          new go.Binding('visible', 'isComplete')
        )
      ),

      // Discriminator label
      $(
        go.TextBlock,
        {
          margin: new go.Margin(4, 0, 0, 0),
          font: 'italic 10px "Segoe UI", sans-serif',
          stroke: '#64748B',
        },
        new go.Binding('text', 'discriminator', (d: string) => (d ? `[${d}]` : ''))
      )
    )
  );
}
