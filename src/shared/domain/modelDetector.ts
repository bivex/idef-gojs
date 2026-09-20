/**
 * Universal IDEF Model Auto-Detector and Normalizer
 * Automatically determines the IDEF standard (IDEF0, IDEF1X, IDEF3, IDEF4, IDEF5, IDEF6, IDEF8, IDEF9, IDEF10, IDEF12)
 * from arbitrary JSON files, unwraps nested configurations, and normalizes them for seamless import.
 */

export type IDEFStandardMode =
  | 'idef12'
  | 'idef10'
  | 'idef9'
  | 'idef8'
  | 'idef6'
  | 'idef5'
  | 'idef4'
  | 'idef3'
  | 'idef0'
  | 'idef1';

export interface DetectedIDEFModel {
  standard: IDEFStandardMode;
  standardTitle: string;
  normalizedJSON: string;
  modelObject: any;
}

export function detectAndNormalizeIDEFModel(rawInput: string | object): DetectedIDEFModel {
  let data: any;
  if (typeof rawInput === 'string') {
    try {
      data = JSON.parse(rawInput);
    } catch (e: any) {
      throw new Error(`Ошибка разбора JSON: ${e.message}`);
    }
  } else {
    data = rawInput;
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Некорректный JSON: ожидается объект.');
  }

  // 1. Check embedded sub-objects
  if (data.idef10_system_architecture || data.idef10 || data.idef10Model || data.architecture) {
    const sub = data.idef10_system_architecture || data.idef10 || data.idef10Model || data.architecture;
    return normalizeIDEF10(sub);
  }
  if (data.idef12_org_structure || data.idef12 || data.idef12Model || data.organization) {
    const sub = data.idef12_org_structure || data.idef12 || data.idef12Model || data.organization;
    return normalizeIDEF12(sub);
  }
  if (data.idef9_constraints || data.idef9 || data.idef9Model || data.constraints_model) {
    const sub = data.idef9_constraints || data.idef9 || data.idef9Model || data.constraints_model;
    return normalizeIDEF9(sub);
  }
  if (data.idef8_hmi || data.idef8 || data.idef8Model || data.ui_model) {
    const sub = data.idef8_hmi || data.idef8 || data.idef8Model || data.ui_model;
    return normalizeIDEF8(sub);
  }
  if (data.idef6_rationale || data.idef6 || data.idef6Model || data.rationale) {
    const sub = data.idef6_rationale || data.idef6 || data.idef6Model || data.rationale;
    return normalizeIDEF6(sub);
  }
  if (data.idef5_ontology || data.idef5 || data.idef5Model || data.ontology) {
    const sub = data.idef5_ontology || data.idef5 || data.idef5Model || data.ontology;
    return normalizeIDEF5(sub);
  }
  if (data.idef4_design || data.idef4 || data.idef4Model || data.oo_design) {
    const sub = data.idef4_design || data.idef4 || data.idef4Model || data.oo_design;
    return normalizeIDEF4(sub);
  }
  if (data.idef3_process || data.idef3 || data.idef3Model || data.process) {
    const sub = data.idef3_process || data.idef3 || data.idef3Model || data.process;
    return normalizeIDEF3(sub);
  }
  if (data.idef0_functions || data.idef0 || data.idef0Model || data.functions) {
    const sub = data.idef0_functions || data.idef0 || data.idef0Model || data.functions;
    return normalizeIDEF0(sub);
  }
  if (data.idef1x_data || data.idef1 || data.idef1x || data.idef1Model || data.data_model) {
    const sub = data.idef1x_data || data.idef1 || data.idef1x || data.idef1Model || data.data_model;
    return normalizeIDEF1(sub);
  }

  // 2. Check root-level or diagrams[0]-level signatures
  const firstDiagram = Array.isArray(data.diagrams) && data.diagrams.length > 0 ? data.diagrams[0] : null;

  // IDEF12: orgUnits, positions, orgRoles, competencies
  if (
    data.orgUnits ||
    data.org_units ||
    data.positions ||
    data.orgRoles ||
    data.competencies ||
    (firstDiagram &&
      (firstDiagram.orgUnits ||
        firstDiagram.org_units ||
        firstDiagram.positions ||
        firstDiagram.orgRoles ||
        firstDiagram.competencies))
  ) {
    return normalizeIDEF12(data);
  }

  // IDEF10: components, executionNodes, interfaces, artifacts
  if (
    data.components ||
    data.executionNodes ||
    data.execution_nodes ||
    data.interfaces ||
    data.artifacts ||
    (firstDiagram &&
      (firstDiagram.components ||
        firstDiagram.executionNodes ||
        firstDiagram.execution_nodes ||
        firstDiagram.interfaces ||
        firstDiagram.artifacts))
  ) {
    return normalizeIDEF10(data);
  }

  // IDEF9: constraints, controlledObjects, enforcementMechanisms, sourceDocuments
  if (
    data.constraints ||
    data.controlledObjects ||
    data.controlled_objects ||
    data.enforcementMechanisms ||
    data.sourceDocuments ||
    (firstDiagram &&
      (firstDiagram.constraints ||
        firstDiagram.controlledObjects ||
        firstDiagram.controlled_objects ||
        firstDiagram.enforcementMechanisms ||
        firstDiagram.sourceDocuments))
  ) {
    return normalizeIDEF9(data);
  }

  // IDEF8: screens, userActions, systemResponses, userRoles
  if (
    data.screens ||
    data.userActions ||
    data.user_actions ||
    data.systemResponses ||
    data.userRoles ||
    (firstDiagram &&
      (firstDiagram.screens ||
        firstDiagram.userActions ||
        firstDiagram.user_actions ||
        firstDiagram.systemResponses ||
        firstDiagram.userRoles))
  ) {
    return normalizeIDEF8(data);
  }

  // IDEF6: issues, alternatives, criteria, arguments
  if (
    data.issues ||
    data.alternatives ||
    data.criteria ||
    data.arguments ||
    (firstDiagram &&
      (firstDiagram.issues ||
        firstDiagram.alternatives ||
        firstDiagram.criteria ||
        firstDiagram.arguments))
  ) {
    return normalizeIDEF6(data);
  }

  // IDEF5: kinds, individuals
  if (
    data.kinds ||
    data.individuals ||
    (firstDiagram && (firstDiagram.kinds || firstDiagram.individuals))
  ) {
    return normalizeIDEF5(data);
  }

  // IDEF4: classes, methods
  if (data.classes || (firstDiagram && firstDiagram.classes)) {
    return normalizeIDEF4(data);
  }

  // IDEF3: uobs, junctions, referents
  if (
    data.uobs ||
    data.junctions ||
    data.referents ||
    (firstDiagram &&
      (firstDiagram.uobs || firstDiagram.junctions || firstDiagram.referents))
  ) {
    return normalizeIDEF3(data);
  }

  // IDEF0: activities, arrows, icomType, nodeNumber
  if (
    data.activities ||
    data.arrows ||
    (firstDiagram && (firstDiagram.activities || firstDiagram.arrows))
  ) {
    return normalizeIDEF0(data);
  }

  // IDEF1X: entities, relationships, categorizations
  if (data.entities || data.relationships || data.categorizations) {
    return normalizeIDEF1(data);
  }

  throw new Error(
    'Не удалось автоматически распознать стандарт модели IDEF. Поддерживаются: IDEF0, IDEF1X, IDEF3, IDEF4, IDEF5, IDEF6, IDEF8, IDEF9, IDEF10, IDEF12.'
  );
}

