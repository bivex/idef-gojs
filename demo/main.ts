import {
  IDEF1Editor,
  RelationshipType,
  Cardinality,
  IDEF0Editor,
  IDEF3Editor,
  IDEF4Editor,
  IDEF5Editor,
  IDEF6Editor,
  IDEF8Editor,
  IDEF9Editor,
  IDEF10Editor,
  ScreenType,
  ScreenState,
  ActionModality,
  ResponseType,
  PrivilegeLevel,
  InteractionLinkType,
  IssueStatus,
  AlternativeStatus,
  CriterionType,
  CriterionWeight,
  ArgumentType,
  ArgumentStrength,
  RationaleLinkType,
  ConstraintType,
  ConstraintSeverity,
  ConstraintStatus,
  ControlledObjectType,
  MechanismType,
  DocumentType,
  ConstraintLinkType,
  ComponentType,
  ComponentLifecycle,
  NodeType,
  InterfaceProtocol,
  InterfaceRole,
  ArtifactType,
  ArchitectureLinkType,
} from '../src/index';
import { loadRussianEnterpriseModel } from './russian_enterprise_model';
import { createRussianEnterpriseIDEF0Model } from './russian_enterprise_idef0';
import { createRussianEnterpriseIDEF3Model } from './russian_enterprise_idef3';
import { createRussianEnterpriseIDEF4Model } from './russian_enterprise_idef4';
import { loadRussianEnterpriseIDEF5Demo } from './russian_enterprise_idef5';
import { loadRussianEnterpriseIDEF6Demo } from './russian_enterprise_idef6';
import { loadRussianEnterpriseIDEF8Demo } from './russian_enterprise_idef8';
import { setupIDEF9 as loadIDEF9Demo } from './russian_enterprise_idef9';
import { setupIDEF10 as loadIDEF10Demo } from './russian_enterprise_idef10';

let idef1Editor: IDEF1Editor | null = null;
let idef0Editor: IDEF0Editor | null = null;
let idef3Editor: IDEF3Editor | null = null;
let idef4Editor: IDEF4Editor | null = null;
let idef5Editor: IDEF5Editor | null = null;
let idef6Editor: IDEF6Editor | null = null;
let idef8Editor: IDEF8Editor | null = null;
let idef9Editor: IDEF9Editor | null = null;
let idef10Editor: IDEF10Editor | null = null;
let activeMode: 'idef10' | 'idef9' | 'idef8' | 'idef6' | 'idef5' | 'idef4' | 'idef3' | 'idef0' | 'idef1' = 'idef10';

function destroyAllEditors() {
  if (idef10Editor) { idef10Editor.destroy(); idef10Editor = null; }
  if (idef9Editor) { idef9Editor.destroy(); idef9Editor = null; }
  if (idef8Editor) { idef8Editor.destroy(); idef8Editor = null; }
  if (idef6Editor) { idef6Editor.destroy(); idef6Editor = null; }
  if (idef5Editor) { idef5Editor.destroy(); idef5Editor = null; }
  if (idef4Editor) { idef4Editor.destroy(); idef4Editor = null; }
  if (idef3Editor) { idef3Editor.destroy(); idef3Editor = null; }
  if (idef0Editor) { idef0Editor.destroy(); idef0Editor = null; }
  if (idef1Editor) { idef1Editor.destroy(); idef1Editor = null; }

  const container = document.getElementById('diagramDiv');
  if (container) {
    container.innerHTML = '';
  }
}

// ==========================================
// IDEF10 Setup (KBSI Implementation Architecture)
// ==========================================
function setupIDEF10() {
  destroyAllEditors();
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  idef10Editor = new IDEF10Editor();
  idef10Editor.initialize(container);
  idef10Editor.createModel(
    'metal-avia-arch-v1',
    'IDEF10: Архитектура реализации АСУ ТП и MES — ОАО «Металл-Авиа»'
  );

  // Load demo data
  const cmpHmi = idef10Editor.addComponent({
    code: 'CMP-HMI-01',
    name: 'Веб-дашборд диспетчера цеха',
    techStack: 'Vue 3 / TypeScript',
    version: 'v3.2.0',
    componentType: ComponentType.UI_CLIENT,
    lifecycle: ComponentLifecycle.ACTIVE,
    x: 50, y: 80,
  });

  const cmpMes = idef10Editor.addComponent({
    code: 'CMP-MES-01',
    name: 'MES Core — Диспетчеризация партий',
    techStack: 'Golang / gRPC',
    version: 'v2.4.1',
    componentType: ComponentType.SERVICE,
    lifecycle: ComponentLifecycle.ACTIVE,
    x: 380, y: 80,
  });

  const cmpDb = idef10Editor.addComponent({
    code: 'CMP-TSDB-01',
    name: 'Хранилище телеметрии и партий (TSDB)',
    techStack: 'TimescaleDB / PostgreSQL',
    version: 'v16.2',
    componentType: ComponentType.DATABASE,
    lifecycle: ComponentLifecycle.ACTIVE,
    x: 720, y: 80,
  });

  const cmpScada = idef10Editor.addComponent({
    code: 'CMP-SCADA-01',
    name: 'Шлюз сбора телеметрии цеха (SCADA)',
    techStack: 'C# / .NET 8 / OPC SDK',
    version: 'v1.8.0',
    componentType: ComponentType.SERVICE,
    lifecycle: ComponentLifecycle.ACTIVE,
    x: 380, y: 350,
  });

  const cmpPlc = idef10Editor.addComponent({
    code: 'CMP-PLC-01',
    name: 'Управляющая программа печи ПАП-6',
    techStack: 'Siemens Step 7 / SCL',
    version: 'v4.1.2',
    componentType: ComponentType.HARDWARE_DEVICE,
    lifecycle: ComponentLifecycle.ACTIVE,
    x: 380, y: 600,
  });

  const intfRest = idef10Editor.addInterface({
    name: 'REST API шлюза заказов',
    protocol: InterfaceProtocol.REST_API,
    portNumber: 8080,
    x: 50, y: 280,
  });

  const intfGrpc = idef10Editor.addInterface({
    name: 'gRPC шина телеметрии печей',
    protocol: InterfaceProtocol.GRPC,
    portNumber: 50051,
    x: 380, y: 220,
  });

  const intfOpc = idef10Editor.addInterface({
    name: 'OPC-UA Endpoint ПЛК печи',
    protocol: InterfaceProtocol.OPC_UA,
    portNumber: 4840,
    x: 380, y: 480,
  });

  const nodeK8s = idef10Editor.addExecutionNode({
    code: 'NODE-K8S-01',
    name: 'Кластер серверов MES (Worker-1)',
    nodeType: NodeType.CONTAINER_CLUSTER,
    ipAddress: '192.168.10.15',
    osPlatform: 'Debian 12 / K8s v1.30',
    x: 720, y: 320,
  });

  const nodeDb = idef10Editor.addExecutionNode({
    code: 'NODE-DB-HOST',
    name: 'Выделенный сервер БД (Bare Metal)',
    nodeType: NodeType.SERVER,
    ipAddress: '192.168.10.20',
    osPlatform: 'RHEL 9.3',
    x: 1040, y: 80,
  });

  const nodeIpc = idef10Editor.addExecutionNode({
    code: 'NODE-IPC-01',
    name: 'Промышленный ПК Advantech UNO',
    nodeType: NodeType.EDGE_CONTROLLER,
    ipAddress: '192.168.20.5',
    osPlatform: 'Ubuntu RT',
    x: 720, y: 560,
  });

  const artMes = idef10Editor.addArtifact({
    name: 'mes-core-service:2.4.1',
    artifactType: ArtifactType.DOCKER_IMAGE,
    repositoryUrl: 'registry.avia/mes/core:2.4.1',
    x: 1040, y: 320,
  });

  idef10Editor.addLink({ sourceId: cmpHmi.id, targetId: intfRest.id, type: ArchitectureLinkType.CALLS, label: 'HTTP/JSON' });
  idef10Editor.addLink({ sourceId: cmpMes.id, targetId: intfRest.id, type: ArchitectureLinkType.EXPOSES_INTERFACE });
  idef10Editor.addLink({ sourceId: cmpMes.id, targetId: intfGrpc.id, type: ArchitectureLinkType.EXPOSES_INTERFACE });
  idef10Editor.addLink({ sourceId: cmpScada.id, targetId: intfGrpc.id, type: ArchitectureLinkType.CALLS, label: 'gRPC stream' });
  idef10Editor.addLink({ sourceId: cmpScada.id, targetId: intfOpc.id, type: ArchitectureLinkType.CALLS, label: 'OPC.TCP' });
  idef10Editor.addLink({ sourceId: cmpPlc.id, targetId: intfOpc.id, type: ArchitectureLinkType.EXPOSES_INTERFACE });
  idef10Editor.addLink({ sourceId: cmpMes.id, targetId: cmpDb.id, type: ArchitectureLinkType.READS_WRITES, label: 'SQL TCP' });
  idef10Editor.addLink({ sourceId: cmpMes.id, targetId: nodeK8s.id, type: ArchitectureLinkType.DEPLOYS_ON, label: 'K8s Pod' });
  idef10Editor.addLink({ sourceId: cmpDb.id, targetId: nodeDb.id, type: ArchitectureLinkType.DEPLOYS_ON, label: 'Systemd' });
  idef10Editor.addLink({ sourceId: cmpScada.id, targetId: nodeIpc.id, type: ArchitectureLinkType.DEPLOYS_ON, label: 'Docker' });
  idef10Editor.addLink({ sourceId: cmpMes.id, targetId: artMes.id, type: ArchitectureLinkType.PACKAGED_AS, label: 'CI/CD' });

  const updateIdef10UI = () => {
    if (!idef10Editor) return;
    const diag = idef10Editor.getActiveDiagram();
    const el1 = document.getElementById('cmpCount');
    if (el1) el1.textContent = `${diag.components.length}`;
    const el2 = document.getElementById('nodeCount');
    if (el2) el2.textContent = `${diag.executionNodes.length}`;
    const el3 = document.getElementById('intfCount');
    if (el3) el3.textContent = `${diag.interfaces.length}`;
    const el4 = document.getElementById('artCount');
    if (el4) el4.textContent = `${diag.artifacts.length}`;
  };

  idef10Editor.setOnDiagramChanged(() => {
    updateIdef10UI();
    setTimeout(() => { idef10Editor?.autoLayout(); }, 50);
  });
  updateIdef10UI();
  setTimeout(() => { idef10Editor?.autoLayout(); }, 80);
}

