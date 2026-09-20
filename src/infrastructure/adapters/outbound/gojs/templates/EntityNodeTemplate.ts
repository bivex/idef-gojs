import * as go from 'gojs';

const $ = go.GraphObject.make;

/**
 * Creates the GoJS Node template for IDEF1X entities.
 * Features:
 * - Square corners for Independent Entities, Rounded corners for Dependent Entities
 * - Top header with Entity Name and Entity Number
 * - Horizontal separator
 * - Primary Key (PK) attributes area
 * - Horizontal separator
 * - Non-Key attributes area
 */
export function createEntityNodeTemplate(): go.Node {
  return $(
    go.Node,
    'Auto',
    {
      selectionAdorned: true,
      resizable: false,
      layoutConditions: go.LayoutConditions.Standard & ~go.LayoutConditions.NodeSized,
      fromLinkable: true,
      toLinkable: true,
      cursor: 'pointer',
      minSize: new go.Size(160, 60),
    },
    // Bind coordinates (two-way for user dragging)
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

    // Outer border: Square vs Rounded based on isDependent
    $(
      go.Shape,
      {
        name: 'SHAPE',
        fill: '#FFFFFF',
        stroke: '#1E293B',
        strokeWidth: 1.5,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      },
      new go.Binding('figure', 'isDependent', (dep: boolean) =>
        dep ? 'RoundedRectangle' : 'Rectangle'
      ),
      new go.Binding('parameter1', 'isDependent', (dep: boolean) => (dep ? 12 : 0))
    ),

    // Content container
    $(
      go.Panel,
      'Vertical',
      { margin: 0, defaultStretch: go.Stretch.Fill },

      // Header: Entity Name and Entity Number
      $(
        go.Panel,
        'Table',
        {
          stretch: go.Stretch.Fill,
          background: '#F8FAFC',
          margin: new go.Margin(0, 0, 0, 0),
          defaultSeparatorPadding: new go.Margin(4, 8, 4, 8),
        },
        $(
          go.TextBlock,
          {
            row: 0,
            column: 0,
            alignment: go.Spot.Left,
            font: 'bold 12px "Segoe UI", sans-serif',
            stroke: '#0F172A',
            margin: new go.Margin(6, 8, 6, 8),
            wrap: go.Wrap.None,
            overflow: go.TextOverflow.Ellipsis,
            editable: false,
          },
          new go.Binding('text', 'name')
        ),
        $(
          go.TextBlock,
          {
            row: 0,
            column: 1,
            alignment: go.Spot.Right,
            font: '10px "Segoe UI", sans-serif',
            stroke: '#64748B',
            margin: new go.Margin(6, 8, 6, 8),
          },
          new go.Binding('text', 'number', (n: number) => `E/${n}`)
        )
      ),

      // Divider line under header
      $(go.Shape, 'LineH', {
        stroke: '#CBD5E1',
        strokeWidth: 1,
        stretch: go.Stretch.Fill,
        height: 1,
      }),

      // Primary Key (PK) Attributes list (visible in KB and FA levels)
      $(
        go.Panel,
        'Vertical',
        {
          name: 'PK_PANEL',
          stretch: go.Stretch.Fill,
          margin: new go.Margin(4, 8, 4, 8),
          defaultAlignment: go.Spot.Left,
        },
        new go.Binding('visible', 'showPk'),
        new go.Binding('itemArray', 'primaryKeys'),
        {
          itemTemplate: $(
            go.Panel,
            'Horizontal',
            { margin: new go.Margin(1, 0, 1, 0) },
            $(
              go.TextBlock,
              {
                font: 'bold 11px "Segoe UI", monospace',
                stroke: '#0F172A',
              },
              new go.Binding('text', 'formattedName')
            )
          ),
        }
      ),

      // Dividing Line between PK and Non-Key attributes (visible only in FA level)
      $(go.Shape, 'LineH', {
        stroke: '#1E293B',
        strokeWidth: 1.5,
        stretch: go.Stretch.Fill,
        height: 2,
        margin: new go.Margin(2, 0, 2, 0),
      },
      new go.Binding('visible', 'showDivider')
      ),

      // Non-Key Attributes list (visible only in FA level)
      $(
        go.Panel,
        'Vertical',
        {
          name: 'NON_KEY_PANEL',
          stretch: go.Stretch.Fill,
          margin: new go.Margin(4, 8, 6, 8),
          defaultAlignment: go.Spot.Left,
        },
        new go.Binding('visible', 'showNonKey'),
        new go.Binding('itemArray', 'nonKeys'),
        {
          itemTemplate: $(
            go.Panel,
            'Horizontal',
            { margin: new go.Margin(1, 0, 1, 0) },
            $(
              go.TextBlock,
              {
                font: '11px "Segoe UI", monospace',
                stroke: '#334155',
              },
              new go.Binding('text', 'formattedName')
            )
          ),
        }
      )
    )
  );
}
