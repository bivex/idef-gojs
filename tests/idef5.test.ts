import { describe, it, expect } from 'bun:test';
import { IDEF5Model } from '../src/idef5/domain/models/IDEF5Model';
import { IDEF5Kind } from '../src/idef5/domain/models/IDEF5Kind';
import { IDEF5Property } from '../src/idef5/domain/models/IDEF5Property';
import { IDEF5Relation, OntologyRelationType } from '../src/idef5/domain/models/IDEF5Relation';
import { IDEF5Rules } from '../src/idef5/domain/rules/IDEF5Rules';
import { IDEF5Editor } from '../src/idef5/infrastructure/adapters/inbound/IDEF5Editor';

describe('IDEF5 Ontology Description Capture Method (KBSI / IEEE)', () => {
  it('should create an IDEF5 Kind and an Individual with properties', () => {
    const kind = new IDEF5Kind({
      id: 'kind-tool',
      name: 'CuttingTool',
      description: 'Machining tool concept',
      isIndividual: false,
      properties: [
        new IDEF5Property({ name: 'hardness', valueType: 'HRC', isMandatory: true }),
        new IDEF5Property({ name: 'coating', valueType: 'string' }),
      ],
    });

    const individual = new IDEF5Kind({
      id: 'ind-mill-01',
      name: 'EndMill_Serial_9901',
      isIndividual: true,
      properties: [
        new IDEF5Property({ name: 'inventory_number', valueType: 'string', defaultValue: 'INV-9901' }),
      ],
    });

    expect(kind.name).toBe('CuttingTool');
    expect(kind.isIndividual).toBe(false);
    expect(kind.properties.length).toBe(2);
    expect(kind.properties[0].name).toBe('hardness');
    expect(kind.properties[0].isMandatory).toBe(true);

    expect(individual.isIndividual).toBe(true);
    expect(individual.name).toBe('EndMill_Serial_9901');
  });

  it('should detect cycles in taxonomy (subkind-of) hierarchies', () => {
    const model = new IDEF5Model({ id: 'm-tax-cycle', name: 'Taxonomy Test' });
    const diag = model.activeDiagram;

    const k1 = new IDEF5Kind({ id: 'k1', name: 'KindA' });
    const k2 = new IDEF5Kind({ id: 'k2', name: 'KindB' });
    const k3 = new IDEF5Kind({ id: 'k3', name: 'KindC' });

    diag.addKind(k1);
    diag.addKind(k2);
    diag.addKind(k3);

    // k1 subkind-of k2, k2 subkind-of k3, k3 subkind-of k1 -> Cycle!
    diag.addRelation(
      new IDEF5Relation({
        id: 'r1',
        sourceKindId: 'k1',
        targetKindId: 'k2',
        type: OntologyRelationType.SUBKIND_OF,
      })
    );
    diag.addRelation(
      new IDEF5Relation({
        id: 'r2',
        sourceKindId: 'k2',
        targetKindId: 'k3',
        type: OntologyRelationType.SUBKIND_OF,
      })
    );
    diag.addRelation(
      new IDEF5Relation({
        id: 'r3',
        sourceKindId: 'k3',
        targetKindId: 'k1',
        type: OntologyRelationType.SUBKIND_OF,
      })
    );

    const issues = IDEF5Rules.validateTaxonomyCycles(diag);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].code).toBe('IDEF5_TAXONOMY_CYCLE');
  });

  it('should detect duplicate kind names and dangling relations', () => {
    const model = new IDEF5Model({ id: 'm-dup', name: 'Validation Test' });
    const diag = model.activeDiagram;

    const k1 = new IDEF5Kind({ id: 'k1', name: 'ConceptX' });
    const k2 = new IDEF5Kind({ id: 'k2', name: 'ConceptX' }); // Duplicate name!

    diag.addKind(k1);
    diag.addKind(k2);

    diag.addRelation(
      new IDEF5Relation({
        id: 'r-dangling',
        sourceKindId: 'k1',
        targetKindId: 'non-existent-kind',
        type: OntologyRelationType.FIRST_ORDER_RELATION,
      })
    );

    const issues = IDEF5Rules.validateDiagram(diag);
    expect(issues.some((i) => i.code === 'IDEF5_DUPLICATE_KIND_NAME')).toBe(true);
    expect(issues.some((i) => i.code === 'IDEF5_DANGLING_RELATION')).toBe(true);
  });

  it('should support various ontology relations: subkind-of, part-of, instantiates, and first-order', () => {
    const subkindRel = new IDEF5Relation({
      id: 'r-sub',
      sourceKindId: 's1',
      targetKindId: 't1',
      type: OntologyRelationType.SUBKIND_OF,
    });
    expect(subkindRel.isSubkindOf()).toBe(true);
    expect(subkindRel.isTransitive).toBe(true);

    const partOfRel = new IDEF5Relation({
      id: 'r-part',
      sourceKindId: 'p1',
      targetKindId: 'w1',
      type: OntologyRelationType.PART_OF,
    });
    expect(partOfRel.isPartOf()).toBe(true);

    const instRel = new IDEF5Relation({
      id: 'r-inst',
      sourceKindId: 'i1',
      targetKindId: 'k1',
      type: OntologyRelationType.INSTANTIATES,
    });
    expect(instRel.isInstantiates()).toBe(true);

    const customRel = new IDEF5Relation({
      id: 'r-custom',
      sourceKindId: 'k1',
      targetKindId: 'k2',
      type: OntologyRelationType.FIRST_ORDER_RELATION,
      name: 'manufactured-from',
    });
    expect(customRel.name).toBe('manufactured-from');
  });

  it('should serialize and deserialize model to/from JSON', () => {
    const model = new IDEF5Model({ id: 'm-ont', name: 'Manufacturing Ontology' });
    const kind = new IDEF5Kind({
      id: 'k100',
      name: 'CNC_Machine',
      properties: [new IDEF5Property({ name: 'power_kw', valueType: 'float' })],
    });
    model.activeDiagram.addKind(kind);

    const json = model.toJSON();
    const restored = IDEF5Model.fromJSON(json);

    expect(restored.id).toBe('m-ont');
    expect(restored.activeDiagram.kinds.length).toBe(1);
    expect(restored.activeDiagram.kinds[0].name).toBe('CNC_Machine');
    expect(restored.activeDiagram.kinds[0].properties[0].name).toBe('power_kw');
  });

  it('should manage kinds and relations via IDEF5Editor facade', () => {
    const editor = new IDEF5Editor();
    editor.createModel('m-facade', 'Facade Ontology Test');

    const k1 = editor.addKind({ name: 'Motor', properties: [{ name: 'power', valueType: 'kW' }] });
    const k2 = editor.addKind({ name: 'Pump' });

    const rel = editor.addRelation({
      sourceKindId: k1.id,
      targetKindId: k2.id,
      type: OntologyRelationType.FIRST_ORDER_RELATION,
      name: 'drives',
    });

    const active = editor.getActiveDiagram();
    expect(active.kinds.length).toBe(2);
    expect(active.relations.length).toBe(1);
    expect(active.relations[0].name).toBe('drives');

    const json = editor.exportJSON();
    expect(json).toContain('Facade Ontology Test');
    expect(json).toContain('Motor');
  });
});
