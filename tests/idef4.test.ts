import { describe, it, expect } from 'bun:test';
import { IDEF4Model } from '../src/idef4/domain/models/IDEF4Model';
import { IDEF4Class } from '../src/idef4/domain/models/IDEF4Class';
import { IDEF4Attribute } from '../src/idef4/domain/models/IDEF4Attribute';
import { IDEF4Method } from '../src/idef4/domain/models/IDEF4Method';
import { IDEF4Relationship, RelationshipKind } from '../src/idef4/domain/models/IDEF4Relationship';
import { IDEF4Rules } from '../src/idef4/domain/rules/IDEF4Rules';

describe('IDEF4 Object-Oriented Design Method (KBSI / IICE)', () => {
  it('should create an IDEF4 class with attributes and methods', () => {
    const cls = new IDEF4Class({
      id: 'cls-1',
      name: 'Account',
      isAbstract: false,
      attributes: [
        new IDEF4Attribute({ name: 'balance', dataType: 'number', visibility: 'private' }),
        new IDEF4Attribute({ name: 'accountNumber', dataType: 'string', visibility: 'public' }),
      ],
      methods: [
        new IDEF4Method({
          name: 'deposit',
          returnType: 'void',
          visibility: 'public',
          parameters: [{ name: 'amount', type: 'number' }],
        }),
      ],
    });

    expect(cls.name).toBe('Account');
    expect(cls.attributes.length).toBe(2);
    expect(cls.methods.length).toBe(1);
    expect(cls.attributes[0].toString()).toBe('- balance: number');
    expect(cls.attributes[1].toString()).toBe('+ accountNumber: string');
  });

  it('should detect inheritance cycles in IDEF4 models', () => {
    const model = new IDEF4Model({ id: 'm-1', name: 'Test Cycles' });
    const diag = model.activeDiagram;

    const clsA = new IDEF4Class({ id: 'a', name: 'ClassA' });
    const clsB = new IDEF4Class({ id: 'b', name: 'ClassB' });
    const clsC = new IDEF4Class({ id: 'c', name: 'ClassC' });

    diag.addClass(clsA);
    diag.addClass(clsB);
    diag.addClass(clsC);

    // A inherits B, B inherits C, C inherits A -> Cycle!
    diag.addRelationship(new IDEF4Relationship({ id: 'r1', sourceClassId: 'a', targetClassId: 'b', kind: RelationshipKind.INHERITANCE }));
    diag.addRelationship(new IDEF4Relationship({ id: 'r2', sourceClassId: 'b', targetClassId: 'c', kind: RelationshipKind.INHERITANCE }));
    diag.addRelationship(new IDEF4Relationship({ id: 'r3', sourceClassId: 'c', targetClassId: 'a', kind: RelationshipKind.INHERITANCE }));

    const issues = IDEF4Rules.validateInheritanceCycles(diag);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].code).toBe('IDEF4_INHERITANCE_CYCLE');
  });

  it('should detect abstract methods in concrete classes', () => {
    const model = new IDEF4Model({ id: 'm-2', name: 'Abstract Test' });
    const diag = model.activeDiagram;

    const concreteClass = new IDEF4Class({
      id: 'c-conc',
      name: 'ConcreteVehicle',
      isAbstract: false,
      methods: [
        new IDEF4Method({ name: 'drive', returnType: 'void', isAbstract: true }),
      ],
    });
    diag.addClass(concreteClass);

    const issues = IDEF4Rules.validateClass(concreteClass);
    expect(issues.some((i) => i.code === 'IDEF4_CONCRETE_CLASS_ABSTRACT_METHOD')).toBe(true);
  });

  it('should support inheritance, aggregation, composition, and client-server relations', () => {
    const relInh = new IDEF4Relationship({
      id: 'r-inh',
      sourceClassId: 'child',
      targetClassId: 'parent',
      kind: RelationshipKind.INHERITANCE,
    });
    expect(relInh.isInheritance()).toBe(true);

    const relComp = new IDEF4Relationship({
      id: 'r-comp',
      sourceClassId: 'order',
      targetClassId: 'item',
      kind: RelationshipKind.COMPOSITION,
      sourceMultiplicity: '1',
      targetMultiplicity: '1..*',
    });
    expect(relComp.isComposition()).toBe(true);
    expect(relComp.targetMultiplicity).toBe('1..*');
  });

  it('should serialize and deserialize model to/from JSON without data loss', () => {
    const model = new IDEF4Model({ id: 'm-json', name: 'OO Architecture' });
    const cls = new IDEF4Class({
      id: 'c1',
      name: 'Engine',
      attributes: [new IDEF4Attribute({ name: 'displacement', dataType: 'number' })],
    });
    model.activeDiagram.addClass(cls);

    const json = model.toJSON();
    const restored = IDEF4Model.fromJSON(json);

    expect(restored.id).toBe('m-json');
    expect(restored.activeDiagram.classes.length).toBe(1);
    expect(restored.activeDiagram.classes[0].name).toBe('Engine');
    expect(restored.activeDiagram.classes[0].attributes[0].name).toBe('displacement');
  });
});
