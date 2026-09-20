import * as go from 'gojs';

export function createActivityNodeTemplate(
  onDoubleClick?: (e: go.InputEvent, obj: go.GraphObject) => void
): go.Node {
  const $ = go.GraphObject.make;

  return $(
    go.Node,
    'Spot',
    {
      locationObjectName: 'MAIN_RECT',
      locationSpot: go.Spot.Center,
      selectionObjectName: 'MAIN_RECT',
      doubleClick: onDoubleClick,
      cursor: 'pointer',
      toolTip: $(
        'ToolTip',
        $(
          go.TextBlock,
          { margin: 6, font: '11px sans-serif' },
          new go.Binding('text', '', (data) =>
            data.hasDecomposition
              ? `Функция: ${data.name}\nКод: ${data.nodeNumber}\n[Двойной клик для перехода в декомпозицию]`
              : `Функция: ${data.name}\nКод: ${data.nodeNumber}`
          )
        )
      ),
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

    // Outer container
    $(
      go.Panel,
      'Auto',
      { name: 'MAIN_RECT', minSize: new go.Size(180, 100) },
      $(
        go.Shape,
        'Rectangle',
        {
          fill: '#FFFFFF',
          stroke: '#1A365D',
          strokeWidth: 2,
          portId: '', // Default port
        },
        new go.Binding('stroke', 'hasDecomposition', (has) => (has ? '#0D47A1' : '#1A365D')),
        new go.Binding('strokeWidth', 'hasDecomposition', (has) => (has ? 2.5 : 2))
      ),

      // Box inner layout
      $(
        go.Panel,
        'Table',
        { margin: 8, defaultAlignment: go.Spot.Center },

        // Function / Activity Name (Center)
        $(
          go.TextBlock,
          {
            row: 0,
            column: 0,
            columnSpan: 2,
            font: 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            stroke: '#1E293B',
            textAlign: 'center',
            wrap: go.TextBlock.WrapFit,
            width: 160,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),

        // Decomposition badge (if decomposed)
        $(
          go.Panel,
          'Auto',
          {
            row: 1,
            column: 0,
            alignment: go.Spot.BottomLeft,
            margin: new go.Margin(8, 0, 0, 0),
          },
          new go.Binding('visible', 'hasDecomposition'),
          $(go.Shape, 'RoundedRectangle', {
            fill: '#E0E7FF',
            stroke: '#4338CA',
            strokeWidth: 1,
            parameter1: 3,
          }),
          $(
            go.TextBlock,
            {
              font: '9px monospace',
              stroke: '#3730A3',
              margin: new go.Margin(2, 4, 1, 4),
            },
            new go.Binding('text', 'dNumber', (d) => (d ? `Декомпозиция: ${d}` : 'Декомпозиция'))
          )
        ),

        // Bottom-right corner: Detail Number (1..6)
        $(
          go.TextBlock,
          {
            row: 1,
            column: 1,
            alignment: go.Spot.BottomRight,
            font: 'bold 15px sans-serif',
            stroke: '#1E293B',
            margin: new go.Margin(8, 0, 0, 0),
          },
          new go.Binding('text', 'detailNumber')
        )
      )
    ),

    // ICOM Ports (4 strict sides per FIPS 183)
    // 1. CONTROL PORT (Top)
    $(go.Shape, 'Circle', {
      portId: 'CONTROL',
      alignment: new go.Spot(0.5, 0),
      alignmentFocus: go.Spot.Center,
      desiredSize: new go.Size(8, 8),
      fill: '#D97706',
      stroke: '#92400E',
      strokeWidth: 1,
      toLinkable: true,
      fromLinkable: false,
      cursor: 'crosshair',
    }),

    // 2. INPUT PORT (Left)
    $(go.Shape, 'Circle', {
      portId: 'INPUT',
      alignment: new go.Spot(0, 0.5),
      alignmentFocus: go.Spot.Center,
      desiredSize: new go.Size(8, 8),
      fill: '#2563EB',
      stroke: '#1E40AF',
      strokeWidth: 1,
      toLinkable: true,
      fromLinkable: false,
      cursor: 'crosshair',
    }),

    // 3. OUTPUT PORT (Right)
    $(go.Shape, 'Circle', {
      portId: 'OUTPUT',
      alignment: new go.Spot(1, 0.5),
      alignmentFocus: go.Spot.Center,
      desiredSize: new go.Size(8, 8),
      fill: '#059669',
      stroke: '#065F46',
      strokeWidth: 1,
      toLinkable: false,
      fromLinkable: true,
      cursor: 'crosshair',
    }),

    // 4. MECHANISM PORT (Bottom)
    $(go.Shape, 'Circle', {
      portId: 'MECHANISM',
      alignment: new go.Spot(0.5, 1),
      alignmentFocus: go.Spot.Center,
      desiredSize: new go.Size(8, 8),
      fill: '#7C3AED',
      stroke: '#5B21B6',
      strokeWidth: 1,
      toLinkable: true,
      fromLinkable: false,
      cursor: 'crosshair',
    }),

    // 5. CALL PORT (Bottom Right)
    $(go.Shape, 'Circle', {
      portId: 'CALL',
      alignment: new go.Spot(0.8, 1),
      alignmentFocus: go.Spot.Center,
      desiredSize: new go.Size(8, 8),
      fill: '#DC2626',
      stroke: '#991B1B',
      strokeWidth: 1,
      toLinkable: false,
      fromLinkable: true,
      cursor: 'crosshair',
    }),

    // Node Number label outside/below box (e.g. A0, A1, A2)
    $(
      go.TextBlock,
      {
        alignment: new go.Spot(0, 1),
        alignmentFocus: new go.Spot(0, -0.2),
        font: 'bold 12px sans-serif',
        stroke: '#475569',
      },
      new go.Binding('text', 'nodeNumber')
    )
  );
}
