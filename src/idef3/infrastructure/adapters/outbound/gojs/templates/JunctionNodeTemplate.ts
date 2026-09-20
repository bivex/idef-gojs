import * as go from 'gojs';
import { JunctionKind, SyncType, JunctionDirection } from '../../../../../domain/models/JunctionType';

export function createJunctionNodeTemplate(): go.Node {
  const $ = go.GraphObject.make;

  return $(
    go.Node,
    'Spot',
    {
      locationSpot: go.Spot.Center,
      selectionObjectName: 'JUNCTION_BOX',
      cursor: 'pointer',
      toolTip: $(
        'ToolTip',
        $(
          go.TextBlock,
          { margin: 6, font: '11px sans-serif' },
          new go.Binding('text', '', (data) =>
            `Перекресток: ${data.junctionNumber}\nТип: ${data.kind}\nСинхронность: ${data.syncType}\nНаправление: ${data.direction}`
          )
        )
      ),
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

    // Main Junction Box
    $(
      go.Panel,
      'Auto',
      { name: 'JUNCTION_BOX', desiredSize: new go.Size(46, 46) },
      $(go.Shape, 'Rectangle', {
        fill: '#F1F5F9',
        stroke: '#0F172A',
        strokeWidth: 2,
      }),

      // Inner layout showing logic symbol & sync band
      $(
        go.Panel,
        'Table',
        { defaultAlignment: go.Spot.Center },

        // Double vertical line on left (Fan-In Sync)
        $(go.Shape, 'LineV', {
          row: 0,
          column: 0,
          stroke: '#0F172A',
          strokeWidth: 1.5,
          height: 38,
          margin: new go.Margin(0, 1, 0, 1),
        },
        new go.Binding('visible', '', (d) => d.direction === JunctionDirection.FAN_IN && d.syncType === SyncType.SYNC)),

        // Single vertical line on left (Fan-In Async or Sync band 2)
        $(go.Shape, 'LineV', {
          row: 0,
          column: 1,
          stroke: '#0F172A',
          strokeWidth: 1.5,
          height: 38,
          margin: new go.Margin(0, 2, 0, 2),
        },
        new go.Binding('visible', '', (d) => d.direction === JunctionDirection.FAN_IN)),

        // Central Logic Symbol (&, O, X)
        $(
          go.TextBlock,
          {
            row: 0,
            column: 2,
            font: 'bold 18px "Courier New", monospace',
            stroke: '#0F172A',
            textAlign: 'center',
          },
          new go.Binding('text', 'kind', (k) => {
            switch (k) {
              case JunctionKind.AND: return '&';
              case JunctionKind.OR: return 'O';
              case JunctionKind.XOR: return 'X';
              default: return '&';
            }
          })
        ),

        // Single vertical line on right (Fan-Out)
        $(go.Shape, 'LineV', {
          row: 0,
          column: 3,
          stroke: '#0F172A',
          strokeWidth: 1.5,
          height: 38,
          margin: new go.Margin(0, 2, 0, 2),
        },
        new go.Binding('visible', '', (d) => d.direction === JunctionDirection.FAN_OUT)),

        // Double vertical line on right (Fan-Out Sync)
        $(go.Shape, 'LineV', {
          row: 0,
          column: 4,
          stroke: '#0F172A',
          strokeWidth: 1.5,
          height: 38,
          margin: new go.Margin(0, 1, 0, 1),
        },
        new go.Binding('visible', '', (d) => d.direction === JunctionDirection.FAN_OUT && d.syncType === SyncType.SYNC))
      )
    ),

    // Inflow port (Left)
    $(go.Shape, 'Circle', {
      portId: 'IN',
      alignment: new go.Spot(0, 0.5),
      desiredSize: new go.Size(6, 6),
      fill: 'transparent',
      stroke: null,
      toLinkable: true,
    }),

    // Outflow port (Right)
    $(go.Shape, 'Circle', {
      portId: 'OUT',
      alignment: new go.Spot(1, 0.5),
      desiredSize: new go.Size(6, 6),
      fill: 'transparent',
      stroke: null,
      fromLinkable: true,
    }),

    // Junction identifier label below box
    $(
      go.TextBlock,
      {
        alignment: new go.Spot(0.5, 1),
        alignmentFocus: new go.Spot(0.5, -0.3),
        font: 'bold 11px monospace',
        stroke: '#475569',
      },
      new go.Binding('text', 'junctionNumber')
    )
  );
}
