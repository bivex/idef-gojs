import * as go from 'gojs';
import { ConstraintSeverity, ConstraintStatus, ConstraintType } from '../../../../../domain/models/IDEF9Constraint';
import { ControlledObjectType } from '../../../../../domain/models/IDEF9ControlledObject';
import { MechanismType } from '../../../../../domain/models/IDEF9EnforcementMechanism';
import { DocumentType } from '../../../../../domain/models/IDEF9SourceDocument';

export function createIDEF9NodeTemplateMap(): go.Map<string, go.Node> {
  const $ = go.GraphObject.make;
  const map = new go.Map<string, go.Node>();

  // ==========================================
  // 1. Constraint Template (Ограничение / Бизнес-правило)
  // ==========================================
  const constraintTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(240, 130) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 6,
        fill: '#FFF7F7',
        strokeWidth: 3,
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
      },
      new go.Binding('stroke', 'severity', (sev) => {
        if (sev === ConstraintSeverity.MANDATORY) return '#DC2626';    // Red - жёсткое
        if (sev === ConstraintSeverity.CONDITIONAL) return '#D97706';  // Amber - условное
        return '#94A3B8'; // Slate - предупреждение
      })),
      $(
        go.Panel,
        'Vertical',
        { margin: 0, stretch: go.Stretch.Fill },
        // Header row: code badge + severity badge
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            padding: new go.Margin(5, 8, 5, 8),
          },
          new go.Binding('background', 'severity', (sev) => {
            if (sev === ConstraintSeverity.MANDATORY) return '#FEF2F2';
            if (sev === ConstraintSeverity.CONDITIONAL) return '#FFFBEB';
            return '#F8FAFC';
          }),
          // Code badge
          $(
            go.Panel,
            'Auto',
            { margin: new go.Margin(0, 6, 0, 0) },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 4,
              fill: '#1E293B',
              strokeWidth: 0,
            }),
            $(go.TextBlock, {
              font: 'bold 9px monospace',
              stroke: '#F8FAFC',
              margin: new go.Margin(2, 6, 2, 6),
            },
            new go.Binding('text', 'code'))
          ),
          // Type badge
          $(
            go.Panel,
            'Auto',
            { margin: new go.Margin(0, 6, 0, 0) },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 4,
              strokeWidth: 0,
            },
            new go.Binding('fill', 'constraintType', (t) => {
              if (t === ConstraintType.REGULATORY) return '#DBEAFE';
              if (t === ConstraintType.TECHNICAL) return '#D1FAE5';
              if (t === ConstraintType.POLICY) return '#EDE9FE';
              if (t === ConstraintType.FINANCIAL) return '#FEF9C3';
              return '#FCE7F3';
            })),
            $(go.TextBlock, {
              font: '9px monospace',
              stroke: '#334155',
              margin: new go.Margin(2, 6, 2, 6),
            },
            new go.Binding('text', 'constraintType'))
          ),
          // Severity badge (right-aligned)
          $(
            go.Panel,
            'Auto',
            { alignment: go.Spot.Right },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 4,
              strokeWidth: 0,
            },
            new go.Binding('fill', 'severity', (sev) => {
              if (sev === ConstraintSeverity.MANDATORY) return '#DC2626';
              if (sev === ConstraintSeverity.CONDITIONAL) return '#D97706';
              return '#64748B';
            })),
            $(go.TextBlock, {
              font: 'bold 9px -apple-system, sans-serif',
              stroke: '#FFFFFF',
              margin: new go.Margin(2, 6, 2, 6),
            },
            new go.Binding('text', 'severity', (sev) => {
              if (sev === ConstraintSeverity.MANDATORY) return '🔴 MANDATORY';
              if (sev === ConstraintSeverity.CONDITIONAL) return '🟡 CONDITIONAL';
              return '⚪ WARNING';
            }))
          )
        ),
        // Constraint name
        $(
          go.TextBlock,
          {
            font: 'bold 12px -apple-system, sans-serif',
            stroke: '#0F172A',
            margin: new go.Margin(8, 10, 4, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),
        // Statement
        $(
          go.TextBlock,
          {
            font: '10px -apple-system, sans-serif',
            stroke: '#475569',
            margin: new go.Margin(2, 10, 4, 10),
            wrap: go.Wrap.Fit,
            maxLines: 3,
          },
          new go.Binding('text', 'statement')
        ),
        // Status row
        $(
          go.Panel,
          'Horizontal',
          {
            stretch: go.Stretch.Horizontal,
            padding: new go.Margin(4, 8, 6, 8),
            background: '#F1F5F9',
          },
          $(go.TextBlock, {
            font: '9px monospace',
            stroke: '#64748B',
          },
          new go.Binding('text', 'status', (st) => {
            if (st === ConstraintStatus.SUSPENDED) return '⏸ SUSPENDED';
            if (st === ConstraintStatus.DEPRECATED) return '🚫 DEPRECATED';
            return '✅ ACTIVE';
          }))
        )
      )
    )
  );

  // ==========================================
  // 2. Controlled Object Template (Управляемый объект)
  // ==========================================
  const controlledObjectTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(200, 90) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 8,
        fill: '#EFF6FF',
        stroke: '#2563EB', // Steel blue
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
            background: '#DBEAFE',
            padding: new go.Margin(5, 10, 5, 10),
          },
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#1D4ED8',
          },
          new go.Binding('text', 'objectType', (t) => {
            if (t === ControlledObjectType.PROCESS) return '⚙️ ПРОЦЕСС';
            if (t === ControlledObjectType.PRODUCT) return '🔩 ИЗДЕЛИЕ';
            if (t === ControlledObjectType.EQUIPMENT) return '🏭 ОБОРУДОВАНИЕ';
            if (t === ControlledObjectType.RESOURCE) return '📦 РЕСУРС';
            return '👷 ПЕРСОНАЛ';
          }))
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 12px -apple-system, sans-serif',
            stroke: '#1E293B',
            margin: new go.Margin(8, 10, 4, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),
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
  // 3. Enforcement Mechanism Template (Механизм исполнения)
  // ==========================================
  const enforcementMechanismTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(200, 90) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 8,
        fill: '#F0FDF4',
        stroke: '#16A34A', // Emerald green
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
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#15803D',
          },
          new go.Binding('text', 'mechanismType', (t) => {
            if (t === MechanismType.AUTOMATED_PLC) return '🤖 ПЛК / АВТОМАТИКА';
            if (t === MechanismType.SOFTWARE_RULE) return '💻 ПРОГРАММНОЕ ПРАВИЛО';
            if (t === MechanismType.QUALITY_INSPECTION) return '🔍 КОНТРОЛЬ ОТК';
            if (t === MechanismType.DIGITAL_SIGNATURE) return '✍️ ЭЦП СОГЛАСОВАНИЕ';
            return '📊 АУДИТ ERP';
          }))
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 12px -apple-system, sans-serif',
            stroke: '#1E293B',
            margin: new go.Margin(8, 10, 4, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),
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
  // 4. Source Document Template (Нормативный документ)
  // ==========================================
  const sourceDocumentTemplate = $(
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
      { name: 'CARD', minSize: new go.Size(200, 90) },
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 4,
        fill: '#FFFBEB',
        stroke: '#B45309', // Amber/gold
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
          $(go.TextBlock, {
            font: 'bold 10px -apple-system, sans-serif',
            stroke: '#92400E',
          },
          new go.Binding('text', 'documentType', (t) => {
            if (t === DocumentType.STATE_STANDARD) return '📜 ГОСТ / ISO';
            if (t === DocumentType.INDUSTRY_CODE) return '✈️ ОСТ / НОРМЫ';
            if (t === DocumentType.LAW_REGULATION) return '⚖️ ЗАКОН / ТК РФ';
            if (t === DocumentType.FACTORY_POLICY) return '🏭 СТП / РЕГЛАМЕНТ';
            return '📋 ДОГОВОР / ТЗ';
          })),
          // Code badge right
          $(
            go.Panel,
            'Auto',
            { alignment: go.Spot.Right },
            $(go.Shape, 'RoundedRectangle', {
              parameter1: 4,
              fill: '#92400E',
              strokeWidth: 0,
            }),
            $(go.TextBlock, {
              font: 'bold 9px monospace',
              stroke: '#FFFBEB',
              margin: new go.Margin(2, 6, 2, 6),
            },
            new go.Binding('text', 'code'))
          )
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 12px -apple-system, sans-serif',
            stroke: '#1E293B',
            margin: new go.Margin(8, 10, 4, 10),
            wrap: go.Wrap.Fit,
            maxLines: 2,
            editable: true,
          },
          new go.Binding('text', 'name').makeTwoWay()
        ),
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

  map.add('constraint', constraintTemplate);
  map.add('controlledObject', controlledObjectTemplate);
  map.add('enforcementMechanism', enforcementMechanismTemplate);
  map.add('sourceDocument', sourceDocumentTemplate);

  return map;
}
