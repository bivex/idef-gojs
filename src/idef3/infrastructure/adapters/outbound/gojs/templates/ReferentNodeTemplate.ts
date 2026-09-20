import * as go from 'gojs';
import { ReferentType } from '../../../../../domain/models/Referent';

export function createReferentNodeTemplate(): go.Node {
  const $ = go.GraphObject.make;

  return $(
    go.Node,
    'Auto',
    {
      locationSpot: go.Spot.Center,
      cursor: 'pointer',
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Shape,
      'RoundedRectangle',
      {
        parameter1: 4,
        fill: '#FEF3C7',
        stroke: '#B45309',
        strokeWidth: 1.5,
      },
      new go.Binding('fill', 'type', (t) => {
        switch (t) {
          case ReferentType.SCENARIO: return '#EFF6FF';
          case ReferentType.UOB: return '#F0FDF4';
          case ReferentType.OBJECT_STATE: return '#FEF3C7';
          case ReferentType.GOTO: return '#FEE2E2';
          default: return '#F8FAFC';
        }
      }),
      new go.Binding('stroke', 'type', (t) => {
        switch (t) {
          case ReferentType.SCENARIO: return '#2563EB';
          case ReferentType.UOB: return '#16A34A';
          case ReferentType.OBJECT_STATE: return '#D97706';
          case ReferentType.GOTO: return '#DC2626';
          default: return '#64748B';
        }
      })
    ),
    $(
      go.Panel,
      'Horizontal',
      { margin: new go.Margin(4, 8, 4, 8) },
      $(
        go.TextBlock,
        {
          font: 'bold 11px monospace',
          stroke: '#1E293B',
          textAlign: 'center',
          wrap: go.TextBlock.WrapFit,
          maxSize: new go.Size(160, NaN),
        },
        new go.Binding('text', '', (d) => `[${d.type}: ${d.name}]`)
      )
    ),
    // Universal ports
    $(go.Shape, 'Circle', {
      portId: 'IN',
      alignment: new go.Spot(0, 0.5),
      desiredSize: new go.Size(6, 6),
      fill: 'transparent',
      stroke: null,
      toLinkable: true,
    }),
    $(go.Shape, 'Circle', {
      portId: 'OUT',
      alignment: new go.Spot(1, 0.5),
      desiredSize: new go.Size(6, 6),
      fill: 'transparent',
      stroke: null,
      fromLinkable: true,
    })
  );
}
