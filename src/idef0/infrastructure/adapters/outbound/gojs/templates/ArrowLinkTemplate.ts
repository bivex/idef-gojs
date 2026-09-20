import * as go from 'gojs';
import { TunnelType } from '../../../../../domain/models/ICOMType';

export function createArrowLinkTemplate(): go.Link {
  const $ = go.GraphObject.make;

  return $(
    go.Link,
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 6,
      reshapable: true,
      resegmentable: true,
      selectionAdorned: true,
    },
    // The link path shape
    $(
      go.Shape,
      {
        strokeWidth: 1.5,
        stroke: '#1E293B',
      },
      new go.Binding('stroke', 'isCall', (isCall) => (isCall ? '#DC2626' : '#1E293B')),
      new go.Binding('strokeDashArray', 'isCall', (isCall) => (isCall ? [4, 3] : null))
    ),

    // Source tunnel indicator (parentheses)
    $(
      go.TextBlock,
      {
        text: '(',
        font: 'bold 16px sans-serif',
        stroke: '#1E293B',
        segmentIndex: 0,
        segmentFraction: 0.1,
      },
      new go.Binding('visible', 'tunnel', (t) => t === TunnelType.AT_SOURCE || t === TunnelType.BOTH)
    ),

    // Arrowhead at target side
    $(
      go.Shape,
      {
        toArrow: 'Standard',
        stroke: '#1E293B',
        fill: '#1E293B',
        scale: 1.2,
      },
      new go.Binding('stroke', 'isCall', (isCall) => (isCall ? '#DC2626' : '#1E293B')),
      new go.Binding('fill', 'isCall', (isCall) => (isCall ? '#DC2626' : '#1E293B'))
    ),

    // Target tunnel indicator (parentheses)
    $(
      go.TextBlock,
      {
        text: ')',
        font: 'bold 16px sans-serif',
        stroke: '#1E293B',
        segmentIndex: -1,
        segmentFraction: 0.9,
      },
      new go.Binding('visible', 'tunnel', (t) => t === TunnelType.AT_TARGET || t === TunnelType.BOTH)
    ),

    // Noun phrase Label along link
    $(
      go.Panel,
      'Auto',
      {
        segmentFraction: 0.5,
        segmentOrientation: go.Link.OrientUpright,
      },
      $(go.Shape, 'RoundedRectangle', {
        fill: '#FFFFFF',
        stroke: '#CBD5E1',
        strokeWidth: 1,
        parameter1: 3,
      }),
      $(
        go.TextBlock,
        {
          textAlign: 'center',
          font: '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          stroke: '#0F172A',
          margin: new go.Margin(2, 6, 2, 6),
          wrap: go.TextBlock.WrapFit,
          maxSize: new go.Size(160, NaN),
          editable: true,
        },
        new go.Binding('text', 'name').makeTwoWay()
      )
    )
  );
}
