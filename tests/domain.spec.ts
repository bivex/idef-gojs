import { describe, it, expect } from 'vitest';
import { IDEF1Model } from '../src/domain/models/IDEF1Model';
import { Entity } from '../src/domain/models/Entity';
import { Attribute } from '../src/domain/models/Attribute';
import { Relationship, RelationshipType, Cardinality } from '../src/domain/models/Relationship';
import { CategorizationCluster } from '../src/domain/models/Categorization';
import { Position } from '../src/domain/models/Position';
import { InvalidIDEF1RuleError } from '../src/domain/errors/DomainError';

describe('IDEF1X Domain Model', () => {
  it('should create independent entity with square corners by default', () => {
    const entity = new Entity({
      id: 'dept',
      name: 'DEPARTMENT',
      number: 1,
      isDependent: false,
    });

    expect(entity.name).toBe('DEPARTMENT');
    expect(entity.number).toBe(1);
    expect(entity.isDependent).toBe(false);
  });

  it('should manage primary key and non-key attributes', () => {
    const entity = new Entity({ id: 'emp', name: 'EMPLOYEE' });

    entity.addAttribute(new Attribute('emp_id', true, false, 'INTEGER'));
    entity.addAttribute(new Attribute('emp_name', false, false, 'VARCHAR(100)'));
    entity.addAttribute(new Attribute('salary', false, false, 'DECIMAL(10,2)', undefined, undefined, true));

    expect(entity.primaryKeyAttributes).toHaveLength(1);
    expect(entity.primaryKeyAttributes[0].name).toBe('emp_id');
    expect(entity.nonKeyAttributes).toHaveLength(2);
    expect(entity.attributes).toHaveLength(3);
  });

  it('should enforce that PK attributes cannot be optional (nullable)', () => {
    expect(() => {
      new Attribute('id', true, false, 'INTEGER', undefined, undefined, true);
    }).toThrow('Primary Key attributes cannot be optional');
  });

  it('should automatically migrate primary key of parent to child PK on identifying relationship', () => {
    const model = new IDEF1Model({ id: 'test_model', name: 'Test Model' });

    const parent = new Entity({ id: 'order', name: 'ORDER', number: 1 });
    parent.addAttribute(new Attribute('order_id', true, false, 'INTEGER'));
    parent.addAttribute(new Attribute('order_date', false, false, 'DATE'));

    const child = new Entity({ id: 'order_item', name: 'ORDER_ITEM', number: 2 });
    child.addAttribute(new Attribute('line_no', true, false, 'INTEGER'));

    model.addEntity(parent);
    model.addEntity(child);

    // Add Identifying relationship: child MUST become dependent (rounded box)
    // and parent PK 'order_id' must migrate into child's PK
    model.addRelationship(
      new Relationship({
        id: 'rel_1',
        name: 'contains',
        parentEntityId: 'order',
        childEntityId: 'order_item',
        type: RelationshipType.IDENTIFYING,
        cardinality: Cardinality.ONE_OR_MORE,
      })
    );

    expect(child.isDependent).toBe(true);

    const migratedPk = child.primaryKeyAttributes.find((a) => a.name === 'order_id');
    expect(migratedPk).toBeDefined();
    expect(migratedPk?.isPrimaryKey).toBe(true);
    expect(migratedPk?.isForeignKey).toBe(true);
    expect(migratedPk?.foreignKeyRef?.parentEntityId).toBe('order');
  });

  it('should migrate parent PK into child non-key attributes on non-identifying relationship', () => {
    const model = new IDEF1Model({ id: 'test_model', name: 'Test Model' });

    const dept = new Entity({ id: 'dept', name: 'DEPARTMENT', number: 1 });
    dept.addAttribute(new Attribute('dept_id', true, false, 'INTEGER'));

    const emp = new Entity({ id: 'emp', name: 'EMPLOYEE', number: 2 });
    emp.addAttribute(new Attribute('emp_id', true, false, 'INTEGER'));

    model.addEntity(dept);
    model.addEntity(emp);

    model.addRelationship(
      new Relationship({
        id: 'rel_dept_emp',
        name: 'employs',
        parentEntityId: 'dept',
        childEntityId: 'emp',
        type: RelationshipType.NON_IDENTIFYING,
        cardinality: Cardinality.ZERO_OR_MORE,
        isOptional: true,
      })
    );

    // In non-identifying relationship, child is NOT forced to be dependent
    expect(emp.isDependent).toBe(false);

    const migratedFk = emp.nonKeyAttributes.find((a) => a.name === 'dept_id');
    expect(migratedFk).toBeDefined();
    expect(migratedFk?.isPrimaryKey).toBe(false);
    expect(migratedFk?.isForeignKey).toBe(true);
    expect(migratedFk?.isOptional).toBe(true);
  });

  it('should detect cycles in identifying relationships', () => {
    const model = new IDEF1Model({ id: 'test_cycle', name: 'Cycle Test' });

    const a = new Entity({ id: 'a', name: 'A' });
    const b = new Entity({ id: 'b', name: 'B' });
    const c = new Entity({ id: 'c', name: 'C' });

    model.addEntity(a);
    model.addEntity(b);
    model.addEntity(c);

    model.addRelationship(
      new Relationship({
        id: 'rel_ab',
        name: 'ab',
        parentEntityId: 'a',
        childEntityId: 'b',
        type: RelationshipType.IDENTIFYING,
      })
    );

    model.addRelationship(
      new Relationship({
        id: 'rel_bc',
        name: 'bc',
        parentEntityId: 'b',
        childEntityId: 'c',
        type: RelationshipType.IDENTIFYING,
      })
    );

    // Adding c -> a identifying relationship should throw cycle error
    expect(() => {
      model.addRelationship(
        new Relationship({
          id: 'rel_ca',
          name: 'ca',
          parentEntityId: 'c',
          childEntityId: 'a',
          type: RelationshipType.IDENTIFYING,
        })
      );
    }).toThrow(InvalidIDEF1RuleError);
  });

  it('should handle Categorization (Subtypes) correctly', () => {
    const model = new IDEF1Model({ id: 'cat_test', name: 'Subtype Test' });

    const person = new Entity({ id: 'person', name: 'PERSON' });
    person.addAttribute(new Attribute('ssn', true, false, 'CHAR(9)'));

    const student = new Entity({ id: 'student', name: 'STUDENT' });
    const professor = new Entity({ id: 'professor', name: 'PROFESSOR' });

    model.addEntity(person);
    model.addEntity(student);
    model.addEntity(professor);

    const cluster = new CategorizationCluster({
      id: 'cluster_1',
      genericEntityId: 'person',
      discriminatorAttributeName: 'person_type',
      specificEntityIds: ['student', 'professor'],
      isComplete: true,
    });

    model.addCategorization(cluster);

    expect(student.isDependent).toBe(true);
    expect(professor.isDependent).toBe(true);

    // Specific entities must have inherited generic entity PK
    expect(student.primaryKeyAttributes.find((a) => a.name === 'ssn')).toBeDefined();
    expect(professor.primaryKeyAttributes.find((a) => a.name === 'ssn')).toBeDefined();
  });

  it('should handle self-referencing recursive relationships with role names', () => {
    const model = new IDEF1Model({ id: 'rec_test', name: 'Recursive Test' });

    const emp = new Entity({ id: 'emp', name: 'EMPLOYEE' });
    emp.addAttribute(new Attribute('emp_id', true, false, 'INTEGER'));

    model.addEntity(emp);

    // Self-reference: EMPLOYEE manages EMPLOYEE
    model.addRelationship(
      new Relationship({
        id: 'rel_manages',
        name: 'manages',
        inverseName: 'is managed by',
        roleName: 'manager',
        parentEntityId: 'emp',
        childEntityId: 'emp',
        type: RelationshipType.NON_IDENTIFYING,
        isOptional: true,
      })
    );

    const migratedFk = emp.nonKeyAttributes.find((a) => a.name === 'manager_emp_id');
    expect(migratedFk).toBeDefined();
    expect(migratedFk?.isForeignKey).toBe(true);
    expect(migratedFk?.roleName).toBe('manager');
  });

  it('should support non-specific (Many-to-Many) relationships without premature key migration', () => {
    const model = new IDEF1Model({ id: 'm2m_test', name: 'M2M Test' });

    const student = new Entity({ id: 'st', name: 'STUDENT' });
    student.addAttribute(new Attribute('student_id', true, false, 'INTEGER'));

    const course = new Entity({ id: 'co', name: 'COURSE' });
    course.addAttribute(new Attribute('course_id', true, false, 'INTEGER'));

    model.addEntity(student);
    model.addEntity(course);

    const rel = new Relationship({
      id: 'rel_st_co',
      name: 'enrolls in',
      inverseName: 'is taken by',
      parentEntityId: 'st',
      childEntityId: 'co',
      type: RelationshipType.NON_SPECIFIC,
    });

    model.addRelationship(rel);

    expect(rel.isNonSpecific()).toBe(true);
    // Keys should NOT migrate into each other in non-specific relationship
    expect(course.attributes.find((a) => a.name === 'student_id')).toBeUndefined();
    expect(student.attributes.find((a) => a.name === 'course_id')).toBeUndefined();
  });

  it('should support Alternate Keys (AK1, AK2) per FIPS 184 §3.8.2', () => {
    const attr1 = new Attribute('ssn', false, false, 'CHAR(9)', undefined, undefined, false, 1);
    expect(attr1.formattedName).toBe('ssn (AK1): CHAR(9)');

    // Multiple alternate keys on single attribute (FIPS 184 §3.8.2)
    const attr2 = new Attribute('passport_no', false, false, 'VARCHAR(20)', undefined, undefined, false, [1, 2]);
    expect(attr2.formattedName).toBe('passport_no (AK1, AK2): VARCHAR(20)');

    // Combined Alternate Key and Foreign Key
    const attr3 = new Attribute('ref_code', false, true, 'VARCHAR(10)', undefined, undefined, false, 2);
    expect(attr3.formattedName).toBe('ref_code (AK2, FK): VARCHAR(10)');
  });
});
