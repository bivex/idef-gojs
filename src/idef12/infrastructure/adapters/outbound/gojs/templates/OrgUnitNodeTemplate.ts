import * as go from 'gojs';
import { OrgUnitType } from '../../../../../domain/models/IDEF12OrgUnit';
import { PositionLevel } from '../../../../../domain/models/IDEF12Position';
import { OrgRoleType } from '../../../../../domain/models/IDEF12OrgRole';
import { CompetencyCriticality } from '../../../../../domain/models/IDEF12Competency';

export function createIDEF12NodeTemplateMap(): go.Map<string, go.Node> {
  const $ = go.GraphObject.make;
  const map = new go.Map<string, go.Node>();

  // ==========================================
  // 1. OrgUnit Template (Подразделение предприятия)
  // ==========================================
  const orgUnitTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(240, 115) },
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
      new go.Binding('stroke', 'unitType', (t) => {
        if (t === OrgUnitType.DIVISION) return '#1E3A8A';   // Dark Blue
        if (t === OrgUnitType.DEPARTMENT) return '#0284C7'; // Sky
        if (t === OrgUnitType.WORKSHOP) return '#D97706';   // Amber / Workshop
        if (t === OrgUnitType.LABORATORY) return '#9333EA'; // Purple / Science
        if (t === OrgUnitType.BRIGADE) return '#059669';    // Emerald
        return '#64748B';                                   // Slate
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
          new go.Binding('background', 'unitType', (t) => {
            if (t === OrgUnitType.DIVISION) return '#DBEAFE';
            if (t === OrgUnitType.DEPARTMENT) return '#E0F2FE';
            if (t === OrgUnitType.WORKSHOP) return '#FEF3C7';
            if (t === OrgUnitType.LABORATORY) return '#F3E8FF';
            if (t === OrgUnitType.BRIGADE) return '#D1FAE5';
            return '#F1F5F9';
          }),
          // Code badge
          $(
            go.Panel,
            'Auto',
            { margin: new go.Margin(0, 6, 0, 0) },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 4,
              fill: '#0F172A',
              strokeWidth: 0,
            }),
            $(go.TextBlock, {
              font: 'bold 9px monospace',
              stroke: '#F8FAFC',
              margin: new go.Margin(2, 6, 2, 6),
            },
            new go.Binding('text', 'code'))
          ),
          // Type label
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
          },
          new go.Binding('text', 'unitType', (t) => {
            if (t === OrgUnitType.DIVISION) return '🏛️ ДИРЕКЦИЯ';
            if (t === OrgUnitType.DEPARTMENT) return '🏢 УПРАВЛЕНИЕ';
            if (t === OrgUnitType.WORKSHOP) return '🏭 ЦЕХ';
            if (t === OrgUnitType.LABORATORY) return '🔬 ЛАБОРАТОРИЯ';
            if (t === OrgUnitType.BRIGADE) return '👥 УЧАСТОК / БРИГАДА';
            return '🤝 ПАРТНЕР';
          }),
          new go.Binding('stroke', 'unitType', (t) => {
            if (t === OrgUnitType.DIVISION) return '#1E40AF';
            if (t === OrgUnitType.DEPARTMENT) return '#0369A1';
            if (t === OrgUnitType.WORKSHOP) return '#B45309';
            if (t === OrgUnitType.LABORATORY) return '#7E22CE';
            if (t === OrgUnitType.BRIGADE) return '#047857';
            return '#475569';
          }))
        ),
        // Body
        $(
          go.Panel,
          'Vertical',
          {
            padding: new go.Margin(8, 10, 8, 10),
            alignment: go.Spot.Left,
            stretch: go.Stretch.Horizontal,
          },
          // Unit Name
          $(go.TextBlock, {
            font: 'bold 12px -apple-system, sans-serif',
            stroke: '#0F172A',
            wrap: go.Wrap.Fit,
            maxSize: new go.Size(220, NaN),
            margin: new go.Margin(0, 0, 4, 0),
          },
          new go.Binding('text', 'name')),
          // Head position
          $(go.TextBlock, {
            font: 'italic 11px -apple-system, sans-serif',
            stroke: '#475569',
            wrap: go.Wrap.Fit,
            maxSize: new go.Size(220, NaN),
            margin: new go.Margin(0, 0, 4, 0),
          },
          new go.Binding('text', 'headPositionName', (h) => h ? `👤 Рук-ль: ${h}` : '')),
          // Info row (headCount & location)
          $(
            go.Panel,
            'Horizontal',
            { stretch: go.Stretch.Horizontal, margin: new go.Margin(4, 0, 0, 0) },
            $(go.TextBlock, {
              font: '10px -apple-system, sans-serif',
              stroke: '#64748B',
            },
            new go.Binding('text', 'headCount', (c) => `👥 Штат: ${c} чел.`)),
            $(go.TextBlock, {
              font: '10px -apple-system, sans-serif',
              stroke: '#64748B',
              margin: new go.Margin(0, 0, 0, 8),
            },
            new go.Binding('text', 'location', (loc) => loc ? `📍 ${loc}` : ''))
          )
        )
      )
    )
  );

  // ==========================================
  // 2. Position Template (Штатная единица / Должность)
  // ==========================================
  const positionTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(220, 105) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 6,
        fill: '#FAFAFA',
        strokeWidth: 2,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      },
      new go.Binding('stroke', 'positionLevel', (l) => {
        if (l === PositionLevel.EXECUTIVE) return '#DC2626'; // Red
        if (l === PositionLevel.MANAGEMENT) return '#2563EB'; // Blue
        if (l === PositionLevel.ENGINEER) return '#0D9488'; // Teal
        return '#4B5563'; // Gray for Operator
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
            padding: new go.Margin(5, 8, 5, 8),
          },
          new go.Binding('background', 'positionLevel', (l) => {
            if (l === PositionLevel.EXECUTIVE) return '#FEE2E2';
            if (l === PositionLevel.MANAGEMENT) return '#DBEAFE';
            if (l === PositionLevel.ENGINEER) return '#CCFBF1';
            return '#F3F4F6';
          }),
          // Code badge
          $(
            go.Panel,
            'Auto',
            { margin: new go.Margin(0, 6, 0, 0) },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 3,
              fill: '#1E293B',
              strokeWidth: 0,
            }),
            $(go.TextBlock, {
              font: 'bold 9px monospace',
              stroke: '#FFFFFF',
              margin: new go.Margin(2, 5, 2, 5),
            },
            new go.Binding('text', 'code'))
          ),
          // Level badge
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
          },
          new go.Binding('text', 'positionLevel', (l) => {
            if (l === PositionLevel.EXECUTIVE) return '⭐ ТОП-МЕНЕДЖЕР';
            if (l === PositionLevel.MANAGEMENT) return '👔 РУКОВОДИТЕЛЬ';
            if (l === PositionLevel.ENGINEER) return '📐 ИНЖЕНЕР';
            return '🛠️ ОПЕРАТОР';
          }),
          new go.Binding('stroke', 'positionLevel', (l) => {
            if (l === PositionLevel.EXECUTIVE) return '#B91C1C';
            if (l === PositionLevel.MANAGEMENT) return '#1D4ED8';
            if (l === PositionLevel.ENGINEER) return '#0F766E';
            return '#374151';
          }))
        ),
        // Body
        $(
          go.Panel,
          'Vertical',
          {
            padding: new go.Margin(6, 8, 6, 8),
            alignment: go.Spot.Left,
            stretch: go.Stretch.Horizontal,
          },
          $(go.TextBlock, {
            font: 'bold 11px -apple-system, sans-serif',
            stroke: '#111827',
            wrap: go.Wrap.Fit,
            maxSize: new go.Size(200, NaN),
          },
          new go.Binding('text', 'name')),
          // Grade
          $(go.TextBlock, {
            font: '10px -apple-system, sans-serif',
            stroke: '#6B7280',
            margin: new go.Margin(3, 0, 0, 0),
          },
          new go.Binding('text', 'grade', (g) => g ? `🎖️ ${g}` : ''))
        )
      )
    )
  );

  // ==========================================
  // 3. OrgRole Template (Организационная роль / RACI)
  // ==========================================
  const orgRoleTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(210, 85) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 12,
        fill: '#FFFFFF',
        strokeWidth: 2,
        strokeDashArray: [4, 3],
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      },
      new go.Binding('stroke', 'roleType', (r) => {
        if (r === OrgRoleType.ACCOUNTABLE) return '#E11D48'; // Rose
        if (r === OrgRoleType.RESPONSIBLE) return '#2563EB'; // Blue
        if (r === OrgRoleType.AUDITOR) return '#7C3AED';     // Violet
        if (r === OrgRoleType.CONSULTED) return '#D97706';   // Amber
        return '#059669';                                   // Emerald
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
            padding: new go.Margin(5, 8, 5, 8),
          },
          new go.Binding('background', 'roleType', (r) => {
            if (r === OrgRoleType.ACCOUNTABLE) return '#FFE4E6';
            if (r === OrgRoleType.RESPONSIBLE) return '#DBEAFE';
            if (r === OrgRoleType.AUDITOR) return '#EDE9FE';
            if (r === OrgRoleType.CONSULTED) return '#FEF3C7';
            return '#D1FAE5';
          }),
          $(
            go.Panel,
            'Auto',
            { margin: new go.Margin(0, 5, 0, 0) },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 3,
              fill: '#0F172A',
              strokeWidth: 0,
            }),
            $(go.TextBlock, {
              font: 'bold 8px monospace',
              stroke: '#FFFFFF',
              margin: new go.Margin(1, 4, 1, 4),
            },
            new go.Binding('text', 'code'))
          ),
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
          },
          new go.Binding('text', 'roleType', (r) => {
            if (r === OrgRoleType.ACCOUNTABLE) return '🎯 ACCOUNTABLE (A)';
            if (r === OrgRoleType.RESPONSIBLE) return '⚡ RESPONSIBLE (R)';
            if (r === OrgRoleType.AUDITOR) return '🛡️ AUDITOR (Контролёр)';
            if (r === OrgRoleType.CONSULTED) return '💡 CONSULTED (C)';
            return '📢 INFORMED (I)';
          }),
          new go.Binding('stroke', 'roleType', (r) => {
            if (r === OrgRoleType.ACCOUNTABLE) return '#BE123C';
            if (r === OrgRoleType.RESPONSIBLE) return '#1D4ED8';
            if (r === OrgRoleType.AUDITOR) return '#6D28D9';
            if (r === OrgRoleType.CONSULTED) return '#B45309';
            return '#047857';
          }))
        ),
        // Body
        $(
          go.Panel,
          'Vertical',
          {
            padding: new go.Margin(6, 8, 6, 8),
            alignment: go.Spot.Left,
            stretch: go.Stretch.Horizontal,
          },
          $(go.TextBlock, {
            font: 'bold 11px -apple-system, sans-serif',
            stroke: '#0F172A',
            wrap: go.Wrap.Fit,
            maxSize: new go.Size(190, NaN),
          },
          new go.Binding('text', 'name')),
          $(go.TextBlock, {
            font: 'italic 9px -apple-system, sans-serif',
            stroke: '#64748B',
            margin: new go.Margin(2, 0, 0, 0),
          },
          new go.Binding('text', 'scope', (s) => s ? `Область: ${s}` : ''))
        )
      )
    )
  );

  // ==========================================
  // 4. Competency Template (Допуск / Квалификация)
  // ==========================================
  const competencyTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(200, 80) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 4,
        fill: '#FFFBEB',
        strokeWidth: 2,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      },
      new go.Binding('stroke', 'criticality', (c) => {
        if (c === CompetencyCriticality.MANDATORY_LEGAL) return '#DC2626'; // Red
        if (c === CompetencyCriticality.SAFETY_CRITICAL) return '#D97706'; // Amber
        return '#0284C7'; // Sky
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
            padding: new go.Margin(4, 6, 4, 6),
          },
          new go.Binding('background', 'criticality', (c) => {
            if (c === CompetencyCriticality.MANDATORY_LEGAL) return '#FEE2E2';
            if (c === CompetencyCriticality.SAFETY_CRITICAL) return '#FEF3C7';
            return '#E0F2FE';
          }),
          $(
            go.Panel,
            'Auto',
            { margin: new go.Margin(0, 5, 0, 0) },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 3,
              fill: '#0F172A',
              strokeWidth: 0,
            }),
            $(go.TextBlock, {
              font: 'bold 8px monospace',
              stroke: '#FFFFFF',
              margin: new go.Margin(1, 4, 1, 4),
            },
            new go.Binding('text', 'code'))
          ),
          $(go.TextBlock, {
            font: 'bold 9px -apple-system, sans-serif',
          },
          new go.Binding('text', 'criticality', (c) => {
            if (c === CompetencyCriticality.MANDATORY_LEGAL) return '📜 ГОСАТТЕСТАЦИЯ';
            if (c === CompetencyCriticality.SAFETY_CRITICAL) return '⚠️ ДОПУСК ПО БЕЗОПАСНОСТИ';
            return '🎓 КВАЛИФИКАЦИЯ';
          }),
          new go.Binding('stroke', 'criticality', (c) => {
            if (c === CompetencyCriticality.MANDATORY_LEGAL) return '#991B1B';
            if (c === CompetencyCriticality.SAFETY_CRITICAL) return '#92400E';
            return '#0369A1';
          }))
        ),
        // Body
        $(
          go.Panel,
          'Vertical',
          {
            padding: new go.Margin(5, 6, 5, 6),
            alignment: go.Spot.Left,
            stretch: go.Stretch.Horizontal,
          },
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#1F2937',
            wrap: go.Wrap.Fit,
            maxSize: new go.Size(180, NaN),
          },
          new go.Binding('text', 'name')),
          $(go.TextBlock, {
            font: '9px -apple-system, sans-serif',
            stroke: '#6B7280',
            margin: new go.Margin(2, 0, 0, 0),
          },
          new go.Binding('text', 'certificationBody', (b) => b ? `Орган: ${b}` : ''))
        )
      )
    )
  );

  map.add('orgUnit', orgUnitTemplate);
  map.add('position', positionTemplate);
  map.add('orgRole', orgRoleTemplate);
  map.add('competency', competencyTemplate);

  return map;
}
