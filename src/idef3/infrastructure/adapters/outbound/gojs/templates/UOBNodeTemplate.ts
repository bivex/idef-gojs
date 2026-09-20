import * as go from 'gojs';

export function createUOBNodeTemplate(
  onDoubleClick?: (e: go.InputEvent, obj: go.GraphObject) => void
): go.Node {
  const $ = go.GraphObject.make;

  return $(
    go.Node,
    'Spot',
    {
      locationObjectName: 'UOB_SHAPE',
      locationSpot: go.Spot.Center,
      selectionObjectName: 'UOB_SHAPE',
      doubleClick: onDoubleClick,
      cursor: 'pointer',
      toolTip: $(
        'ToolTip',
        $(
          go.TextBlock,
          { margin: 6, font: '11px sans-serif' },
          new go.Binding('text', '', (data) =>
            data.hasDecomposition
              ? `Действие (UOB): ${data.name}\nКод: ${data.nodeNumber} (${data.uobNumber})\n[Двойной клик для перехода в декомпозицию]`
              : `Действие (UOB): ${data.name}\nКод: ${data.nodeNumber} (${data.uobNumber})`
          )
        )
      ),
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

    // Main Box
    $(
      go.Panel,
      'Auto',
      { name: 'UOB_SHAPE', minSize: new go.Size(170, 90) },
      $(
        go.Shape,
        'Rectangle',
        {
          fill: '#FFFFFF',
          stroke: '#1E293B',
          strokeWidth: 2,
        },
        new go.Binding('stroke', 'hasDecomposition', (has) => (has ? '#0284C7' : '#1E293B')),
        new go.Binding('strokeWidth', 'hasDecomposition', (has) => (has ? 2.5 : 2))
      ),

      // Vertical stack: top is Activity Name, bottom is dividing line and metadata
      $(
        go.Panel,
        'Table',
        { margin: 0, defaultAlignment: go.Spot.Center },

        // Process Name (Center compartment)
        $(
          go.TextBlock,
          {
            row: 0,
            column: 0,
            columnSpan: 2,
            font: 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            stroke: '#0F172A',
            textAlign: 'center',
            wrap: go.TextBlock.WrapFit,
            maxSize: new go.Size(155, NaN),
            margin: new go.Margin(10, 8, 10, 8),
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),

        // Horizontal dividing line
        $(go.Shape, 'LineH', {
          row: 1,
          column: 0,
          columnSpan: 2,
          stroke: '#64748B',
          strokeWidth: 1,
          stretch: go.Stretch.Horizontal,
        }),

        // Bottom compartment: Left = Node Number, Right = UOB Identifier / Decomp
        $(
          go.TextBlock,
          {
            row: 2,
            column: 0,
            alignment: go.Spot.Left,
            font: 'bold 11px monospace',
            stroke: '#334155',
            margin: new go.Margin(4, 6, 4, 6),
          },
          new go.Binding('text', 'nodeNumber')
        ),

        $(
          go.Panel,
          'Horizontal',
          {
            row: 2,
            column: 1,
            alignment: go.Spot.Right,
            margin: new go.Margin(4, 6, 4, 6),
          },
          // Decomposition indicator tag
          $(
            go.Panel,
            'Auto',
            { margin: new go.Margin(0, 4, 0, 0) },
            new go.Binding('visible', 'hasDecomposition'),
            $(go.Shape, 'RoundedRectangle', {
              fill: '#E0F2FE',
              stroke: '#0284C7',
              strokeWidth: 1,
              parameter1: 2,
            }),
            $(go.TextBlock, {
              font: '9px monospace',
              stroke: '#0369A1',
              margin: new go.Margin(1, 3, 1, 3),
              text: 'Decomp',
            })
          ),
          $(
            go.TextBlock,
            {
              font: '10px monospace',
              stroke: '#64748B',
            },
            new go.Binding('text', 'uobNumber')
          )
        )
      )
    ),

    // Inflow port (Left)
    $(go.Shape, 'Circle', {
      portId: 'IN',
      alignment: new go.Spot(0, 0.5),
      alignmentFocus: go.Spot.Center,
      desiredSize: new go.Size(8, 8),
      fill: '#2563EB',
      stroke: '#1D4ED8',
      strokeWidth: 1,
      toLinkable: true,
      fromLinkable: false,
      cursor: 'crosshair',
    }),

    // Outflow port (Right)
    $(go.Shape, 'Circle', {
      portId: 'OUT',
      alignment: new go.Spot(1, 0.5),
      alignmentFocus: go.Spot.Center,
      desiredSize: new go.Size(8, 8),
      fill: '#059669',
      stroke: '#047857',
      strokeWidth: 1,
      toLinkable: false,
      fromLinkable: true,
      cursor: 'crosshair',
    })
  );
}