// ==========================================
// IDEF9 Setup (KBSI Business Rules & Constraints)
// ==========================================
function setupIDEF9() {
  destroyAllEditors();
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  idef9Editor = new IDEF9Editor();
  idef9Editor.initialize(container);
  idef9Editor.createModel(
    'metal-avia-constraints-v1',
    'IDEF9: Ограничения производства лопаток ГТД — ОАО «Металл-Авиа»'
  );

  // Load demo data
  const docGOST = idef9Editor.addSourceDocument({
    code: 'ГОСТ Р 55892',
    name: 'ГОСТ Р 55892-2013 — Термообработка никелевых сплавов',
    documentType: DocumentType.STATE_STANDARD,
    x: 50, y: 80,
  });
  const docOST = idef9Editor.addSourceDocument({
    code: 'ОСТ 1 90218',
    name: 'ОСТ 1 90218-76 — Лопатки турбин авиадвигателей',
    documentType: DocumentType.INDUSTRY_CODE,
    x: 50, y: 280,
  });
  const docTK = idef9Editor.addSourceDocument({
    code: 'ТК РФ ст.103',
    name: 'Трудовой кодекс РФ — Ст. 103 Сменная работа',
    documentType: DocumentType.LAW_REGULATION,
    x: 50, y: 480,
  });
  const cTemp = idef9Editor.addConstraint({
    code: 'CR-01',
    name: 'Температурный режим закалки лопатки',
    statement: 'T_закалки ∈ [1050°C, 1080°C] при выдержке τ = 2±0.1 ч.',
    constraintType: ConstraintType.TECHNICAL,
    severity: ConstraintSeverity.MANDATORY,
    x: 380, y: 80,
  });
  const cTool = idef9Editor.addConstraint({
    code: 'CR-02',
    name: 'Износ режущего инструмента ЧПУ',
    statement: 'VB_инструмента ≤ 0.3 мм',
    constraintType: ConstraintType.TECHNICAL,
    severity: ConstraintSeverity.MANDATORY,
    x: 380, y: 260,
  });
  const cShift = idef9Editor.addConstraint({
    code: 'CR-03',
    name: 'Продолжительность смены у термоагрегата',
    statement: 'Оператор работает не более 12 ч. непрерывно',
    constraintType: ConstraintType.REGULATORY,
    severity: ConstraintSeverity.MANDATORY,
    x: 380, y: 440,
  });
  const cSLA = idef9Editor.addConstraint({
    code: 'CR-04',
    name: 'SLA отклика MES на аварийный сигнал',
    statement: 'T_resp ≤ 2 сек',
    constraintType: ConstraintType.TIME,
    severity: ConstraintSeverity.CONDITIONAL,
    x: 380, y: 620,
  });
  const objThermo = idef9Editor.addControlledObject({
    name: 'Термообработка — Закалка лопатки',
    objectType: ControlledObjectType.PROCESS,
    description: 'Электровакуумная печь ПАП-6',
    x: 720, y: 80,
  });
  const objBlade = idef9Editor.addControlledObject({
    name: 'Лопатка турбины 1-й ступени ГТД',
    objectType: ControlledObjectType.PRODUCT,
    description: 'Сплав ЖС6У, ОСТ 1 90218-76',
    x: 720, y: 300,
  });
  const objOperator = idef9Editor.addControlledObject({
    name: 'Операторы термического участка',
    objectType: ControlledObjectType.PERSONNEL,
    x: 720, y: 520,
  });
  const mechPLC = idef9Editor.addEnforcementMechanism({
    name: 'ПЛК Siemens S7-1500 (блокировка нагрева)',
    mechanismType: MechanismType.AUTOMATED_PLC,
    x: 1060, y: 80,
  });
  const mechMES = idef9Editor.addEnforcementMechanism({
    name: 'MES Opcenter — контроль инструмента',
    mechanismType: MechanismType.SOFTWARE_RULE,
    x: 1060, y: 280,
  });
  const mechERP = idef9Editor.addEnforcementMechanism({
    name: 'Аудит 1С:ERP — рабочее время',
    mechanismType: MechanismType.ERP_AUDIT,
    x: 1060, y: 480,
  });

  idef9Editor.addLink({ sourceId: cTemp.id, targetId: docGOST.id, type: ConstraintLinkType.DERIVED_FROM });
  idef9Editor.addLink({ sourceId: cShift.id, targetId: docTK.id, type: ConstraintLinkType.DERIVED_FROM });
  idef9Editor.addLink({ sourceId: cTemp.id, targetId: objThermo.id, type: ConstraintLinkType.CONSTRAINS });
  idef9Editor.addLink({ sourceId: cTool.id, targetId: objBlade.id, type: ConstraintLinkType.CONSTRAINS });
  idef9Editor.addLink({ sourceId: cShift.id, targetId: objOperator.id, type: ConstraintLinkType.CONSTRAINS });
  idef9Editor.addLink({ sourceId: cTemp.id, targetId: mechPLC.id, type: ConstraintLinkType.ENFORCED_BY });
  idef9Editor.addLink({ sourceId: cTool.id, targetId: mechMES.id, type: ConstraintLinkType.ENFORCED_BY });
  idef9Editor.addLink({ sourceId: cShift.id, targetId: mechERP.id, type: ConstraintLinkType.ENFORCED_BY });
  idef9Editor.addLink({ sourceId: cSLA.id, targetId: mechMES.id, type: ConstraintLinkType.ENFORCED_BY });
  idef9Editor.addLink({
    sourceId: cTemp.id, targetId: cSLA.id, type: ConstraintLinkType.CONFLICTS_WITH,
    label: 'SLA под угрозой при аварии печи',
  });

  const updateIdef9UI = () => {
    if (!idef9Editor) return;
    const diag = idef9Editor.getActiveDiagram();
    const el = document.getElementById('constraintCount');
    if (el) el.textContent = `${diag.constraints.length}`;
    const el2 = document.getElementById('objCount');
    if (el2) el2.textContent = `${diag.controlledObjects.length}`;
    const el3 = document.getElementById('mechCount');
    if (el3) el3.textContent = `${diag.enforcementMechanisms.length}`;
    const el4 = document.getElementById('docCount');
    if (el4) el4.textContent = `${diag.sourceDocuments.length}`;
  };

  idef9Editor.setOnDiagramChanged(() => {
    updateIdef9UI();
    setTimeout(() => { idef9Editor?.autoLayout(); }, 50);
  });
  updateIdef9UI();
  setTimeout(() => { idef9Editor?.autoLayout(); }, 80);
}

