import * as go from 'gojs';

const $ = go.GraphObject.make;

/**
 * Creates the GoJS Node template for IDEF1X Notes and Text Annotations.
 * In IDEF1X, Notes explain constraints, business rules, or conditions that cannot
 * be expressed purely by graphical symbols (e.g. "Note 1: Employee salary must be > 0").
 */
export function createNoteNodeTemplate(): go.Node {
  return $(
    go.Node,
    'Auto',
    {
      selectionAdorned: true,
      cursor: 'pointer',
      resizable: true,
      minSize: new go.Size(120, 40),
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

    // Note border (subtle dashed border)
    $(go.Shape, 'RoundedRectangle', {
      fill: '#FEF9C3', // Light yellow note color
      stroke: '#CA8A04',
      strokeWidth: 1,
      strokeDashArray: [3, 2],
      parameter1: 4,
    }),

    $(
      go.Panel,
      'Vertical',
      { margin: new go.Margin(6, 10, 6, 10), defaultAlignment: go.Spot.Left },

      // Header: "Note N"
      $(
        go.TextBlock,
        {
          font: 'bold 11px "Segoe UI", sans-serif',
          stroke: '#854D0E',
          margin: new go.Margin(0, 0, 2, 0),
        },
        new go.Binding('text', 'number', (n: number) => `NOTE ${n}`)
      ),

      // Content
      $(
        go.TextBlock,
        {
          font: '10px "Segoe UI", sans-serif',
          stroke: '#713F12',
          wrap: go.Wrap.Fit,
          width: 140,
        },
        new go.Binding('text', 'text')
      )
    )
  );
}
