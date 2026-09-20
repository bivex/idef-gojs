import {
  IDEF1Editor,
  RelationshipType,
  Cardinality,
  IDEF0Editor,
} from '../src/index';
import { loadRussianEnterpriseModel } from './russian_enterprise_model';
import { createRussianEnterpriseIDEF0Model } from './russian_enterprise_idef0';

let idef1Editor: IDEF1Editor | null = null;
let idef0Editor: IDEF0Editor | null = null;
let activeMode: 'idef0' | 'idef1' = 'idef0';

// ==========================================
// IDEF0 Setup
// ==========================================
function setupIDEF0() {
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  if (idef1Editor) {
    idef1Editor.destroy();
    idef1Editor = null;
  }
  if (idef0Editor) {
    idef0Editor.destroy();
    idef0Editor = null;
  }

  container.innerHTML = '';
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
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  if (idef0Editor) {
    idef0Editor.destroy();
    idef0Editor = null;
  }
  if (idef1Editor) {
    idef1Editor.destroy();
    idef1Editor = null;
  }

  container.innerHTML = '';
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
function switchMode(mode: 'idef0' | 'idef1') {
  activeMode = mode;
  const tabIdef0 = document.getElementById('tabIdef0');
  const tabIdef1 = document.getElementById('tabIdef1');
  const tbIdef0 = document.getElementById('toolbarIdef0');
  const tbIdef1 = document.getElementById('toolbarIdef1');
  const sbIdef0 = document.getElementById('sidebarIdef0');
  const sbIdef1 = document.getElementById('sidebarIdef1');

  if (mode === 'idef0') {
    tabIdef0?.classList.add('active');
    tabIdef1?.classList.remove('active');
    if (tbIdef0) tbIdef0.style.display = 'flex';
    if (tbIdef1) tbIdef1.style.display = 'none';
    if (sbIdef0) sbIdef0.style.display = 'flex';
    if (sbIdef1) sbIdef1.style.display = 'none';
    setupIDEF0();
  } else {
    tabIdef1?.classList.add('active');
    tabIdef0?.classList.remove('active');
    if (tbIdef1) tbIdef1.style.display = 'flex';
    if (tbIdef0) tbIdef0.style.display = 'none';
    if (sbIdef1) sbIdef1.style.display = 'flex';
    if (sbIdef0) sbIdef0.style.display = 'none';
    setupIDEF1('ru');
  }
}

// ==========================================
// DOM Event Listeners
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  document.getElementById('tabIdef0')?.addEventListener('click', () => switchMode('idef0'));
  document.getElementById('tabIdef1')?.addEventListener('click', () => switchMode('idef1'));

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
      const msg = issues
        .map((i) => `[${i.severity}] ${i.code}: ${i.message}`)
        .join('\n\n');
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

  // Initial startup with IDEF0 mode
  setupIDEF0();
});