// ==========================================
// IDEF8 Setup (KBSI Human-System Interaction)
// ==========================================
function setupIDEF8() {
  destroyAllEditors();
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  idef8Editor = new IDEF8Editor();
  idef8Editor.initialize(container);

  loadRussianEnterpriseIDEF8Demo(idef8Editor);

  const updateIdef8UI = () => {
    if (!idef8Editor) return;
    const diag = idef8Editor.getActiveDiagram();

    const screenCountEl = document.getElementById('screenCount');
    if (screenCountEl) {
      screenCountEl.textContent = `${diag.screens.length}`;
    }

    const actionCountEl = document.getElementById('actionCount');
    if (actionCountEl) {
      actionCountEl.textContent = `${diag.userActions.length}`;
    }
  };

  idef8Editor.setOnDiagramChanged(() => {
    updateIdef8UI();
    setTimeout(() => {
      idef8Editor?.autoLayout();
    }, 50);
  });

  updateIdef8UI();
  setTimeout(() => {
    idef8Editor?.autoLayout();
  }, 80);
}

// ==========================================
// IDEF6 Setup (KBSI Design Rationale)
// ==========================================
function setupIDEF6() {
  destroyAllEditors();
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  idef6Editor = new IDEF6Editor();
  idef6Editor.initialize(container);

  loadRussianEnterpriseIDEF6Demo(idef6Editor);

  const updateIdef6UI = () => {
    if (!idef6Editor) return;
    const diag = idef6Editor.getActiveDiagram();

    const issueCountEl = document.getElementById('issueCount');
    if (issueCountEl) {
      issueCountEl.textContent = `${diag.issues.length}`;
    }

    const altCountEl = document.getElementById('altCount');
    if (altCountEl) {
      altCountEl.textContent = `${diag.alternatives.length}`;
    }
  };

  idef6Editor.setOnDiagramChanged(() => {
    updateIdef6UI();
    setTimeout(() => {
      idef6Editor?.autoLayout();
    }, 50);
  });

  updateIdef6UI();
  setTimeout(() => {
    idef6Editor?.autoLayout();
  }, 80);
}

// ==========================================
// IDEF5 Setup
// ==========================================
function setupIDEF5() {
  destroyAllEditors();
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  idef5Editor = new IDEF5Editor();
  idef5Editor.initialize(container);

  loadRussianEnterpriseIDEF5Demo(idef5Editor);

  const updateIdef5UI = () => {
    if (!idef5Editor) return;
    const diag = idef5Editor.getActiveDiagram();

    const kindCountEl = document.getElementById('kindCount');
    if (kindCountEl) {
      const kindsOnly = diag.kinds.filter((k) => !k.isIndividual);
      kindCountEl.textContent = `${kindsOnly.length}`;
    }

    const indCountEl = document.getElementById('indCount');
    if (indCountEl) {
      const indsOnly = diag.kinds.filter((k) => k.isIndividual);
      indCountEl.textContent = `${indsOnly.length}`;
    }
  };

  idef5Editor.setOnDiagramChanged(() => {
    updateIdef5UI();
    setTimeout(() => {
      idef5Editor?.autoLayout();
    }, 50);
  });

  updateIdef5UI();
  setTimeout(() => {
    idef5Editor?.autoLayout();
  }, 80);
}


// ==========================================
// IDEF4 Setup
// ==========================================
function setupIDEF4() {
  destroyAllEditors();
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  idef4Editor = new IDEF4Editor();
  idef4Editor.initialize(container);

  const model = createRussianEnterpriseIDEF4Model();
  idef4Editor.importJSON(JSON.stringify(model.toJSON()));

  const updateIdef4UI = () => {
    if (!idef4Editor) return;
    const diag = idef4Editor.getActiveDiagram();

    const classCountEl = document.getElementById('classCount');
    if (classCountEl) classCountEl.textContent = `${diag.classes.length}`;

    const relCountEl = document.getElementById('ooRelCount');
    if (relCountEl) relCountEl.textContent = `${diag.relationships.length}`;
  };

  idef4Editor.setOnDiagramChanged(() => {
    updateIdef4UI();
    setTimeout(() => {
      idef4Editor?.autoLayout();
    }, 50);
  });

  updateIdef4UI();
  setTimeout(() => {
    idef4Editor?.autoLayout();
  }, 80);
}

// ==========================================
// IDEF3 Setup
// ==========================================
function setupIDEF3() {
  destroyAllEditors();
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  idef3Editor = new IDEF3Editor();
  idef3Editor.initialize(container);

  const model = createRussianEnterpriseIDEF3Model();
  idef3Editor.importJSON(JSON.stringify(model.toJSON()));

  const updateIdef3UI = () => {
    if (!idef3Editor) return;
    const diag = idef3Editor.getActiveDiagram();

    const breadcrumbEl = document.getElementById('currentScenarioNode');
    if (breadcrumbEl) {
      breadcrumbEl.textContent = `${diag.scenarioNumber}: ${diag.title}`;
    }

    const selectEl = document.getElementById('selectIdef3Diagram') as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = diag.id;
    }

    const uobCountEl = document.getElementById('uobCount');
    if (uobCountEl) {
      uobCountEl.textContent = `${diag.uobs.length}`;
    }

    const junctionCountEl = document.getElementById('junctionCount');
    if (junctionCountEl) {
      junctionCountEl.textContent = `${diag.junctions.length}`;
    }
  };

  idef3Editor.setOnDiagramChanged(() => {
    updateIdef3UI();
    setTimeout(() => {
      idef3Editor?.autoLayout();
    }, 50);
  });

  updateIdef3UI();
  setTimeout(() => {
    idef3Editor?.autoLayout();
  }, 80);
}

