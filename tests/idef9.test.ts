import { describe, it, expect } from 'bun:test';
import {
  IDEF9Constraint,
  ConstraintType,
  ConstraintSeverity,
  ConstraintStatus,
} from '../src/idef9/domain/models/IDEF9Constraint';
import { IDEF9ControlledObject, ControlledObjectType } from '../src/idef9/domain/models/IDEF9ControlledObject';
import { IDEF9EnforcementMechanism, MechanismType } from '../src/idef9/domain/models/IDEF9EnforcementMechanism';
import { IDEF9SourceDocument, DocumentType } from '../src/idef9/domain/models/IDEF9SourceDocument';
import { IDEF9Link, ConstraintLinkType } from '../src/idef9/domain/models/IDEF9Link';
import { IDEF9Diagram } from '../src/idef9/domain/models/IDEF9Diagram';
import { IDEF9Model } from '../src/idef9/domain/models/IDEF9Model';
import { IDEF9Rules } from '../src/idef9/domain/rules/IDEF9Rules';
import { IDEF9Editor } from '../src/idef9/infrastructure/adapters/inbound/IDEF9Editor';

describe('IDEF9 Business Rules & Constraints Capture Method (KBSI)', () => {
  it('should create Constraint, ControlledObject, EnforcementMechanism, and SourceDocument', () => {
    const constraint = new IDEF9Constraint({
      id: 'cr-01',
      code: 'CR-01',
      name: 'Температурный режим закалки',
      statement: 'T_закалки ∈ [1050°C, 1080°C]',
      constraintType: ConstraintType.TECHNICAL,
      severity: ConstraintSeverity.MANDATORY,
      status: ConstraintStatus.ACTIVE,
    });

    expect(constraint.id).toBe('cr-01');
    expect(constraint.code).toBe('CR-01');
    expect(constraint.constraintType).toBe(ConstraintType.TECHNICAL);
    expect(constraint.severity).toBe(ConstraintSeverity.MANDATORY);
    expect(constraint.status).toBe(ConstraintStatus.ACTIVE);

    const obj = new IDEF9ControlledObject({
      id: 'obj-01',
      name: 'Термообработка — Закалка лопатки',
      objectType: ControlledObjectType.PROCESS,
      description: 'МЭО ТМОП-6: Электровакуумная печь ПАП-6',
    });
    expect(obj.objectType).toBe(ControlledObjectType.PROCESS);

    const mech = new IDEF9EnforcementMechanism({
      id: 'mech-01',
      name: 'ПЛК Siemens S7-1500 — блокировка нагрева',
      mechanismType: MechanismType.AUTOMATED_PLC,
    });
    expect(mech.mechanismType).toBe(MechanismType.AUTOMATED_PLC);

    const doc = new IDEF9SourceDocument({
      id: 'doc-01',
      code: 'ГОСТ Р 55892',
      name: 'ГОСТ Р 55892-2013 — Термообработка никелевых сплавов',
      documentType: DocumentType.STATE_STANDARD,
    });
    expect(doc.code).toBe('ГОСТ Р 55892');
    expect(doc.documentType).toBe(DocumentType.STATE_STANDARD);
  });

  it('should handle constraint links in a diagram', () => {
    const constraint = new IDEF9Constraint({
      id: 'cr-02',
      code: 'CR-02',
      name: 'Износ режущего инструмента',
      statement: 'VB ≤ 0.3 мм',
    });

    const obj = new IDEF9ControlledObject({
      id: 'obj-02',
      name: 'Лопатка турбины ГТД',
      objectType: ControlledObjectType.PRODUCT,
    });

    const mech = new IDEF9EnforcementMechanism({
      id: 'mech-02',
      name: 'MES Opcenter — автостоп шпинделя',
      mechanismType: MechanismType.SOFTWARE_RULE,
    });

    const doc = new IDEF9SourceDocument({
      id: 'doc-02',
      code: 'СТП-МА-004',
      name: 'СТП-МА-004 — Управление инструментом',
      documentType: DocumentType.FACTORY_POLICY,
    });

    const diag = new IDEF9Diagram({ id: 'diag-01', name: 'Ограничения ЧПУ' });
    diag.addConstraint(constraint);
    diag.addControlledObject(obj);
    diag.addEnforcementMechanism(mech);
    diag.addSourceDocument(doc);

    const linkConstrains = new IDEF9Link({
      id: 'l-1',
      sourceId: constraint.id,
      targetId: obj.id,
      type: ConstraintLinkType.CONSTRAINS,
    });
    const linkEnforced = new IDEF9Link({
      id: 'l-2',
      sourceId: constraint.id,
      targetId: mech.id,
      type: ConstraintLinkType.ENFORCED_BY,
    });
    const linkDerived = new IDEF9Link({
      id: 'l-3',
      sourceId: constraint.id,
      targetId: doc.id,
      type: ConstraintLinkType.DERIVED_FROM,
    });

    diag.addLink(linkConstrains);
    diag.addLink(linkEnforced);
    diag.addLink(linkDerived);

    expect(diag.links.length).toBe(3);
    expect(diag.hasElement(constraint.id)).toBe(true);
    expect(diag.hasElement(obj.id)).toBe(true);

    // Remove controlled object → dangling links cleaned up
    diag.removeControlledObject(obj.id);
    expect(diag.links.length).toBe(2); // l-1 removed, l-2 and l-3 remain
  });

  it('should validate: mandatory constraint without enforcement mechanism', () => {
    const mandatoryC = new IDEF9Constraint({
      id: 'cr-m',
      code: 'CR-M',
      name: 'Грузоподъёмность крана без механизма',
      statement: 'Q ≤ 0.85 × Q_nom',
      severity: ConstraintSeverity.MANDATORY,
    });

    const obj = new IDEF9ControlledObject({
      id: 'obj-crane',
      name: 'Мостовой кран КМ-5',
      objectType: ControlledObjectType.EQUIPMENT,
    });

    const diag = new IDEF9Diagram({ id: 'diag-v1', name: 'Валидация' });
    diag.addConstraint(mandatoryC);
    diag.addControlledObject(obj);
    diag.addLink(new IDEF9Link({
      id: 'lnk-v1',
      sourceId: mandatoryC.id,
      targetId: obj.id,
      type: ConstraintLinkType.CONSTRAINS,
    }));

    const issues = IDEF9Rules.validate(diag);
    expect(issues.some((i) => i.code === 'IDEF9_MANDATORY_WITHOUT_ENFORCEMENT')).toBe(true);
    expect(issues.some((i) => i.code === 'IDEF9_UNATTACHED_CONSTRAINT')).toBe(false); // CR-M is attached
  });

  it('should validate: unattached constraint and duplicate code', () => {
    const c1 = new IDEF9Constraint({
      id: 'cr-d1',
      code: 'CR-DUP',
      name: 'Ограничение A',
      statement: 'Ограничение A',
      severity: ConstraintSeverity.WARNING,
    });
    const c2 = new IDEF9Constraint({
      id: 'cr-d2',
      code: 'CR-DUP', // Duplicate code
      name: 'Ограничение B (дубль)',
      statement: 'Ограничение B',
      severity: ConstraintSeverity.WARNING,
    });

    const diag = new IDEF9Diagram({ id: 'diag-dup', name: 'Проверка дублей' });
    diag.addConstraint(c1);
    diag.addConstraint(c2);

    const issues = IDEF9Rules.validate(diag);
    expect(issues.some((i) => i.code === 'IDEF9_DUPLICATE_CONSTRAINT_CODE')).toBe(true);
    expect(issues.some((i) => i.code === 'IDEF9_UNATTACHED_CONSTRAINT')).toBe(true);
  });

  it('should serialize and deserialize IDEF9 model to/from JSON', () => {
    const model = new IDEF9Model({
      id: 'model-test-01',
      name: 'Тестовая модель ограничений',
      version: '1.0.0',
    });

    const diag = model.activeDiagram;
    diag.addConstraint(
      new IDEF9Constraint({
        id: 'cr-ser-01',
        code: 'CR-SER',
        name: 'Ограничение для сериализации',
        statement: 'T ≤ 200°C',
        constraintType: ConstraintType.REGULATORY,
        severity: ConstraintSeverity.CONDITIONAL,
      })
    );
    diag.addSourceDocument(
      new IDEF9SourceDocument({
        id: 'doc-ser-01',
        code: 'ГОСТ 12.0.001',
        name: 'ГОСТ 12.0.001-2013 — ССБТ',
        documentType: DocumentType.STATE_STANDARD,
      })
    );

    const json = JSON.stringify(model.toJSON());
    const restored = IDEF9Model.fromJSON(JSON.parse(json));

    expect(restored.id).toBe('model-test-01');
    expect(restored.name).toBe('Тестовая модель ограничений');
    expect(restored.version).toBe('1.0.0');
    expect(restored.activeDiagram.constraints.length).toBe(1);
    expect(restored.activeDiagram.constraints[0].code).toBe('CR-SER');
    expect(restored.activeDiagram.sourceDocuments.length).toBe(1);
  });

  it('should manage elements via IDEF9Editor facade', () => {
    const editor = new IDEF9Editor();
    editor.createModel('facade-test', 'Тест фасада IDEF9');

    const constraint = editor.addConstraint({
      code: 'CR-F1',
      name: 'Тест ограничения',
      statement: 'P ≤ 6 МПа',
      constraintType: ConstraintType.TECHNICAL,
      severity: ConstraintSeverity.MANDATORY,
    });
    expect(constraint.code).toBe('CR-F1');
    expect(constraint.severity).toBe(ConstraintSeverity.MANDATORY);

    const obj = editor.addControlledObject({
      name: 'Паровая турбина ЦВД',
      objectType: ControlledObjectType.EQUIPMENT,
    });
    expect(obj.name).toBe('Паровая турбина ЦВД');

    const mech = editor.addEnforcementMechanism({
      name: 'Предохранительный клапан ПК-1',
      mechanismType: MechanismType.AUTOMATED_PLC,
    });
    expect(mech.mechanismType).toBe(MechanismType.AUTOMATED_PLC);

    const doc = editor.addSourceDocument({
      code: 'ПБ 10-574',
      name: 'ПБ 10-574-03 — Правила устройства паровых котлов',
      documentType: DocumentType.LAW_REGULATION,
    });
    expect(doc.documentType).toBe(DocumentType.LAW_REGULATION);

    const link1 = editor.addLink({
      sourceId: constraint.id,
      targetId: obj.id,
      type: ConstraintLinkType.CONSTRAINS,
    });
    const link2 = editor.addLink({
      sourceId: constraint.id,
      targetId: mech.id,
      type: ConstraintLinkType.ENFORCED_BY,
    });
    const link3 = editor.addLink({
      sourceId: constraint.id,
      targetId: doc.id,
      type: ConstraintLinkType.DERIVED_FROM,
      label: 'Ст. 12.3',
    });
    expect(link3.label).toBe('Ст. 12.3');

    const diag = editor.getActiveDiagram();
    expect(diag.constraints.length).toBe(1);
    expect(diag.controlledObjects.length).toBe(1);
    expect(diag.enforcementMechanisms.length).toBe(1);
    expect(diag.sourceDocuments.length).toBe(1);
    expect(diag.links.length).toBe(3);

    // Validate: fully connected mandatory constraint should have no enforcement warning
    const issues = editor.validate();
    expect(issues.some((i) => i.code === 'IDEF9_MANDATORY_WITHOUT_ENFORCEMENT')).toBe(false);
    expect(issues.some((i) => i.code === 'IDEF9_UNATTACHED_CONSTRAINT')).toBe(false);

    // JSON round-trip via facade
    const json = editor.exportJSON();
    expect(json).toContain('CR-F1');
    editor.importJSON(json);
    const diag2 = editor.getActiveDiagram();
    expect(diag2.constraints.length).toBe(1);
  });
});
