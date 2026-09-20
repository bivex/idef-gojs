import * as go from 'gojs';

export function createKindNodeTemplate(): go.Node {
  const $ = go.GraphObject.make;

  return $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'KIND_CARD',
      resizable: true,
      resizeObjectName: 'KIND_CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

    // Card Container
    $(
      go.Panel,
      'Auto',
      { name: 'KIND_CARD', minSize: new go.Size(160, 80) },
      $(
        go.Shape,
        'RoundedRectangle',
        {
          parameter1: 12,
          fill: '#FFFFFF',
          strokeWidth: 2,
          portId: '',
          cursor: 'pointer',
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
        },
        new go.Binding('fill', 'isIndividual', (ind) => (ind ? '#F8FAFC' : '#FFFFFF')),
        new go.Binding('stroke', 'isIndividual', (ind) => (ind ? '#0284C7' : '#0F172A')),
        new go.Binding('strokeDashArray', 'isIndividual', (ind) => (ind ? [6, 3] : null))
      ),

      $(
        go.Panel,
        'Table',
        { margin: 0, defaultAlignment: go.Spot.Left },

        // 1. Header (Stereotype & Kind Name)
        $(
          go.Panel,
          'Vertical',
          {
            row: 0,
            column: 0,
            stretch: go.Stretch.Horizontal,
            background: '#F1F5F9',
            padding: new go.Margin(6, 12, 6, 12),
          },
          // Stereotype: «Kind» or «Individual»
          $(
            go.TextBlock,
            {
              font: 'bold 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              stroke: '#64748B',
              alignment: go.Spot.Center,
            },
            new go.Binding('text', 'isIndividual', (ind) => (ind ? '● ИНДИВИД (INDIVIDUAL)' : '⭘ ВИД (KIND)')),
            new go.Binding('stroke', 'isIndividual', (ind) => (ind ? '#0284C7' : '#475569'))
          ),
          // Kind / Concept Name
          $(
            go.TextBlock,
            {
              alignment: go.Spot.Center,
              font: 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              stroke: '#0F172A',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(180, NaN),
              editable: true,
            },
            new go.Binding('text', 'name').makeTwoWay()
          ),
          // Optional Description
          $(
            go.TextBlock,
            {
              alignment: go.Spot.Center,
              font: 'italic 10px sans-serif',
              stroke: '#64748B',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(180, NaN),
              margin: new go.Margin(2, 0, 0, 0),
            },
            new go.Binding('text', 'description'),
            new go.Binding('visible', 'description', (d) => !!d)
          )
        ),

        // Separator
        $(
          go.Shape,
          'LineH',
          {
            row: 1,
            column: 0,
            stroke: '#E2E8F0',
            strokeWidth: 1,
            stretch: go.Stretch.Horizontal,
          },
          new go.Binding('visible', 'properties', (props) => props && props.length > 0)
        ),

        // 2. Properties Compartment
        $(
          go.Panel,
          'Vertical',
          {
            row: 2,
            column: 0,
            stretch: go.Stretch.Horizontal,
            padding: new go.Margin(4, 10, 6, 10),
            defaultAlignment: go.Spot.Left,
            itemTemplate: $(
              go.Panel,
              'Horizontal',
              { margin: new go.Margin(1, 0, 1, 0) },
              $(go.Shape, 'Circle', {
                width: 4,
                height: 4,
                fill: '#64748B',
                stroke: null,
                margin: new go.Margin(0, 4, 0, 0),
              }),
              $(
                go.TextBlock,
                {
                  font: '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  stroke: '#334155',
                },
                new go.Binding('text', '', (p) => {
                  const type = p.valueType ? `: ${p.valueType}` : '';
                  const req = p.isMandatory ? ' *' : '';
                  return `${p.name}${type}${req}`;
                })
              )
            ),
          },
          new go.Binding('itemArray', 'properties'),
          new go.Binding('visible', 'properties', (props) => props && props.length > 0)
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