// ==========================================
// IDEF0 Setup
// ==========================================
function setupIDEF0() {
  destroyAllEditors();
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  idef0Editor = new IDEF0Editor();
  idef0Editor.initialize(container);

  const model = createRussianEnterpriseIDEF0Model();
  idef0Editor.importJSON(JSON.stringify(model.toJSON()));

  const updateIdef0UI = () => {
    if (!idef0Editor) return;
    const diag = idef0Editor.getActiveDiagram();

    const breadcrumbEl = document.getElementById('currentDiagNode');
    if (breadcrumbEl) {
      breadcrumbEl.textContent = `${diag.nodeNumber}: ${diag.title}`;
    }

    const selectEl = document.getElementById('selectIdef0Diagram') as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = diag.id;
    }

    const actCountEl = document.getElementById('actCount');
    if (actCountEl) {
      actCountEl.textContent = `${diag.activities.length}`;
    }

    const arrowCountEl = document.getElementById('arrowCount');
    if (arrowCountEl) {
      arrowCountEl.textContent = `${diag.arrows.length}`;
    }
  };

  idef0Editor.setOnDiagramChanged(() => {
    updateIdef0UI();
    setTimeout(() => {
      idef0Editor?.autoLayout();
    }, 50);
  });

  updateIdef0UI();
  setTimeout(() => {
    idef0Editor?.autoLayout();
  }, 100);
}

// ==========================================
// IDEF1X Setup
// ==========================================
async function loadDefaultEnglishModel(editor: IDEF1Editor): Promise<void> {
  const deptId = await editor.addEntity('DEPARTMENT', {
    isDependent: false,
    position: { x: 80, y: 80 },
    primaryKeys: [{ name: 'dept_no', dataType: 'CHAR(4)' }],
    nonKeys: [
      { name: 'dept_name', dataType: 'VARCHAR(40)' },
      { name: 'budget', dataType: 'DECIMAL(12,2)' },
    ],
  });

  const empId = await editor.addEntity('EMPLOYEE', {
    isDependent: false,
    position: { x: 380, y: 80 },
    primaryKeys: [{ name: 'emp_no', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'ssn', dataType: 'CHAR(9)', alternateKeyIndex: 1 },
      { name: 'first_name', dataType: 'VARCHAR(30)' },
      { name: 'last_name', dataType: 'VARCHAR(30)' },
      { name: 'hire_date', dataType: 'DATE' },
    ],
  });

  const projAssignId = await editor.addEntity('PROJECT_ASSIGNMENT', {
    isDependent: true,
    position: { x: 380, y: 320 },
    primaryKeys: [{ name: 'assignment_id', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'role', dataType: 'VARCHAR(50)' },
      { name: 'hours_allocated', dataType: 'DECIMAL(5,2)' },
    ],
  });

  const ftId = await editor.addEntity('FULL_TIME_EMP', {
    isDependent: true,
    position: { x: 680, y: 50 },
    nonKeys: [{ name: 'annual_salary', dataType: 'DECIMAL(10,2)' }],
  });

  const ptId = await editor.addEntity('PART_TIME_EMP', {
    isDependent: true,
    position: { x: 680, y: 190 },
    nonKeys: [{ name: 'hourly_rate', dataType: 'DECIMAL(6,2)' }],
  });

  const projId = await editor.addEntity('PROJECT', {
    isDependent: false,
    position: { x: 80, y: 240 },
    primaryKeys: [{ name: 'proj_no', dataType: 'CHAR(6)' }],
    nonKeys: [{ name: 'title', dataType: 'VARCHAR(60)' }],
  });

  await editor.addRelationship(deptId, empId, {
    name: 'employs',
    inverseName: 'is employed by',
    type: RelationshipType.NON_IDENTIFYING,
    cardinality: Cardinality.ONE_OR_MORE,
    isOptional: true,
  });

  await editor.addRelationship(empId, projAssignId, {
    name: 'works on',
    inverseName: 'is staffed by',
    type: RelationshipType.IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
  });

  await editor.addRelationship(projId, empId, {
    name: 'participates in',
    inverseName: 'involves',
    type: RelationshipType.NON_SPECIFIC,
  });

  await editor.addRelationship(empId, empId, {
    name: 'manages',
    inverseName: 'reports to',
    roleName: 'manager',
    type: RelationshipType.NON_IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
    isOptional: true,
  });

  await editor.addCategorization(empId, 'emp_type', [ftId, ptId], true);

  editor.addNote(
    'Total hours allocated across all assignments cannot exceed 40 hours per week.',
    { number: 1, position: { x: 680, y: 320 } }
  );
}

async function setupIDEF1(modelType: 'ru' | 'en' = 'ru') {
  destroyAllEditors();
  const container = document.getElementById('diagramDiv');
  if (!container) return;
  const modelName =
    modelType === 'ru'
      ? 'Информационная модель ERP-системы предприятия (IDEF1X)'
      : 'Enterprise IDEF1X Data Model';

  idef1Editor = new IDEF1Editor({
    container,
    modelName,
    diagramOptions: {
      gridVisible: true,
    },
  });

  if (modelType === 'ru') {
    await loadRussianEnterpriseModel(idef1Editor);
  } else {
    await loadDefaultEnglishModel(idef1Editor);
  }

  const entityCountEl = document.getElementById('entityCount');
  const relCountEl = document.getElementById('relCount');
  const updateStats = () => {
    if (!idef1Editor) return;
    const model = idef1Editor.getModel();
    if (entityCountEl) entityCountEl.textContent = `${model.entities.length}`;
    if (relCountEl) relCountEl.textContent = `${model.relationships.length}`;
  };
  updateStats();

  idef1Editor.onEvent('EntityCreated', () => updateStats());
  idef1Editor.onEvent('EntityRemoved', () => updateStats());
  idef1Editor.onEvent('RelationshipAdded', () => updateStats());
  idef1Editor.onEvent('RelationshipRemoved', () => updateStats());

  const viewLevelSelect = document.getElementById('selectViewLevel') as HTMLSelectElement;
  if (viewLevelSelect) {
    idef1Editor.setViewLevel(viewLevelSelect.value as any);
  }

  setTimeout(() => {
    idef1Editor?.autoLayout({ direction: 0 });
  }, 80);
}

