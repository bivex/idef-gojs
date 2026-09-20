import * as go from 'gojs';

export function createBoundaryNodeTemplate(): go.Node {
  const $ = go.GraphObject.make;

  return $(
    go.Node,
    'Auto',
    {
      locationSpot: go.Spot.Center,
      selectable: true,
      movable: true,
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(
      go.Shape,
      'RoundedRectangle',
      {
        parameter1: 4,
        strokeWidth: 1,
        strokeDashArray: [3, 2],
      },
      new go.Binding('fill', 'boundaryType', (type) => {
        switch (type) {
          case 'INPUT': return '#EFF6FF';
          case 'CONTROL': return '#FEF3C7';
          case 'OUTPUT': return '#ECFDF5';
          case 'MECHANISM': return '#F5F3FF';
          default: return '#F8FAFC';
        }
      }),
      new go.Binding('stroke', 'boundaryType', (type) => {
        switch (type) {
          case 'INPUT': return '#3B82F6';
          case 'CONTROL': return '#F59E0B';
          case 'OUTPUT': return '#10B981';
          case 'MECHANISM': return '#8B5CF6';
          default: return '#94A3B8';
        }
      })
    ),
    $(
      go.Panel,
      'Horizontal',
      { margin: 4 },
      $(
        go.TextBlock,
        {
          font: 'italic 11px sans-serif',
          stroke: '#334155',
          textAlign: 'center',
          wrap: go.TextBlock.WrapFit,
          maxWidth: 140,
        },
        new go.Binding('text', 'name')
      )
    ),
    // Universal anchor port
    $(go.Shape, 'Circle', {
      portId: 'BORDER',
      desiredSize: new go.Size(6, 6),
      fill: 'transparent',
      stroke: null,
      fromLinkable: true,
      toLinkable: true,
    })
  );
}
