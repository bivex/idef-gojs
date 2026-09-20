import * as go from 'gojs';
import { ScreenType } from '../../../../../domain/models/IDEF8Screen';

export function createIDEF8NodeTemplateMap(): go.Map<string, go.Node> {
  const $ = go.GraphObject.make;
  const map = new go.Map<string, go.Node>();

  // ==========================================
  // 1. Screen / Dialog / Window Template
  // ==========================================
  const screenTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(220, 110) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 8,
        fill: '#FFFFFF',
        strokeWidth: 2,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      },
      new go.Binding('stroke', 'screenType', (t) => {
        if (t === ScreenType.MODAL_DIALOG) return '#EF4444'; // Red for modal
        if (t === ScreenType.CONTROL_PANEL) return '#8B5CF6'; // Purple for control
        if (t === ScreenType.REPORT_VIEW) return '#059669'; // Emerald for reports
        return '#2563EB'; // Blue for dashboard / form
      })),
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
            padding: new go.Margin(6, 10, 6, 10),
          },
          new go.Binding('background', 'screenType', (t) => {
            if (t === ScreenType.MODAL_DIALOG) return '#FEF2F2';
            if (t === ScreenType.CONTROL_PANEL) return '#F5F3FF';
            if (t === ScreenType.REPORT_VIEW) return '#ECFDF5';
            return '#EFF6FF';
          }),
          $(
            go.TextBlock,
            {
              font: 'bold 11px -apple-system, sans-serif',
            },
            new go.Binding('text', 'screenType', (t) => {
              if (t === ScreenType.MODAL_DIALOG) return '⚠️ МОДАЛЬНЫЙ ДИАЛОГ';
              if (t === ScreenType.CONTROL_PANEL) return '🎛️ ПАНЕЛЬ УПРАВЛЕНИЯ';
              if (t === ScreenType.REPORT_VIEW) return '📈 АНАЛИТИКА / ОТЧЕТ';
              if (t === ScreenType.FORM) return '📝 ФОРМА ВВОДА';
              return '🖥️ ЭКРАН HMI / SCADA';
            }),
            new go.Binding('stroke', 'screenType', (t) => {
              if (t === ScreenType.MODAL_DIALOG) return '#DC2626';
              if (t === ScreenType.CONTROL_PANEL) return '#7C3AED';
              if (t === ScreenType.REPORT_VIEW) return '#047857';
              return '#1D4ED8';
            })
          ),
          $(
            go.TextBlock,
            {
              font: 'bold 9px monospace',
              stroke: '#475569',
              margin: new go.Margin(0, 0, 0, 8),
              alignment: go.Spot.Right,
            },
            new go.Binding('text', 'state', (st) => `[${st}]`)
          )
        ),
        // Title Text
        $(
          go.Panel,
          'Auto',
          {
            stretch: go.Stretch.Horizontal,
            padding: new go.Margin(8, 10, 6, 10),
          },
          $(
            go.TextBlock,
            {
              font: 'bold 12px -apple-system, sans-serif',
              stroke: '#0F172A',
              wrap: go.Wrap.Fit,
              maxLines: 3,
              editable: true,
            },
            new go.Binding('text', 'name').makeTwoWay()
          )
        ),
        // Widgets panel
        $(
          go.Panel,
          'Vertical',
          {
            stretch: go.Stretch.Horizontal,
            padding: new go.Margin(2, 10, 8, 10),
            itemTemplate: $(
              go.Panel,
              'Horizontal',
              { margin: new go.Margin(2, 0, 2, 0) },
              $(
                go.TextBlock,
                { font: '9px monospace', stroke: '#2563EB', margin: new go.Margin(0, 4, 0, 0) },
                new go.Binding('text', 'widgetType', (wt) => `[${wt}]`)
              ),
              $(
                go.TextBlock,
                { font: '10px -apple-system, sans-serif', stroke: '#334155' },
                new go.Binding('text', 'name')
              )
            ),
          },
          new go.Binding('itemArray', 'widgets')
        ),
        // Description
        $(
          go.TextBlock,
          {
            font: 'italic 10px -apple-system, sans-serif',
            stroke: '#64748B',
            margin: new go.Margin(0, 10, 8, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
          },
          new go.Binding('text', 'description'),
          new go.Binding('visible', 'description', (d) => !!d && d.length > 0)
        )
      )
    )
  );

  // ==========================================
  // 2. User Action Template (Действие пользователя)
  // ==========================================
  const userActionTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(180, 75) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 16, // Pill shape
        fill: '#FFFBEB',
        stroke: '#D97706', // Amber
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
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#FEF3C7',
            padding: new go.Margin(5, 10, 5, 10),
          },
          $(go.TextBlock, '👆 ДЕЙСТВИЕ', {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#B45309',
          }),
          $(
            go.TextBlock,
            {
              font: 'bold 9px monospace',
              stroke: '#78350F',
              margin: new go.Margin(0, 0, 0, 6),
              alignment: go.Spot.Right,
            },
            new go.Binding('text', 'modality')
          )
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 11px -apple-system, sans-serif',
            stroke: '#1E293B',
            margin: new go.Margin(6, 10, 6, 10),
            wrap: go.Wrap.Fit,
            maxLines: 3,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        )
      )
    )
  );

  // ==========================================
  // 3. System Response Template (Реакция системы)
  // ==========================================
  const systemResponseTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(190, 75) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 6,
        fill: '#F0FDF4',
        stroke: '#16A34A', // Green
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
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#DCFCE7',
            padding: new go.Margin(5, 10, 5, 10),
          },
          $(go.TextBlock, '⚡ РЕАКЦИЯ СИСТЕМЫ', {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#15803D',
          }),
          $(
            go.TextBlock,
            {
              font: 'bold 9px monospace',
              stroke: '#14532D',
              margin: new go.Margin(0, 0, 0, 6),
              alignment: go.Spot.Right,
            },
            new go.Binding('text', 'responseType')
          )
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 11px -apple-system, sans-serif',
            stroke: '#1E293B',
            margin: new go.Margin(6, 10, 6, 10),
            wrap: go.Wrap.Fit,
            maxLines: 3,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        )
      )
    )
  );

  // ==========================================
  // 4. User Role Template (Роль / Персона)
  // ==========================================
  const userRoleTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(170, 70) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 10,
        fill: '#FAF5FF',
        stroke: '#9333EA', // Purple
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
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            background: '#F3E8FF',
            padding: new go.Margin(5, 10, 5, 10),
          },
          $(go.TextBlock, '👤 РОЛЬ / ПЕРСОНА', {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#7E22CE',
          }),
          $(
            go.TextBlock,
            {
              font: 'bold 9px monospace',
              stroke: '#581C87',
              margin: new go.Margin(0, 0, 0, 6),
              alignment: go.Spot.Right,
            },
            new go.Binding('text', 'privilegeLevel')
          )
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 11px -apple-system, sans-serif',
            stroke: '#1E293B',
            margin: new go.Margin(6, 10, 6, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        )
      )
    )
  );

  map.add('screen', screenTemplate);
  map.add('userAction', userActionTemplate);
  map.add('systemResponse', systemResponseTemplate);
  map.add('userRole', userRoleTemplate);

  return map;
}
