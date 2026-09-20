import { IDEF12Model } from '../../../domain/models/IDEF12Model';
import { IDEF12Diagram } from '../../../domain/models/IDEF12Diagram';
import { IDEF12OrgUnit, IDEF12OrgUnitProps } from '../../../domain/models/IDEF12OrgUnit';
import { IDEF12Position, IDEF12PositionProps } from '../../../domain/models/IDEF12Position';
import { IDEF12OrgRole, IDEF12OrgRoleProps } from '../../../domain/models/IDEF12OrgRole';
import { IDEF12Competency, IDEF12CompetencyProps } from '../../../domain/models/IDEF12Competency';
import { IDEF12Link, IDEF12LinkProps } from '../../../domain/models/IDEF12Link';
import { IDEF12ValidationIssue } from '../../../domain/rules/IDEF12Rules';

export interface IIDEF12EditorUseCase {
  createModel(id: string, name: string): IDEF12Model;
  getModel(): IDEF12Model;
  getActiveDiagram(): IDEF12Diagram;
  setActiveDiagram(diagramId: string): void;

  addOrgUnit(props: IDEF12OrgUnitProps): IDEF12OrgUnit;
  removeOrgUnit(id: string): void;

  addPosition(props: IDEF12PositionProps): IDEF12Position;
  removePosition(id: string): void;

  addRole(props: IDEF12OrgRoleProps): IDEF12OrgRole;
  removeRole(id: string): void;

  addCompetency(props: IDEF12CompetencyProps): IDEF12Competency;
  removeCompetency(id: string): void;

  addLink(props: IDEF12LinkProps): IDEF12Link;
  removeLink(id: string): void;

  validate(): IDEF12ValidationIssue[];
  exportJSON(): string;
  importJSON(jsonString: string): void;
}