// ==========================================
// Mode Switcher
// ==========================================
function switchMode(mode: 'idef10' | 'idef9' | 'idef8' | 'idef6' | 'idef5' | 'idef4' | 'idef3' | 'idef0' | 'idef1') {
  activeMode = mode;
  const tabIdef10 = document.getElementById('tabIdef10');
  const tabIdef9 = document.getElementById('tabIdef9');
  const tabIdef8 = document.getElementById('tabIdef8');
  const tabIdef6 = document.getElementById('tabIdef6');
  const tabIdef5 = document.getElementById('tabIdef5');
  const tabIdef4 = document.getElementById('tabIdef4');
  const tabIdef3 = document.getElementById('tabIdef3');
  const tabIdef0 = document.getElementById('tabIdef0');
  const tabIdef1 = document.getElementById('tabIdef1');

  const tbIdef10 = document.getElementById('toolbarIdef10');
  const tbIdef9 = document.getElementById('toolbarIdef9');
  const tbIdef8 = document.getElementById('toolbarIdef8');
  const tbIdef6 = document.getElementById('toolbarIdef6');
  const tbIdef5 = document.getElementById('toolbarIdef5');
  const tbIdef4 = document.getElementById('toolbarIdef4');
  const tbIdef3 = document.getElementById('toolbarIdef3');
  const tbIdef0 = document.getElementById('toolbarIdef0');
  const tbIdef1 = document.getElementById('toolbarIdef1');

  const sbIdef10 = document.getElementById('sidebarIdef10');
  const sbIdef9 = document.getElementById('sidebarIdef9');
  const sbIdef8 = document.getElementById('sidebarIdef8');
  const sbIdef6 = document.getElementById('sidebarIdef6');
  const sbIdef5 = document.getElementById('sidebarIdef5');
  const sbIdef4 = document.getElementById('sidebarIdef4');
  const sbIdef3 = document.getElementById('sidebarIdef3');
  const sbIdef0 = document.getElementById('sidebarIdef0');
  const sbIdef1 = document.getElementById('sidebarIdef1');

  // Reset tabs
  tabIdef10?.classList.remove('active');
  tabIdef9?.classList.remove('active');
  tabIdef8?.classList.remove('active');
  tabIdef6?.classList.remove('active');
  tabIdef5?.classList.remove('active');
  tabIdef4?.classList.remove('active');
  tabIdef3?.classList.remove('active');
  tabIdef0?.classList.remove('active');
  tabIdef1?.classList.remove('active');

  // Hide toolbars
  if (tbIdef10) tbIdef10.style.display = 'none';
  if (tbIdef9) tbIdef9.style.display = 'none';
  if (tbIdef8) tbIdef8.style.display = 'none';
  if (tbIdef6) tbIdef6.style.display = 'none';
  if (tbIdef5) tbIdef5.style.display = 'none';
  if (tbIdef4) tbIdef4.style.display = 'none';
  if (tbIdef3) tbIdef3.style.display = 'none';
  if (tbIdef0) tbIdef0.style.display = 'none';
  if (tbIdef1) tbIdef1.style.display = 'none';

  // Hide sidebars
  if (sbIdef10) sbIdef10.style.display = 'none';
  if (sbIdef9) sbIdef9.style.display = 'none';
  if (sbIdef8) sbIdef8.style.display = 'none';
  if (sbIdef6) sbIdef6.style.display = 'none';
  if (sbIdef5) sbIdef5.style.display = 'none';
  if (sbIdef4) sbIdef4.style.display = 'none';
  if (sbIdef3) sbIdef3.style.display = 'none';
  if (sbIdef0) sbIdef0.style.display = 'none';
  if (sbIdef1) sbIdef1.style.display = 'none';

  if (mode === 'idef10') {
    tabIdef10?.classList.add('active');
    if (tbIdef10) tbIdef10.style.display = 'flex';
    if (sbIdef10) sbIdef10.style.display = 'flex';
    setupIDEF10();
  } else if (mode === 'idef9') {
    tabIdef9?.classList.add('active');
    if (tbIdef9) tbIdef9.style.display = 'flex';
    if (sbIdef9) sbIdef9.style.display = 'flex';
    setupIDEF9();
  } else if (mode === 'idef8') {
    tabIdef8?.classList.add('active');
    if (tbIdef8) tbIdef8.style.display = 'flex';
    if (sbIdef8) sbIdef8.style.display = 'flex';
    setupIDEF8();
  } else if (mode === 'idef6') {
    tabIdef6?.classList.add('active');
    if (tbIdef6) tbIdef6.style.display = 'flex';
    if (sbIdef6) sbIdef6.style.display = 'flex';
    setupIDEF6();
  } else if (mode === 'idef5') {
    tabIdef5?.classList.add('active');
    if (tbIdef5) tbIdef5.style.display = 'flex';
    if (sbIdef5) sbIdef5.style.display = 'flex';
    setupIDEF5();
  } else if (mode === 'idef4') {
    tabIdef4?.classList.add('active');
    if (tbIdef4) tbIdef4.style.display = 'flex';
    if (sbIdef4) sbIdef4.style.display = 'flex';
    setupIDEF4();
  } else if (mode === 'idef3') {
    tabIdef3?.classList.add('active');
    if (tbIdef3) tbIdef3.style.display = 'flex';
    if (sbIdef3) sbIdef3.style.display = 'flex';
    setupIDEF3();
  } else if (mode === 'idef0') {
    tabIdef0?.classList.add('active');
    if (tbIdef0) tbIdef0.style.display = 'flex';
    if (sbIdef0) sbIdef0.style.display = 'flex';
    setupIDEF0();
  } else {
    tabIdef1?.classList.add('active');
    if (tbIdef1) tbIdef1.style.display = 'flex';
    if (sbIdef1) sbIdef1.style.display = 'flex';
    setupIDEF1('ru');
  }
}

