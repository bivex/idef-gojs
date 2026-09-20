import {
  IDEF1Editor,
  RelationshipType,
  Cardinality,
  IDEF0Editor,
  IDEF3Editor,
  IDEF4Editor,
  IDEF5Editor,
  IDEF6Editor,
  IssueStatus,
  AlternativeStatus,
  CriterionType,
  CriterionWeight,
  ArgumentType,
  ArgumentStrength,
  RationaleLinkType,
} from '../src/index';
import { loadRussianEnterpriseModel } from './russian_enterprise_model';
import { createRussianEnterpriseIDEF0Model } from './russian_enterprise_idef0';
import { createRussianEnterpriseIDEF3Model } from './russian_enterprise_idef3';
import { createRussianEnterpriseIDEF4Model } from './russian_enterprise_idef4';
import { loadRussianEnterpriseIDEF5Demo } from './russian_enterprise_idef5';
import { loadRussianEnterpriseIDEF6Demo } from './russian_enterprise_idef6';

let idef1Editor: IDEF1Editor | null = null;
let idef0Editor: IDEF0Editor | null = null;
let idef3Editor: IDEF3Editor | null = null;
let idef4Editor: IDEF4Editor | null = null;
let idef5Editor: IDEF5Editor | null = null;
let idef6Editor: IDEF6Editor | null = null;
let activeMode: 'idef6' | 'idef5' | 'idef4' | 'idef3' | 'idef0' | 'idef1' = 'idef6';

function destroyAllEditors() {
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
function switchMode(mode: 'idef6' | 'idef5' | 'idef4' | 'idef3' | 'idef0' | 'idef1') {
  activeMode = mode;
  const tabIdef6 = document.getElementById('tabIdef6');
  const tabIdef5 = document.getElementById('tabIdef5');
  const tabIdef4 = document.getElementById('tabIdef4');
  const tabIdef3 = document.getElementById('tabIdef3');
  const tabIdef0 = document.getElementById('tabIdef0');
  const tabIdef1 = document.getElementById('tabIdef1');

  const tbIdef6 = document.getElementById('toolbarIdef6');
  const tbIdef5 = document.getElementById('toolbarIdef5');
  const tbIdef4 = document.getElementById('toolbarIdef4');
  const tbIdef3 = document.getElementById('toolbarIdef3');
  const tbIdef0 = document.getElementById('toolbarIdef0');
  const tbIdef1 = document.getElementById('toolbarIdef1');

  const sbIdef6 = document.getElementById('sidebarIdef6');
  const sbIdef5 = document.getElementById('sidebarIdef5');
  const sbIdef4 = document.getElementById('sidebarIdef4');
  const sbIdef3 = document.getElementById('sidebarIdef3');
  const sbIdef0 = document.getElementById('sidebarIdef0');
  const sbIdef1 = document.getElementById('sidebarIdef1');

  // Reset tabs
  tabIdef6?.classList.remove('active');
  tabIdef5?.classList.remove('active');
  tabIdef4?.classList.remove('active');
  tabIdef3?.classList.remove('active');
  tabIdef0?.classList.remove('active');
  tabIdef1?.classList.remove('active');

  // Hide toolbars
  if (tbIdef6) tbIdef6.style.display = 'none';
  if (tbIdef5) tbIdef5.style.display = 'none';
  if (tbIdef4) tbIdef4.style.display = 'none';
  if (tbIdef3) tbIdef3.style.display = 'none';
  if (tbIdef0) tbIdef0.style.display = 'none';
  if (tbIdef1) tbIdef1.style.display = 'none';

  // Hide sidebars
  if (sbIdef6) sbIdef6.style.display = 'none';
  if (sbIdef5) sbIdef5.style.display = 'none';
  if (sbIdef4) sbIdef4.style.display = 'none';
  if (sbIdef3) sbIdef3.style.display = 'none';
  if (sbIdef0) sbIdef0.style.display = 'none';
  if (sbIdef1) sbIdef1.style.display = 'none';

  if (mode === 'idef6') {
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
  document.getElementById('tabIdef6')?.addEventListener('click', () => switchMode('idef6'));
  document.getElementById('tabIdef5')?.addEventListener('click', () => switchMode('idef5'));
  document.getElementById('tabIdef4')?.addEventListener('click', () => switchMode('idef4'));
  document.getElementById('tabIdef3')?.addEventListener('click', () => switchMode('idef3'));
  document.getElementById('tabIdef0')?.addEventListener('click', () => switchMode('idef0'));
  document.getElementById('tabIdef1')?.addEventListener('click', () => switchMode('idef1'));

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

  // Initial startup with IDEF6 mode
  setupIDEF6();
});

