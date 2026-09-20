import { IDEF1Editor } from './src/index';
import { RelationshipType, Cardinality } from './src/domain/models/Relationship';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('diagramDiv');
  if (!container) return;

  // Initialize IDEF1 Editor Facade (driving port / inbound adapter)
  const editor = new IDEF1Editor({
    container,
    modelName: 'Enterprise IDEF1X Data Model',
    diagramOptions: {
      gridVisible: true,
    },
  });

  // Populate sample IDEF1X information model
  // 1. Independent Entity: DEPARTMENT (Square corners)
  const deptId = await editor.addEntity('DEPARTMENT', {
    isDependent: false,
    position: { x: 80, y: 80 },
    primaryKeys: [{ name: 'dept_no', dataType: 'CHAR(4)' }],
    nonKeys: [
      { name: 'dept_name', dataType: 'VARCHAR(40)' },
      { name: 'budget', dataType: 'DECIMAL(12,2)' },
    ],
  });

  // 2. Dependent Entity: EMPLOYEE (Dependent on Department, rounded corners)
  const empId = await editor.addEntity('EMPLOYEE', {
    isDependent: false,
    position: { x: 380, y: 80 },
    primaryKeys: [{ name: 'emp_no', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'first_name', dataType: 'VARCHAR(30)' },
      { name: 'last_name', dataType: 'VARCHAR(30)' },
      { name: 'hire_date', dataType: 'DATE' },
    ],
  });

  // 3. Dependent Entity: PROJECT_ASSIGNMENT (Identifying relationship with Employee)
  const projAssignId = await editor.addEntity('PROJECT_ASSIGNMENT', {
    isDependent: true,
    position: { x: 380, y: 320 },
    primaryKeys: [{ name: 'assignment_id', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'role', dataType: 'VARCHAR(50)' },
      { name: 'hours_allocated', dataType: 'DECIMAL(5,2)' },
    ],
  });

  // 4. Subtypes: FULL_TIME_EMPLOYEE and PART_TIME_EMPLOYEE
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

  // Add Non-Identifying Relationship (dashed line) from DEPARTMENT to EMPLOYEE
  await editor.addRelationship(deptId, empId, {
    name: 'employs',
    type: RelationshipType.NON_IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
    isOptional: false,
  });

  // Add Identifying Relationship (solid line) from EMPLOYEE to PROJECT_ASSIGNMENT
  await editor.addRelationship(empId, projAssignId, {
    name: 'works on',
    type: RelationshipType.IDENTIFYING,
    cardinality: Cardinality.ONE_OR_MORE, // Dot with 'P'
  });

  // Add Categorization Cluster (Subtype circle)
  await editor.addCategorization(empId, 'emp_type', [ftId, ptId], true);

  // Wire UI action buttons
  const entityCountEl = document.getElementById('entityCount');
  const relCountEl = document.getElementById('relCount');
  const updateStats = () => {
    const model = editor.getModel();
    if (entityCountEl) entityCountEl.textContent = `${model.entities.length}`;
    if (relCountEl) relCountEl.textContent = `${model.relationships.length}`;
  };
  updateStats();

  // Listen to domain events
  editor.onEvent('EntityCreated', () => updateStats());
  editor.onEvent('EntityRemoved', () => updateStats());
  editor.onEvent('RelationshipAdded', () => updateStats());
  editor.onEvent('RelationshipRemoved', () => updateStats());

  document.getElementById('btnAddEntity')?.addEventListener('click', async () => {
    const name = prompt('Enter Entity Name:', 'CUSTOMER');
    if (!name) return;
    await editor.addEntity(name.toUpperCase(), {
      position: { x: 150 + Math.random() * 200, y: 200 + Math.random() * 200 },
      primaryKeys: [{ name: `${name.toLowerCase()}_id`, dataType: 'INTEGER' }],
      nonKeys: [{ name: 'description', dataType: 'VARCHAR(100)' }],
    });
  });

  document.getElementById('btnExportJson')?.addEventListener('click', () => {
    const json = editor.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'idef1_model.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnExportSvg')?.addEventListener('click', () => {
    const svg = editor.exportSvg();
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
      if (file) {
        const text = await file.text();
        await editor.importJson(text);
        updateStats();
      }
    };
    input.click();
  });
});
