import * as go from 'gojs';

export function createClassNodeTemplate(): go.Node {
  const $ = go.GraphObject.make;

  return $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'CLASS_CARD',
      resizable: true,
      resizeObjectName: 'CLASS_CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

    // Card Container
    $(
      go.Panel,
      'Auto',
      { name: 'CLASS_CARD', minSize: new go.Size(180, 110) },
      $(go.Shape, 'Rectangle', {
        fill: '#FFFFFF',
        stroke: '#1E293B',
        strokeWidth: 2,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      }),

      $(
        go.Panel,
        'Table',
        { margin: 0, defaultAlignment: go.Spot.Left },

        // 1. Header (Class Name & Stereotype)
        $(
          go.Panel,
          'Vertical',
          {
            row: 0,
            column: 0,
            stretch: go.Stretch.Horizontal,
            background: '#F1F5F9',
            padding: new go.Margin(6, 10, 6, 10),
          },
          // Stereotype: «interface» or {abstract}
          $(
            go.TextBlock,
            {
              font: 'italic 10px sans-serif',
              stroke: '#64748B',
              alignment: go.Spot.Center,
            },
            new go.Binding('text', '', (d) => {
              if (d.isInterface) return '«interface»';
              if (d.isAbstract) return '{abstract}';
              return '';
            }),
            new go.Binding('visible', '', (d) => d.isInterface || d.isAbstract)
          ),
          // Class Name
          $(
            go.TextBlock,
            {
              alignment: go.Spot.Center,
              font: 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              stroke: '#0F172A',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(190, NaN),
              editable: true,
            },
            new go.Binding('text', 'name').makeTwoWay(),
            new go.Binding('font', 'isAbstract', (isAbs) =>
              isAbs
                ? 'italic bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                : 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            )
          )
        ),

        // Separator 1
        $(go.Shape, 'LineH', {
          row: 1,
          column: 0,
          stroke: '#CBD5E1',
          strokeWidth: 1,
          stretch: go.Stretch.Horizontal,
        }),

        // 2. Attributes Compartment
        $(
          go.Panel,
          'Vertical',
          {
            row: 2,
            column: 0,
            stretch: go.Stretch.Horizontal,
            padding: new go.Margin(6, 8, 6, 8),
            defaultAlignment: go.Spot.Left,
            itemTemplate: $(
              go.Panel,
              'Horizontal',
              { margin: new go.Margin(1, 0, 1, 0) },
              $(
                go.TextBlock,
                {
                  font: '11px monospace',
                  stroke: '#334155',
                },
                new go.Binding('text', '', (attr) => {
                  const sym = attr.visibility === 'private' ? '-' : attr.visibility === 'protected' ? '#' : '+';
                  const st = attr.isStatic ? 'static ' : '';
                  return `${sym} ${st}${attr.name}: ${attr.dataType}`;
                })
              )
            ),
          },
          new go.Binding('itemArray', 'attributes')
        ),

        // Separator 2
        $(go.Shape, 'LineH', {
          row: 3,
          column: 0,
          stroke: '#CBD5E1',
          strokeWidth: 1,
          stretch: go.Stretch.Horizontal,
        }),

        // 3. Methods Compartment
        $(
          go.Panel,
          'Vertical',
          {
            row: 4,
            column: 0,
            stretch: go.Stretch.Horizontal,
            padding: new go.Margin(6, 8, 6, 8),
            defaultAlignment: go.Spot.Left,
            itemTemplate: $(
              go.Panel,
              'Horizontal',
              { margin: new go.Margin(1, 0, 1, 0) },
              $(
                go.TextBlock,
                {
                  font: '11px monospace',
                  stroke: '#1E293B',
                },
                new go.Binding('text', '', (m) => {
                  const sym = m.visibility === 'private' ? '-' : m.visibility === 'protected' ? '#' : '+';
                  const params = (m.parameters || []).map((p: any) => `${p.name}: ${p.type}`).join(', ');
                  return `${sym} ${m.name}(${params}): ${m.returnType}`;
                }),
                new go.Binding('font', 'isAbstract', (isAbs) =>
                  isAbs ? 'italic 11px monospace' : '11px monospace'
                )
              )
            ),
          },
          new go.Binding('itemArray', 'methods')
        )
      )
    ),

    // 4 universal connection ports
    $(go.Shape, 'Circle', {
      portId: 'TOP',
      alignment: new go.Spot(0.5, 0),
      desiredSize: new go.Size(6, 6),
      fill: 'transparent',
      stroke: null,
      fromLinkable: true,
      toLinkable: true,
    }),
    $(go.Shape, 'Circle', {
      portId: 'BOTTOM',
      alignment: new go.Spot(0.5, 1),
      desiredSize: new go.Size(6, 6),
      fill: 'transparent',
      stroke: null,
      fromLinkable: true,
      toLinkable: true,
    }),
    $(go.Shape, 'Circle', {
      portId: 'LEFT',
      alignment: new go.Spot(0, 0.5),
      desiredSize: new go.Size(6, 6),
      fill: 'transparent',
      stroke: null,
      fromLinkable: true,
      toLinkable: true,
    }),
    $(go.Shape, 'Circle', {
      portId: 'RIGHT',
      alignment: new go.Spot(1, 0.5),
      desiredSize: new go.Size(6, 6),
      fill: 'transparent',
      stroke: null,
      fromLinkable: true,
      toLinkable: true,
    })
  );
}
