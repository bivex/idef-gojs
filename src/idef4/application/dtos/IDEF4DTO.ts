import { Visibility } from '../../domain/models/IDEF4Attribute';
import { RelationshipKind } from '../../domain/models/IDEF4Relationship';

export interface AttributeDTO {
  name: string;
  dataType: string;
  visibility: Visibility;
  defaultValue?: string;
  isStatic?: boolean;
}

export interface MethodDTO {
  name: string;
  returnType: string;
  parameters: { name: string; type: string }[];
  visibility: Visibility;
  isAbstract?: boolean;
  isStatic?: boolean;
}

export interface ClassDTO {
  id: string;
  name: string;
  isAbstract: boolean;
  isInterface: boolean;
  attributes: AttributeDTO[];
  methods: MethodDTO[];
  x: number;
  y: number;
}

export interface RelationshipDTO {
  id: string;
  sourceClassId: string;
  targetClassId: string;
  kind: RelationshipKind;
  name?: string;
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
  roleName?: string;
}

export interface DiagramDTO {
  id: string;
  name: string;
  classes: ClassDTO[];
  relationships: RelationshipDTO[];
}

export interface ModelDTO {
  id: string;
  name: string;
  rootDiagramId: string;
  activeDiagramId: string;
  diagrams: DiagramDTO[];
}
