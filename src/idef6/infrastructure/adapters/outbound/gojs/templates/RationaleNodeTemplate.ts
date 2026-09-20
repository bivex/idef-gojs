import * as go from 'gojs';

export function createRationaleNodeTemplateMap(): go.Map<string, go.Node> {
  const $ = go.GraphObject.make;
  const map = new go.Map<string, go.Node>();

  // 1. Issue Node (Вопрос / Проблема)
  const issueTemplate = $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'CARD',
      resizable: true,
      resizeObjectName: 'CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Panel,
      'Auto',
      { name: 'CARD', minSize: new go.Size(180, 85) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 8,
        fill: '#F8FAFC',
        stroke: '#2563EB',
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
        'Vertical',
        { margin: 0, stretch: go.Stretch.Fill },
        // Header
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#EFF6FF',
            padding: new go.Margin(6, 10, 6, 10),
          },
          $(go.TextBlock, '❓ ВОПРОС', {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#1D4ED8',
          }),
          $(
            go.TextBlock,
            {
              font: 'bold 9px monospace',
              stroke: '#FFFFFF',
              margin: new go.Margin(0, 0, 0, 6),
              alignment: go.Spot.Right,
            },
            new go.Binding('text', 'status'),
            new go.Binding('background', 'status', (s) =>
              s === 'RESOLVED' ? '#10B981' : s === 'REJECTED' ? '#EF4444' : '#F59E0B'
            )
          )
        ),
        // Separator
        $(go.Shape, 'LineH', { stroke: '#DBEAFE', strokeWidth: 1, stretch: go.Stretch.Horizontal }),
        // Body
        $(
          go.Panel,
          'Vertical',
          { padding: new go.Margin(6, 10, 8, 10), defaultAlignment: go.Spot.Left },
          $(
            go.TextBlock,
            {
              font: 'bold 12px -apple-system, sans-serif',
              stroke: '#0F172A',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(200, NaN),
              editable: true,
            },
            new go.Binding('text', 'name').makeTwoWay()
          ),
          $(
            go.TextBlock,
            {
              font: 'italic 10px sans-serif',
              stroke: '#64748B',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(200, NaN),
              margin: new go.Margin(2, 0, 0, 0),
            },
            new go.Binding('text', 'description'),
            new go.Binding('visible', 'description', (d) => !!d)
          )
        )
      )
    )
  );

  // 2. Alternative Node (Альтернатива / Вариант решения)
  const alternativeTemplate = $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'CARD',
      resizable: true,
      resizeObjectName: 'CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Panel,
      'Auto',
      { name: 'CARD', minSize: new go.Size(180, 85) },
      $(
        go.Shape,
        'RoundedRectangle',
        {
          parameter1: 10,
          fill: '#FFFFFF',
          strokeWidth: 2,
          portId: '',
          cursor: 'pointer',
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
        },
        new go.Binding('stroke', 'status', (s) =>
          s === 'ACCEPTED' ? '#059669' : s === 'REJECTED' ? '#DC2626' : '#D97706'
        ),
        new go.Binding('fill', 'status', (s) =>
          s === 'ACCEPTED' ? '#F0FDF4' : s === 'REJECTED' ? '#FEF2F2' : '#FFFFFF'
        )
      ),
      $(
        go.Panel,
        'Vertical',
        { margin: 0, stretch: go.Stretch.Fill },
        // Header
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#F8FAFC',
            padding: new go.Margin(6, 10, 6, 10),
          },
          $(go.TextBlock, '💡 АЛЬТЕРНАТИВА', {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#475569',
          }),
          $(
            go.TextBlock,
            {
              font: 'bold 9px monospace',
              stroke: '#FFFFFF',
              margin: new go.Margin(0, 0, 0, 6),
            },
            new go.Binding('text', 'status'),
            new go.Binding('background', 'status', (s) =>
              s === 'ACCEPTED' ? '#059669' : s === 'REJECTED' ? '#DC2626' : '#D97706'
            )
          )
        ),
        // Separator
        $(go.Shape, 'LineH', { stroke: '#E2E8F0', strokeWidth: 1, stretch: go.Stretch.Horizontal }),
        // Body
        $(
          go.Panel,
          'Vertical',
          { padding: new go.Margin(6, 10, 8, 10), defaultAlignment: go.Spot.Left },
          $(
            go.TextBlock,
            {
              font: 'bold 12px -apple-system, sans-serif',
              stroke: '#0F172A',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(200, NaN),
              editable: true,
            },
            new go.Binding('text', 'name').makeTwoWay()
          ),
          $(
            go.TextBlock,
            {
              font: 'italic 10px sans-serif',
              stroke: '#64748B',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(200, NaN),
              margin: new go.Margin(2, 0, 0, 0),
            },
            new go.Binding('text', 'description'),
            new go.Binding('visible', 'description', (d) => !!d)
          )
        )
      )
    )
  );

  // 3. Criterion Node (Критерий / Ограничение)
  const criterionTemplate = $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'CARD',
      resizable: true,
      resizeObjectName: 'CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Panel,
      'Auto',
      { name: 'CARD', minSize: new go.Size(160, 75) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 6,
        fill: '#FAF5FF',
        stroke: '#7C3AED',
        strokeWidth: 1.5,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      }),
      $(
        go.Panel,
        'Vertical',
        { margin: 0, stretch: go.Stretch.Fill },
        // Header
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#F3E8FF',
            padding: new go.Margin(5, 8, 5, 8),
          },
          $(go.TextBlock, '⚖️ КРИТЕРИЙ', {
            font: 'bold 9px -apple-system, sans-serif',
            stroke: '#6D28D9',
          }),
          $(
            go.TextBlock,
            {
              font: 'bold 8px monospace',
              stroke: '#4C1D95',
              margin: new go.Margin(0, 0, 0, 4),
            },
            new go.Binding('text', 'type')
          )
        ),
        $(go.Shape, 'LineH', { stroke: '#E9D5FF', strokeWidth: 1, stretch: go.Stretch.Horizontal }),
        $(
          go.Panel,
          'Vertical',
          { padding: new go.Margin(5, 8, 6, 8), defaultAlignment: go.Spot.Left },
          $(
            go.TextBlock,
            {
              font: 'bold 11px -apple-system, sans-serif',
              stroke: '#1E1B4B',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(170, NaN),
              editable: true,
            },
            new go.Binding('text', 'name').makeTwoWay()
          ),
          $(
            go.TextBlock,
            {
              font: 'italic 9px sans-serif',
              stroke: '#6B7280',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(170, NaN),
            },
            new go.Binding('text', 'description'),
            new go.Binding('visible', 'description', (d) => !!d)
          )
        )
      )
    )
  );

  // 4. Argument Node (Аргумент: ЗА или ПРОТИВ)
  const argumentTemplate = $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'CARD',
      resizable: true,
      resizeObjectName: 'CARD',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Panel,
      'Auto',
      { name: 'CARD', minSize: new go.Size(160, 65) },
      $(
        go.Shape,
        'RoundedRectangle',
        {
          parameter1: 6,
          strokeWidth: 1.5,
          portId: '',
          cursor: 'pointer',
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
        },
        new go.Binding('stroke', 'type', (t) => (t === 'PRO' ? '#059669' : '#DC2626')),
        new go.Binding('fill', 'type', (t) => (t === 'PRO' ? '#ECFDF5' : '#FEF2F2'))
      ),
      $(
        go.Panel,
        'Vertical',
        { margin: 0, stretch: go.Stretch.Fill },
        // Header
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            padding: new go.Margin(4, 8, 4, 8),
          },
          new go.Binding('background', 'type', (t) => (t === 'PRO' ? '#D1FAE5' : '#FEE2E2')),
          $(
            go.TextBlock,
            {
              font: 'bold 9px -apple-system, sans-serif',
            },
            new go.Binding('text', 'type', (t) => (t === 'PRO' ? '👍 АРГУМЕНТ [ЗА]' : '👎 АРГУМЕНТ [ПРОТИВ]')),
            new go.Binding('stroke', 'type', (t) => (t === 'PRO' ? '#065F46' : '#991B1B'))
          )
        ),
        $(
          go.Panel,
          'Vertical',
          { padding: new go.Margin(5, 8, 6, 8), defaultAlignment: go.Spot.Left },
          $(
            go.TextBlock,
            {
              font: '11px -apple-system, sans-serif',
              stroke: '#1F2937',
              wrap: go.TextBlock.WrapFit,
              maxSize: new go.Size(170, NaN),
              editable: true,
            },
            new go.Binding('text', 'name').makeTwoWay()
          )
        )
      )
    )
  );

  map.add('issue', issueTemplate);
  map.add('alternative', alternativeTemplate);
  map.add('criterion', criterionTemplate);
  map.add('argument', argumentTemplate);
  map.add('', issueTemplate); // Default fallback

  return map;
}