// ----------------------------------------
// Normalizers
// ----------------------------------------

function normalizeIDEF10(data: any): DetectedIDEFModel {
  const id = data.id || data.diagram_id || 'model-idef10-auto';
  const name = data.name || data.title || 'Импортированная архитектура (IDEF10)';
  let diagrams = data.diagrams;

  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    diagrams = [
      {
        id: data.id || data.diagram_id || 'diag-idef10-1',
        name: data.name || data.title || 'Диаграмма архитектуры',
        description: data.description,
        executionNodes: data.executionNodes || data.execution_nodes || [],
        components: data.components || [],
        interfaces: data.interfaces || [],
        artifacts: data.artifacts || [],
        links: data.links || [],
      },
    ];
  }

  // Normalize each diagram's elements
  diagrams = diagrams.map((diag: any) => ({
    id: diag.id || diag.diagram_id || `diag-${Math.floor(Math.random() * 1000)}`,
    name: diag.name || diag.title || 'Архитектура системы',
    description: diag.description,
    executionNodes: (diag.executionNodes || diag.execution_nodes || []).map((n: any) => ({
      id: n.id,
      code: n.code || n.id?.toUpperCase() || `NODE-${Math.floor(Math.random() * 1000)}`,
      name: n.name || n.id,
      nodeType: n.nodeType === 'DEVICE' || n.nodeType === 'EXECUTION_ENVIRONMENT' ? 'EDGE_CONTROLLER' : n.nodeType || 'EDGE_CONTROLLER',
      osPlatform: n.osPlatform || n.os || 'Embedded OS',
      ipAddress: n.ipAddress,
      description: n.description,
      position: n.position || { x: 100, y: 100 },
    })),
    components: (diag.components || []).map((c: any) => ({
      id: c.id,
      code: c.code || c.id?.toUpperCase() || `CMP-${Math.floor(Math.random() * 1000)}`,
      name: c.name || c.id,
      techStack: c.techStack || c.technology || 'Generic',
      version: c.version || '1.0.0',
      componentType: c.componentType || 'MODULE',
      lifecycle: c.lifecycle || 'ACTIVE',
      description: c.description,
      position: c.position || { x: 200, y: 100 },
    })),
    interfaces: (diag.interfaces || []).map((i: any) => ({
      id: i.id,
      name: i.name || i.id,
      protocol: i.protocol === 'DVP' || i.protocol === 'TMDS' ? 'OPC_UA' : i.protocol || 'REST_API',
      role: i.role || 'PROVIDED',
      portNumber: i.portNumber,
      specification: i.specification,
      description: i.description,
      position: i.position || { x: 300, y: 100 },
    })),
    artifacts: (diag.artifacts || []).map((a: any) => ({
      id: a.id,
      code: a.code || a.id?.toUpperCase() || `ART-${Math.floor(Math.random() * 1000)}`,
      name: a.name || a.id,
      artifactType: a.artifactType || 'BINARY_PACKAGE',
      fileName: a.fileName || 'artifact.bin',
      repositoryUrl: a.repositoryUrl,
      description: a.description,
      position: a.position || { x: 400, y: 100 },
    })),
    links: (diag.links || []).map((l: any) => ({
      id: l.id || `lnk-${Math.random()}`,
      sourceId: l.sourceId,
      targetId: l.targetId,
      type: l.type || (l.linkType === 'CALL' ? 'CALLS' : l.linkType === 'DATA_FLOW' ? 'PRODUCES_CONSUMES' : l.linkType === 'DEPENDS_ON' ? 'CALLS' : 'PRODUCES_CONSUMES'),
      label: l.label,
    })),
  }));

  const modelObject = {
    id,
    name,
    version: data.version || '1.0',
    activeDiagramId: diagrams[0].id,
    diagrams,
  };

  return {
    standard: 'idef10',
    standardTitle: 'IDEF10 (Архитектура реализации)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}

function normalizeIDEF12(data: any): DetectedIDEFModel {
  const id = data.id || data.diagram_id || 'model-idef12-auto';
  const name = data.name || data.title || 'Импортированная оргструктура (IDEF12)';
  let diagrams = data.diagrams;

  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    diagrams = [
      {
        id: data.id || data.diagram_id || 'diag-idef12-1',
        name: data.name || data.title || 'Диаграмма оргструктуры',
        description: data.description,
        orgUnits: data.orgUnits || data.org_units || [],
        positions: data.positions || [],
        orgRoles: data.orgRoles || data.org_roles || [],
        competencies: data.competencies || [],
        links: data.links || data.orgLinks || [],
      },
    ];
  }

  const modelObject = {
    id,
    name,
    version: data.version || '1.0',
    activeDiagramId: diagrams[0].id,
    diagrams,
  };

  return {
    standard: 'idef12',
    standardTitle: 'IDEF12 (Организационная структура)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}

function normalizeIDEF9(data: any): DetectedIDEFModel {
  const id = data.id || 'model-idef9-auto';
  const name = data.name || 'Импортированные ограничения (IDEF9)';
  let diagrams = data.diagrams;
  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    diagrams = [
      {
        id: data.id || 'diag-idef9-1',
        name: data.name || 'Диаграмма бизнес-правил',
        constraints: data.constraints || [],
        controlledObjects: data.controlledObjects || data.controlled_objects || [],
        enforcementMechanisms: data.enforcementMechanisms || [],
        sourceDocuments: data.sourceDocuments || [],
        links: data.links || [],
      },
    ];
  }

  const modelObject = {
    id,
    name,
    version: data.version || '1.0',
    activeDiagramId: diagrams[0].id,
    diagrams,
  };

  return {
    standard: 'idef9',
    standardTitle: 'IDEF9 (Бизнес-правила и ограничения)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}

function normalizeIDEF8(data: any): DetectedIDEFModel {
  const id = data.id || 'model-idef8-auto';
  const name = data.name || 'Импортированный ЧМИ / UI (IDEF8)';
  let diagrams = data.diagrams;
  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    diagrams = [
      {
        id: data.id || 'diag-idef8-1',
        name: data.name || 'Диаграмма сценариев UI',
        screens: data.screens || [],
        userActions: data.userActions || data.user_actions || [],
        systemResponses: data.systemResponses || [],
        userRoles: data.userRoles || [],
        links: data.links || [],
      },
    ];
  }

  const modelObject = {
    id,
    name,
    version: data.version || '1.0',
    activeDiagramId: diagrams[0].id,
    diagrams,
  };

  return {
    standard: 'idef8',
    standardTitle: 'IDEF8 (Человеко-машинный интерфейс)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}

function normalizeIDEF6(data: any): DetectedIDEFModel {
  const id = data.id || 'model-idef6-auto';
  const name = data.name || 'Импортированное обоснование (IDEF6)';
  let diagrams = data.diagrams;
  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    diagrams = [
      {
        id: data.id || 'diag-idef6-1',
        name: data.name || 'Диаграмма обоснования решений',
        issues: data.issues || [],
        alternatives: data.alternatives || [],
        criteria: data.criteria || [],
        arguments: data.arguments || [],
        links: data.links || [],
      },
    ];
  }

  const modelObject = {
    id,
    name,
    version: data.version || '1.0',
    activeDiagramId: diagrams[0].id,
    diagrams,
  };

  return {
    standard: 'idef6',
    standardTitle: 'IDEF6 (Обоснование проектных решений)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}

function normalizeIDEF5(data: any): DetectedIDEFModel {
  const id = data.id || 'model-idef5-auto';
  const name = data.name || 'Импортированная онтология (IDEF5)';
  let diagrams = data.diagrams;
  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    diagrams = [
      {
        id: data.id || 'diag-idef5-1',
        name: data.name || 'Диаграмма понятий онтологии',
        kinds: data.kinds || [],
        individuals: data.individuals || [],
        relations: data.relations || [],
      },
    ];
  }

  const modelObject = {
    id,
    name,
    version: data.version || '1.0',
    activeDiagramId: diagrams[0].id,
    diagrams,
  };

  return {
    standard: 'idef5',
    standardTitle: 'IDEF5 (Онтологическое исследование)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}

function normalizeIDEF4(data: any): DetectedIDEFModel {
  const id = data.id || 'model-idef4-auto';
  const name = data.name || 'Импортированный ОО-дизайн (IDEF4)';
  let diagrams = data.diagrams;
  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    diagrams = [
      {
        id: data.id || 'diag-idef4-1',
        name: data.name || 'Диаграмма классов',
        classes: data.classes || [],
        inheritanceLinks: data.inheritanceLinks || [],
        features: data.features || [],
      },
    ];
  }

  const modelObject = {
    id,
    name,
    version: data.version || '1.0',
    activeDiagramId: diagrams[0].id,
    diagrams,
  };

  return {
    standard: 'idef4',
    standardTitle: 'IDEF4 (Объектно-ориентированный дизайн)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}

function normalizeIDEF3(data: any): DetectedIDEFModel {
  const id = data.id || 'model-idef3-auto';
  const name = data.name || 'Импортированный процесс (IDEF3)';
  let diagrams = data.diagrams;
  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    diagrams = [
      {
        id: data.id || 'scenario-main',
        name: data.name || 'Диаграмма процесса',
        uobs: data.uobs || [],
        junctions: data.junctions || [],
        referents: data.referents || [],
        precedenceLinks: data.precedenceLinks || data.links || [],
      },
    ];
  }

  const modelObject = {
    id,
    name,
    version: data.version || '1.0',
    activeDiagramId: diagrams[0].id,
    diagrams,
  };

  return {
    standard: 'idef3',
    standardTitle: 'IDEF3 (Описание технологических процессов)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}

function normalizeIDEF0(data: any): DetectedIDEFModel {
  const id = data.id || 'model-idef0-auto';
  const name = data.name || 'Импортированная функциональная модель (IDEF0)';
  let diagrams = data.diagrams;
  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    diagrams = [
      {
        id: data.id || 'diag-a0',
        nodeNumber: data.nodeNumber || 'A0',
        title: data.name || data.title || 'Функциональная декомпозиция',
        activities: data.activities || [],
        arrows: data.arrows || [],
      },
    ];
  }

  const modelObject = {
    id,
    name,
    author: data.author || 'Imported',
    project: data.project || 'Project',
    diagrams,
  };

  return {
    standard: 'idef0',
    standardTitle: 'IDEF0 (Функциональное моделирование)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}

function normalizeIDEF1(data: any): DetectedIDEFModel {
  const id = data.id || 'model-idef1-auto';
  const name = data.name || 'Импортированная модель данных (IDEF1X)';

  const modelObject = {
    id,
    name,
    entities: data.entities || [],
    relationships: data.relationships || [],
    categorizations: data.categorizations || [],
  };

  return {
    standard: 'idef1',
    standardTitle: 'IDEF1X (Моделирование данных)',
    normalizedJSON: JSON.stringify(modelObject, null, 2),
    modelObject,
  };
}
