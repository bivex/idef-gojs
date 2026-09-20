import * as go from 'gojs';
import { OrgLinkType } from '../../../../../domain/models/IDEF12Link';

export function createIDEF12LinkTemplate(): go.Link {
  const $ = go.GraphObject.make;

  return $(
    go.Link,
    {
      routing: go.Routing.AvoidsNodes,
      curve: go.Curve.JumpOver,
      corner: 8,
      reshapable: true,
      resegmentable: true,
    },
    // The link path
    $(go.Shape, {
      strokeWidth: 2,
    },
    new go.Binding('stroke', 'type', (t: OrgLinkType) => {
      if (t === OrgLinkType.SUBORDINATE_TO) return '#1E3A8A';   // Dark Blue
      if (t === OrgLinkType.FUNCTIONAL_REPORTS) return '#7C3AED'; // Violet
      if (t === OrgLinkType.ASSIGNED_TO) return '#059669';       // Emerald
      if (t === OrgLinkType.PLAYS_ROLE) return '#E11D48';        // Rose
      if (t === OrgLinkType.REQUIRES_COMPETENCY) return '#D97706'; // Amber
      return '#64748B';                                         // Slate
    }),
    new go.Binding('strokeDashArray', 'type', (t: OrgLinkType) => {
      if (t === OrgLinkType.SUBORDINATE_TO) return null;
      if (t === OrgLinkType.ASSIGNED_TO) return null;
      if (t === OrgLinkType.FUNCTIONAL_REPORTS) return [6, 4];
      if (t === OrgLinkType.PLAYS_ROLE) return [4, 4];
      if (t === OrgLinkType.REQUIRES_COMPETENCY) return [3, 3];
      return [5, 5];
    }),
    new go.Binding('strokeWidth', 'type', (t: OrgLinkType) => {
      if (t === OrgLinkType.SUBORDINATE_TO) return 2.5;
      return 1.8;
    })),
    // Arrowhead
    $(go.Shape, {
      toArrow: 'Standard',
      strokeWidth: 0,
      scale: 1.2,
    },
    new go.Binding('fill', 'type', (t: OrgLinkType) => {
      if (t === OrgLinkType.SUBORDINATE_TO) return '#1E3A8A';
      if (t === OrgLinkType.FUNCTIONAL_REPORTS) return '#7C3AED';
      if (t === OrgLinkType.ASSIGNED_TO) return '#059669';
      if (t === OrgLinkType.PLAYS_ROLE) return '#E11D48';
      if (t === OrgLinkType.REQUIRES_COMPETENCY) return '#D97706';
      return '#64748B';
    })),
    // Text label on link
    $(
      go.Panel,
      'Auto',
      { segmentFraction: 0.5 },
      new go.Binding('visible', 'label', (l) => Boolean(l && l.trim().length > 0)),
      $(go.Shape, 'RoundedRectangle', {
        parameter1: 3,
        fill: '#FFFFFF',
        stroke: '#CBD5E1',
        strokeWidth: 1,
      }),
      $(go.TextBlock, {
        font: 'bold 9px -apple-system, sans-serif',
        stroke: '#334155',
        margin: new go.Margin(2, 5, 2, 5),
      },
      new go.Binding('text', 'label'))
    )
  );
}
