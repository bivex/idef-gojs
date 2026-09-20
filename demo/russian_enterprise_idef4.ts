import { IDEF4Model } from '../src/idef4/domain/models/IDEF4Model';
import { IDEF4Diagram } from '../src/idef4/domain/models/IDEF4Diagram';
import { IDEF4Class } from '../src/idef4/domain/models/IDEF4Class';
import { IDEF4Attribute } from '../src/idef4/domain/models/IDEF4Attribute';
import { IDEF4Method } from '../src/idef4/domain/models/IDEF4Method';
import { IDEF4Relationship, RelationshipKind } from '../src/idef4/domain/models/IDEF4Relationship';
import { Position } from '../src/domain/models/Position';

export function createRussianEnterpriseIDEF4Model(): IDEF4Model {
  const diagram = new IDEF4Diagram({
    id: 'diag-mes-oo',
    name: 'Объектно-ориентированная модель производственной системы MES/ERP',
  });

  // 1. Abstract Base Class: AbstractMachine
  const clsMachine = new IDEF4Class({
    id: 'cls-machine',
    name: 'AbstractMachine',
    isAbstract: true,
    position: new Position(380, 60),
    attributes: [
      new IDEF4Attribute({ name: 'serialNumber', dataType: 'string', visibility: 'protected' }),
      new IDEF4Attribute({ name: 'operatingHours', dataType: 'number', visibility: 'protected' }),
      new IDEF4Attribute({ name: 'isOnline', dataType: 'boolean', visibility: 'public' }),
    ],
    methods: [
      new IDEF4Method({ name: 'powerOn', returnType: 'void', visibility: 'public' }),
      new IDEF4Method({ name: 'powerOff', returnType: 'void', visibility: 'public' }),
      new IDEF4Method({
        name: 'executeOperation',
        returnType: 'boolean',
        visibility: 'public',
        isAbstract: true,
        parameters: [{ name: 'operationId', type: 'string' }],
      }),
    ],
  });
  diagram.addClass(clsMachine);

  // 2. Concrete Subclass: CNC_Lathe (Токарный станок с ЧПУ)
  const clsLathe = new IDEF4Class({
    id: 'cls-lathe',
    name: 'CNC_Lathe',
    position: new Position(180, 280),
    attributes: [
      new IDEF4Attribute({ name: 'spindleMaxRPM', dataType: 'number', visibility: 'private' }),
      new IDEF4Attribute({ name: 'turretStations', dataType: 'number', visibility: 'private' }),
    ],
    methods: [
      new IDEF4Method({
        name: 'executeOperation',
        returnType: 'boolean',
        visibility: 'public',
        parameters: [{ name: 'operationId', type: 'string' }],
      }),
      new IDEF4Method({
        name: 'changeTool',
        returnType: 'void',
        visibility: 'public',
        parameters: [{ name: 'station', type: 'number' }],
      }),
    ],
  });
  diagram.addClass(clsLathe);

  // 3. Concrete Subclass: MillingCenter (Фрезерный обрабатывающий центр)
  const clsMilling = new IDEF4Class({
    id: 'cls-milling',
    name: 'MillingCenter',
    position: new Position(580, 280),
    attributes: [
      new IDEF4Attribute({ name: 'axisCount', dataType: 'number', visibility: 'private' }),
      new IDEF4Attribute({ name: 'feedRateMmMin', dataType: 'number', visibility: 'private' }),
    ],
    methods: [
      new IDEF4Method({
        name: 'executeOperation',
        returnType: 'boolean',
        visibility: 'public',
        parameters: [{ name: 'operationId', type: 'string' }],
      }),
      new IDEF4Method({ name: 'calibrateProbes', returnType: 'void', visibility: 'public' }),
    ],
  });
  diagram.addClass(clsMilling);

  // 4. Class: ProductionOrder (Производственный заказ)
  const clsOrder = new IDEF4Class({
    id: 'cls-order',
    name: 'ProductionOrder',
    position: new Position(880, 60),
    attributes: [
      new IDEF4Attribute({ name: 'orderNumber', dataType: 'string', visibility: 'public' }),
      new IDEF4Attribute({ name: 'releaseDate', dataType: 'Date', visibility: 'public' }),
      new IDEF4Attribute({ name: 'isPriority', dataType: 'boolean', visibility: 'private' }),
    ],
    methods: [
      new IDEF4Method({ name: 'calculatePlannedLeadTime', returnType: 'number', visibility: 'public' }),
      new IDEF4Method({ name: 'dispatchToShopFloor', returnType: 'void', visibility: 'public' }),
    ],
  });
  diagram.addClass(clsOrder);

  // 5. Class: OrderItem (Позиция производственного заказа)
  const clsItem = new IDEF4Class({
    id: 'cls-item',
    name: 'OrderItem',
    position: new Position(880, 280),
    attributes: [
      new IDEF4Attribute({ name: 'itemCode', dataType: 'string', visibility: 'public' }),
      new IDEF4Attribute({ name: 'quantity', dataType: 'number', visibility: 'public' }),
      new IDEF4Attribute({ name: 'drawingNumber', dataType: 'string', visibility: 'public' }),
    ],
    methods: [
      new IDEF4Method({ name: 'getBOMSpecification', returnType: 'string[]', visibility: 'public' }),
    ],
  });
  diagram.addClass(clsItem);

  // 6. Class: MachineOperator (Оператор-наладчик)
  const clsOperator = new IDEF4Class({
    id: 'cls-operator',
    name: 'MachineOperator',
    position: new Position(80, 60),
    attributes: [
      new IDEF4Attribute({ name: 'badgeId', dataType: 'string', visibility: 'public' }),
      new IDEF4Attribute({ name: 'fullName', dataType: 'string', visibility: 'public' }),
      new IDEF4Attribute({ name: 'skillLevel', dataType: 'number', visibility: 'protected' }),
    ],
    methods: [
      new IDEF4Method({
        name: 'bindToStation',
        returnType: 'void',
        visibility: 'public',
        parameters: [{ name: 'machineId', type: 'string' }],
      }),
    ],
  });
  diagram.addClass(clsOperator);

  // Relationships:
  // Inheritance: CNC_Lathe is a AbstractMachine
  diagram.addRelationship(
    new IDEF4Relationship({
      id: 'rel-inh-lathe',
      sourceClassId: 'cls-lathe',
      targetClassId: 'cls-machine',
      kind: RelationshipKind.INHERITANCE,
    })
  );

  // Inheritance: MillingCenter is a AbstractMachine
  diagram.addRelationship(
    new IDEF4Relationship({
      id: 'rel-inh-milling',
      sourceClassId: 'cls-milling',
      targetClassId: 'cls-machine',
      kind: RelationshipKind.INHERITANCE,
    })
  );

  // Composition: ProductionOrder owns 1..* OrderItem
  diagram.addRelationship(
    new IDEF4Relationship({
      id: 'rel-comp-order',
      sourceClassId: 'cls-order',
      targetClassId: 'cls-item',
      kind: RelationshipKind.COMPOSITION,
      name: 'contains',
      sourceMultiplicity: '1',
      targetMultiplicity: '1..*',
    })
  );

  // Client-Server: Operator operates Machines
  diagram.addRelationship(
    new IDEF4Relationship({
      id: 'rel-cs-operator',
      sourceClassId: 'cls-operator',
      targetClassId: 'cls-machine',
      kind: RelationshipKind.CLIENT_SERVER,
      name: 'operates',
      sourceMultiplicity: '1',
      targetMultiplicity: '1..*',
    })
  );

  return new IDEF4Model({
    id: 'idef4-mes-model',
    name: 'ОО-модель производственной системы MES/ERP',
    rootDiagram: diagram,
  });
}
