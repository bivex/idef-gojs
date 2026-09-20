import { IDEF1Editor, RelationshipType, Cardinality } from '../src/index';
import { loadRussianEnterpriseModel } from './russian_enterprise_model';

let currentEditor: IDEF1Editor | null = null;

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

async function setupEditor(modelType: 'ru' | 'en' = 'ru') {
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  if (currentEditor) {
    currentEditor.destroy();
  }

  const modelName =
    modelType === 'ru'
      ? 'Информационная модель ERP-системы предприятия (IDEF1X)'
      : 'Enterprise IDEF1X Data Model';

  currentEditor = new IDEF1Editor({
    container,
    modelName,
    diagramOptions: {
      gridVisible: true,
    },
  });

  if (modelType === 'ru') {
    await loadRussianEnterpriseModel(currentEditor);
  } else {
    await loadDefaultEnglishModel(currentEditor);
  }

  const entityCountEl = document.getElementById('entityCount');
  const relCountEl = document.getElementById('relCount');
  const updateStats = () => {
    if (!currentEditor) return;
    const model = currentEditor.getModel();
    if (entityCountEl) entityCountEl.textContent = `${model.entities.length}`;
    if (relCountEl) relCountEl.textContent = `${model.relationships.length}`;
  };
  updateStats();

  currentEditor.onEvent('EntityCreated', () => updateStats());
  currentEditor.onEvent('EntityRemoved', () => updateStats());
  currentEditor.onEvent('RelationshipAdded', () => updateStats());
  currentEditor.onEvent('RelationshipRemoved', () => updateStats());

  // Restore current view level selection
  const viewLevelSelect = document.getElementById('selectViewLevel') as HTMLSelectElement;
  if (viewLevelSelect) {
    currentEditor.setViewLevel(viewLevelSelect.value as any);
  }

  // Auto Layout after mount
  setTimeout(() => {
    currentEditor?.autoLayout({ direction: 0 });
  }, 80);
}

document.addEventListener('DOMContentLoaded', async () => {
  await setupEditor('ru');

  document.getElementById('selectModel')?.addEventListener('change', async (e: any) => {
    await setupEditor(e.target.value);
  });

  document.getElementById('selectViewLevel')?.addEventListener('change', (e: any) => {
    currentEditor?.setViewLevel(e.target.value);
  });

  document.getElementById('btnAutoLayout')?.addEventListener('click', () => {
    currentEditor?.autoLayout({ direction: 0 });
  });

  document.getElementById('btnZoomFit')?.addEventListener('click', () => {
    currentEditor?.zoomToFit();
  });

  document.getElementById('btnAddEntity')?.addEventListener('click', async () => {
    if (!currentEditor) return;
    const name = prompt('Введите имя сущности (Entity Name):', 'ДОГОВОР');
    if (!name) return;
    await currentEditor.addEntity(name.toUpperCase(), {
      position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
      primaryKeys: [{ name: `код_${name.toLowerCase()}`, dataType: 'INTEGER' }],
      nonKeys: [{ name: 'описание', dataType: 'VARCHAR(150)' }],
    });
  });

  document.getElementById('btnExportJson')?.addEventListener('click', () => {
    if (!currentEditor) return;
    const json = currentEditor.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef1_erp_model.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnExportSvg')?.addEventListener('click', () => {
    if (!currentEditor) return;
    const svg = currentEditor.exportSvg();
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
      if (file && currentEditor) {
        const text = await file.text();
        await currentEditor.importJson(text);
      }
    };
    input.click();
  });
});