// ==========================================
// DOM Event Listeners
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  document.getElementById('tabIdef10')?.addEventListener('click', () => switchMode('idef10'));
  document.getElementById('tabIdef9')?.addEventListener('click', () => switchMode('idef9'));
  document.getElementById('tabIdef8')?.addEventListener('click', () => switchMode('idef8'));
  document.getElementById('tabIdef6')?.addEventListener('click', () => switchMode('idef6'));
  document.getElementById('tabIdef5')?.addEventListener('click', () => switchMode('idef5'));
  document.getElementById('tabIdef4')?.addEventListener('click', () => switchMode('idef4'));
  document.getElementById('tabIdef3')?.addEventListener('click', () => switchMode('idef3'));
  document.getElementById('tabIdef0')?.addEventListener('click', () => switchMode('idef0'));
  document.getElementById('tabIdef1')?.addEventListener('click', () => switchMode('idef1'));

  // ----------------------------------------
  // IDEF8 Toolbar Handlers
  // ----------------------------------------
  document.getElementById('btnIdef8AutoLayout')?.addEventListener('click', () => {
    idef8Editor?.autoLayout();
  });

  document.getElementById('btnIdef8ZoomFit')?.addEventListener('click', () => {
    idef8Editor?.zoomToFit();
  });

  document.getElementById('btnAddIdef8Screen')?.addEventListener('click', () => {
    if (!idef8Editor) return;
    const name = prompt('Введите наименование экрана / окна (Screen/Dialog):', 'Экран настройки приводов');
    if (!name) return;
    idef8Editor.addScreen({
      name,
      screenType: ScreenType.CONTROL_PANEL,
      widgets: [
        { id: `w-${Date.now()}-1`, name: 'Кнопка "Тест привода"', widgetType: 'BUTTON' },
        { id: `w-${Date.now()}-2`, name: 'Шкала тока фазы А (Ампер)', widgetType: 'GAUGE' },
      ],
      x: 350 + Math.random() * 150,
      y: 200 + Math.random() * 150,
    });
  });

  document.getElementById('btnAddIdef8UserAction')?.addEventListener('click', () => {
    if (!idef8Editor) return;
    const name = prompt('Введите действие пользователя (User Action):', 'Нажатие кнопки "Калибровка оси Z"');
    if (!name) return;
    idef8Editor.addUserAction({
      name,
      modality: ActionModality.CLICK,
      x: 550 + Math.random() * 150,
      y: 200 + Math.random() * 150,
    });
  });

  document.getElementById('btnAddIdef8SystemResponse')?.addEventListener('click', () => {
    if (!idef8Editor) return;
    const name = prompt('Введите реакцию системы (System Response):', 'Запуск цикла калибровки индуктивных датчиков');
    if (!name) return;
    idef8Editor.addSystemResponse({
      name,
      responseType: ResponseType.STATE_CHANGE,
      x: 750 + Math.random() * 150,
      y: 200 + Math.random() * 150,
    });
  });

  document.getElementById('btnAddIdef8UserRole')?.addEventListener('click', () => {
    if (!idef8Editor) return;
    const name = prompt('Введите наименование роли пользователя (User Role):', 'Инженер по наладке ЧПУ');
    if (!name) return;
    idef8Editor.addUserRole({
      name,
      privilegeLevel: PrivilegeLevel.ENGINEER,
      x: 100 + Math.random() * 150,
      y: 200 + Math.random() * 150,
    });
  });

  document.getElementById('btnValidateIdef8')?.addEventListener('click', () => {
    if (!idef8Editor) return;
    const issues = idef8Editor.validate();
    if (issues.length === 0) {
      alert('✓ Модель интерфейса человека-системы полностью соответствует стандарту IDEF8!\n\n- Модальные окна не содержат тупиковых блокировок\n- Все действия пользователей обрабатываются переходами или откликами системы\n- Отсутствуют дубликаты имен экранов и разорванные связи');
    } else {
      const msg = issues.map((i) => `[${i.severity}] ${i.code}: ${i.message}`).join('\n\n');
      alert(`Результаты проверки IDEF8:\n\n${msg}`);
    }
  });

  document.getElementById('btnIdef8ExportJson')?.addEventListener('click', () => {
    if (!idef8Editor) return;
    const json = idef8Editor.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef8_interaction_model.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnIdef8ImportJson')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && idef8Editor) {
        const text = await file.text();
        idef8Editor.importJSON(text);
      }
    };
    input.click();
  });

  // ----------------------------------------
  // IDEF6 Toolbar Handlers
  // ----------------------------------------
  document.getElementById('btnIdef6AutoLayout')?.addEventListener('click', () => {
    idef6Editor?.autoLayout();
  });

  document.getElementById('btnIdef6ZoomFit')?.addEventListener('click', () => {
    idef6Editor?.zoomToFit();
  });

  document.getElementById('btnAddIdef6Issue')?.addEventListener('click', () => {
    if (!idef6Editor) return;
    const name = prompt('Введите наименование инженерного вопроса / дилеммы (Issue):', 'Выбор протокола шины АСУ ТП');
    if (!name) return;
    idef6Editor.addIssue({
      name,
      description: 'Инженерная проблема выбора стека протоколов',
      status: IssueStatus.OPEN,
      x: 100 + Math.random() * 150,
      y: 100 + Math.random() * 150,
    });
  });

  document.getElementById('btnAddIdef6Alternative')?.addEventListener('click', () => {
    if (!idef6Editor) return;
    const name = prompt('Введите наименование альтернативы / варианта (Alternative):', 'OPC UA Pub/Sub');
    if (!name) return;
    idef6Editor.addAlternative({
      name,
      description: 'Вариант архитектурного решения',
      status: AlternativeStatus.PROPOSED,
      x: 350 + Math.random() * 150,
      y: 100 + Math.random() * 150,
    });
  });

  document.getElementById('btnAddIdef6Criterion')?.addEventListener('click', () => {
    if (!idef6Editor) return;
    const name = prompt('Введите критерий оценки (Criterion):', 'Гарантия доставки Hard Real-Time');
    if (!name) return;
    idef6Editor.addCriterion({
      name,
      description: 'Критерий соответствия требованиям ТЗ',
      type: CriterionType.CONSTRAINT,
      x: 600 + Math.random() * 150,
      y: 100 + Math.random() * 150,
    });
  });

  document.getElementById('btnAddIdef6Argument')?.addEventListener('click', () => {
    if (!idef6Editor) return;
    const name = prompt('Введите аргумент (Argument):', 'Обеспечивает детерминированную передачу сигналов TSN');
    if (!name) return;
    const isCon = confirm('Этот аргумент ПРОТИВ (CON)?\n\nНажмите "OK" для аргумента ПРОТИВ (CON),\nили "Отмена" для аргумента ЗА (PRO).');
    idef6Editor.addArgument({
      name,
      type: isCon ? ArgumentType.CON : ArgumentType.PRO,
      description: 'Экспертная оценка решения',
      x: 850 + Math.random() * 150,
      y: 100 + Math.random() * 150,
    });
  });

  document.getElementById('btnValidateIdef6')?.addEventListener('click', () => {
    if (!idef6Editor) return;
    const issues = idef6Editor.validate();
    if (issues.length === 0) {
      alert('✓ Модель обоснования полностью соответствует стандарту IDEF6!\n\n- Все решенные вопросы (RESOLVED) имеют ровно одну принятую альтернативу (ACCEPTED)\n- Граф аргументации и критериев валиден\n- Отсутствуют дубликаты и разорванные связи');
    } else {
      const msg = issues.map((i) => `[${i.severity}] ${i.code}: ${i.message}`).join('\n\n');
      alert(`Результаты проверки IDEF6:\n\n${msg}`);
    }
  });

  document.getElementById('btnIdef6ExportJson')?.addEventListener('click', () => {
    if (!idef6Editor) return;
    const json = idef6Editor.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef6_rationale_model.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnIdef6ImportJson')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && idef6Editor) {
        const text = await file.text();
        idef6Editor.importJSON(text);
      }
    };
    input.click();
  });

  // ----------------------------------------
  // IDEF5 Toolbar Handlers
  // ----------------------------------------
  document.getElementById('btnIdef5AutoLayout')?.addEventListener('click', () => {
    idef5Editor?.autoLayout();
  });

  document.getElementById('btnIdef5ZoomFit')?.addEventListener('click', () => {
    idef5Editor?.zoomToFit();
  });

  document.getElementById('btnAddIdef5Kind')?.addEventListener('click', () => {
    if (!idef5Editor) return;
    const name = prompt('Введите имя понятия (Kind Name):', 'Сверлильный_Станок');
    if (!name) return;
    idef5Editor.addKind({
      name,
      description: 'Технологическое оборудование сверлильной группы',
      isIndividual: false,
      properties: [{ name: 'макс_диаметр_сверления_мм', valueType: 'float' }],
      x: 200 + Math.random() * 150,
      y: 200 + Math.random() * 150,
    });
  });

  document.getElementById('btnAddIdef5Individual')?.addEventListener('click', () => {
    if (!idef5Editor) return;
    const name = prompt('Введите имя индивида (Individual):', 'Индивид_Станок_2А135');
    if (!name) return;
    idef5Editor.addKind({
      name,
      description: 'Конкретный физический экземпляр станка',
      isIndividual: true,
      properties: [{ name: 'инвентарный_номер', valueType: 'string', defaultValue: 'INV-2A135-01' }],
      x: 200 + Math.random() * 150,
      y: 350 + Math.random() * 150,
    });
  });

  document.getElementById('btnValidateIdef5')?.addEventListener('click', () => {
    if (!idef5Editor) return;
    const issues = idef5Editor.validate();
    if (issues.length === 0) {
      alert('✓ Онтологическая схема полностью соответствует стандарту KBSI IDEF5!\n\n- Таксономия (subkind-of) не содержит циклов\n- Имена понятий уникальны\n- Отсутствуют висячие или некорректные связи');
    } else {
      const msg = issues.map((i) => `[${i.severity}] ${i.code}: ${i.message}`).join('\n\n');
      alert(`Результаты проверки IDEF5:\n\n${msg}`);
    }
  });

  document.getElementById('btnIdef5ExportJson')?.addEventListener('click', () => {
    if (!idef5Editor) return;
    const json = idef5Editor.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef5_ontology_model.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnIdef5ImportJson')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && idef5Editor) {
        const text = await file.text();
        idef5Editor.importJSON(text);
      }
    };
    input.click();
  });

  // ----------------------------------------
  // IDEF4 Toolbar Handlers
  // ----------------------------------------
  document.getElementById('btnIdef4AutoLayout')?.addEventListener('click', () => {
    idef4Editor?.autoLayout();
  });

  document.getElementById('btnIdef4ZoomFit')?.addEventListener('click', () => {
    idef4Editor?.zoomToFit();
  });

  document.getElementById('btnAddIdef4Class')?.addEventListener('click', () => {
    if (!idef4Editor) return;
    const name = prompt('Введите имя класса:', 'QualityInspector');
    if (!name) return;
    idef4Editor.addClass({
      name,
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      attributes: [{ name: 'id', dataType: 'string', visibility: 'private' }],
      methods: [{ name: 'inspectBatch', returnType: 'boolean', visibility: 'public', parameters: [] }],
    });
  });

  document.getElementById('btnValidateIdef4')?.addEventListener('click', () => {
    if (!idef4Editor) return;
    const issues = idef4Editor.validate();
    if (issues.length === 0) {
      alert('✓ Объектная модель полностью соответствует стандарту IDEF4!\n\n- Граф наследования ацикличен\n- Абстрактные методы корректно объявлены\n- Имена классов уникальны');
    } else {
      const msg = issues.map((i) => `[${i.severity}] ${i.code}: ${i.message}`).join('\n\n');
      alert(`Результаты проверки IDEF4:\n\n${msg}`);
    }
  });

  document.getElementById('btnIdef4ExportJson')?.addEventListener('click', () => {
    if (!idef4Editor) return;
    const json = idef4Editor.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef4_class_model.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnIdef4ImportJson')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && idef4Editor) {
        const text = await file.text();
        idef4Editor.importJSON(text);
      }
    };
    input.click();
  });

  // ----------------------------------------
  // IDEF3 Toolbar Handlers
  // ----------------------------------------
  document.getElementById('selectIdef3Diagram')?.addEventListener('change', (e: any) => {
    if (!idef3Editor) return;
    idef3Editor.setActiveDiagram(e.target.value);
  });

  document.getElementById('btnIdef3DrillUp')?.addEventListener('click', () => {
    if (!idef3Editor) return;
    const ok = idef3Editor.drillUp();
    if (!ok) {
      alert('Вы уже находитесь на корневом сценарии процесса.');
    }
  });

  document.getElementById('btnIdef3AutoLayout')?.addEventListener('click', () => {
    idef3Editor?.autoLayout();
  });

  document.getElementById('btnIdef3ZoomFit')?.addEventListener('click', () => {
    idef3Editor?.zoomToFit();
  });

  document.getElementById('btnValidateIdef3')?.addEventListener('click', () => {
    if (!idef3Editor) return;
    const issues = idef3Editor.validate();
    if (issues.length === 0) {
      alert('✓ Процессная схема полностью корректна по стандарту IDEF3!\n\n- Логика перекрестков (&, X) сбалансирована\n- Все действия (UOB) имеют корректные наименования\n- Отсутствуют некорректные изолированные элементы');
    } else {
      const msg = issues.map((i) => `[${i.severity}] ${i.code}: ${i.message}`).join('\n\n');
      alert(`Результаты проверки IDEF3:\n\n${msg}`);
    }
  });

  document.getElementById('btnIdef3ExportJson')?.addEventListener('click', () => {
    if (!idef3Editor) return;
    const json = idef3Editor.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef3_process_model.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnIdef3ImportJson')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && idef3Editor) {
        const text = await file.text();
        idef3Editor.importJSON(text);
      }
    };
    input.click();
  });

  // ----------------------------------------
  // IDEF0 Toolbar Handlers
  // ----------------------------------------
  document.getElementById('selectIdef0Diagram')?.addEventListener('change', (e: any) => {
    if (!idef0Editor) return;
    idef0Editor.setActiveDiagram(e.target.value);
  });

  document.getElementById('btnDrillUp')?.addEventListener('click', () => {
    if (!idef0Editor) return;
    const ok = idef0Editor.drillUp();
    if (!ok) {
      alert('Вы уже находитесь на контекстной диаграмме верхнего уровня A-0.');
    }
  });

  document.getElementById('btnIdef0AutoLayout')?.addEventListener('click', () => {
    idef0Editor?.autoLayout();
  });

  document.getElementById('btnIdef0ZoomFit')?.addEventListener('click', () => {
    idef0Editor?.zoomToFit();
  });

  document.getElementById('btnValidateIdef0')?.addEventListener('click', () => {
    if (!idef0Editor) return;
    const issues = idef0Editor.validate();
    if (issues.length === 0) {
      alert('✓ Диаграмма полностью соответствует стандарту FIPS PUB 183!\n\n- Количество блоков от 3 до 6\n- Все функции имеют Управление (Control) и Выход (Output)\n- Стрелки имеют корректные имена (существительные)');
    } else {
      const msg = issues.map((i) => `[${i.severity}] ${i.code}: ${i.message}`).join('\n\n');
      alert(`Результаты проверки FIPS 183:\n\n${msg}`);
    }
  });

  document.getElementById('btnIdef0ExportJson')?.addEventListener('click', () => {
    if (!idef0Editor) return;
    const json = idef0Editor.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef0_functional_model.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnIdef0ImportJson')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && idef0Editor) {
        const text = await file.text();
        idef0Editor.importJSON(text);
      }
    };
    input.click();
  });

  // ----------------------------------------
  // IDEF1X Toolbar Handlers
  // ----------------------------------------
  document.getElementById('selectModel')?.addEventListener('change', async (e: any) => {
    await setupIDEF1(e.target.value);
  });

  document.getElementById('selectViewLevel')?.addEventListener('change', (e: any) => {
    idef1Editor?.setViewLevel(e.target.value);
  });

  document.getElementById('btnAutoLayout')?.addEventListener('click', () => {
    idef1Editor?.autoLayout({ direction: 0 });
  });

  document.getElementById('btnZoomFit')?.addEventListener('click', () => {
    idef1Editor?.zoomToFit();
  });

  document.getElementById('btnAddEntity')?.addEventListener('click', async () => {
    if (!idef1Editor) return;
    const name = prompt('Введите имя сущности (Entity Name):', 'ДОГОВОР');
    if (!name) return;
    await idef1Editor.addEntity(name.toUpperCase(), {
      position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
      primaryKeys: [{ name: `код_${name.toLowerCase()}`, dataType: 'INTEGER' }],
      nonKeys: [{ name: 'описание', dataType: 'VARCHAR(150)' }],
    });
  });

  document.getElementById('btnExportJson')?.addEventListener('click', () => {
    if (!idef1Editor) return;
    const json = idef1Editor.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef1_erp_model.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnExportSvg')?.addEventListener('click', () => {
    if (!idef1Editor) return;
    const svg = idef1Editor.exportSvg();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef1_diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnImportJson')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && idef1Editor) {
        const text = await file.text();
        await idef1Editor.importJson(text);
      }
    };
    input.click();
  });

  // ----------------------------------------
  // IDEF9 Toolbar Handlers
  // ----------------------------------------
  document.getElementById('btnIdef9AutoLayout')?.addEventListener('click', () => {
    idef9Editor?.autoLayout();
  });

  document.getElementById('btnIdef9ZoomFit')?.addEventListener('click', () => {
    idef9Editor?.zoomToFit();
  });

  document.getElementById('btnAddIdef9Constraint')?.addEventListener('click', () => {
    if (!idef9Editor) return;
    const code = prompt('Введите код ограничения (например, CR-05):', 'CR-05');
    if (!code) return;
    const name = prompt('Введите наименование ограничения:', 'Давление в гидравлической магистрали');
    if (!name) return;
    idef9Editor.addConstraint({
      code,
      name,
      statement: 'Введите формулировку ограничения',
      constraintType: ConstraintType.TECHNICAL,
      severity: ConstraintSeverity.MANDATORY,
      x: 300 + Math.random() * 200,
      y: 100 + Math.random() * 300,
    });
  });

  document.getElementById('btnAddIdef9Object')?.addEventListener('click', () => {
    if (!idef9Editor) return;
    const name = prompt('Введите наименование объекта (процесс/изделие/оборудование):', 'Гидропривод ЦЗС-1');
    if (!name) return;
    idef9Editor.addControlledObject({
      name,
      objectType: ControlledObjectType.EQUIPMENT,
      x: 600 + Math.random() * 200,
      y: 100 + Math.random() * 300,
    });
  });

  document.getElementById('btnAddIdef9Mechanism')?.addEventListener('click', () => {
    if (!idef9Editor) return;
    const name = prompt('Введите наименование механизма исполнения:', 'Клапан-ограничитель давления КОД-10');
    if (!name) return;
    idef9Editor.addEnforcementMechanism({
      name,
      mechanismType: MechanismType.AUTOMATED_PLC,
      x: 900 + Math.random() * 200,
      y: 100 + Math.random() * 300,
    });
  });

  document.getElementById('btnAddIdef9Document')?.addEventListener('click', () => {
    if (!idef9Editor) return;
    const code = prompt('Введите код документа (например, ГОСТ 12.1.003):', 'ГОСТ 12.1.003');
    if (!code) return;
    const name = prompt('Введите наименование документа:', 'ГОСТ 12.1.003-2014 — Шум. Общие требования безопасности');
    if (!name) return;
    idef9Editor.addSourceDocument({
      code,
      name,
      documentType: DocumentType.STATE_STANDARD,
      x: 50 + Math.random() * 100,
      y: 100 + Math.random() * 400,
    });
  });

  document.getElementById('btnValidateIdef9')?.addEventListener('click', () => {
    if (!idef9Editor) return;
    const issues = idef9Editor.validate();
    if (issues.length === 0) {
      alert('✓ Все бизнес-правила и ограничения корректно оформлены по стандарту IDEF9!\n\n- Обязательные ограничения имеют механизмы принуждения\n- Все ограничения привязаны к объектам\n- Дублирование кодов отсутствует\n- Конфликтующие ограничения не обнаружены');
    } else {
      const msg = issues.map((i) => `[${i.severity}] ${i.code}: ${i.message}`).join('\n\n');
      alert(`Результаты проверки IDEF9:\n\n${msg}`);
    }
  });

  document.getElementById('btnIdef9ExportJson')?.addEventListener('click', () => {
    if (!idef9Editor) return;
    const json = idef9Editor.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef9_business_rules.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnIdef9ImportJson')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && idef9Editor) {
        const text = await file.text();
        idef9Editor.importJSON(text);
      }
    };
    input.click();
  });

  // ----------------------------------------
  // IDEF10 Toolbar Handlers
  // ----------------------------------------
  document.getElementById('btnIdef10AutoLayout')?.addEventListener('click', () => {
    idef10Editor?.autoLayout();
  });

  document.getElementById('btnIdef10ZoomFit')?.addEventListener('click', () => {
    idef10Editor?.zoomToFit();
  });

  document.getElementById('btnAddIdef10Component')?.addEventListener('click', () => {
    if (!idef10Editor) return;
    const code = prompt('Введите код компонента (например, CMP-API-01):', 'CMP-API-01');
    if (!code) return;
    const name = prompt('Введите наименование компонента:', 'Шлюз внешней интеграции ERP');
    if (!name) return;
    idef10Editor.addComponent({
      code,
      name,
      techStack: 'Node.js / Express / TypeScript',
      componentType: ComponentType.SERVICE,
      lifecycle: ComponentLifecycle.ACTIVE,
      x: 350 + Math.random() * 200,
      y: 100 + Math.random() * 300,
    });
  });

  document.getElementById('btnAddIdef10Node')?.addEventListener('click', () => {
    if (!idef10Editor) return;
    const code = prompt('Введите код узла (например, NODE-EDGE-02):', 'NODE-EDGE-02');
    if (!code) return;
    const name = prompt('Введите наименование сервера/узла:', 'Цеховой сервер сбора данных');
    if (!name) return;
    idef10Editor.addExecutionNode({
      code,
      name,
      nodeType: NodeType.EDGE_CONTROLLER,
      ipAddress: '192.168.20.10',
      osPlatform: 'Ubuntu Core RT',
      x: 700 + Math.random() * 200,
      y: 100 + Math.random() * 300,
    });
  });

  document.getElementById('btnAddIdef10Interface')?.addEventListener('click', () => {
    if (!idef10Editor) return;
    const name = prompt('Введите наименование интерфейса / порта:', 'Kafka Topic: plant.events');
    if (!name) return;
    idef10Editor.addInterface({
      name,
      protocol: InterfaceProtocol.MQTT_KAFKA,
      portNumber: 9092,
      x: 350 + Math.random() * 200,
      y: 350 + Math.random() * 200,
    });
  });

  document.getElementById('btnAddIdef10Artifact')?.addEventListener('click', () => {
    if (!idef10Editor) return;
    const name = prompt('Введите наименование артефакта сборки:', 'gateway-service.tar.gz');
    if (!name) return;
    idef10Editor.addArtifact({
      name,
      artifactType: ArtifactType.DOCKER_IMAGE,
      repositoryUrl: 'registry.avia/gateway:v1.0.0',
      x: 1000 + Math.random() * 150,
      y: 300 + Math.random() * 200,
    });
  });

  document.getElementById('btnValidateIdef10')?.addEventListener('click', () => {
    if (!idef10Editor) return;
    const issues = idef10Editor.validate();
    if (issues.length === 0) {
      alert('✓ Архитектура реализации полностью соответствует стандарту IDEF10!\n\n- Все действующие сервисы и БД привязаны к узлам исполнения (DEPLOYS_ON)\n- Отсутствуют изолированные компоненты\n- Коды компонентов уникальны\n- Интерфейсы экспортируются поставщиками');
    } else {
      const msg = issues.map((i) => `[${i.severity}] ${i.code}: ${i.message}`).join('\n\n');
      alert(`Результаты проверки IDEF10:\n\n${msg}`);
    }
  });

  document.getElementById('btnIdef10ExportJson')?.addEventListener('click', () => {
    if (!idef10Editor) return;
    const json = idef10Editor.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef10_implementation_architecture.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnIdef10ImportJson')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && idef10Editor) {
        const text = await file.text();
        idef10Editor.importJSON(text);
      }
    };
    input.click();
  });

  // Initial startup — IDEF10 is the newest and active tab
  setupIDEF10();
});
