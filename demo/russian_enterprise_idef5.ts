import { IDEF5Editor } from '../src/idef5/infrastructure/adapters/inbound/IDEF5Editor';
import { OntologyRelationType } from '../src/idef5/domain/models/IDEF5Relation';

/**
 * Creates and loads an ontology of Discrete Machine-Building Enterprise
 * in accordance with the KBSI IDEF5 standard (Kinds, Individuals, subkind-of, part-of, and first-order relations).
 */
export function loadRussianEnterpriseIDEF5Demo(editor: IDEF5Editor): void {
  editor.createModel(
    'enterprise-ont-01',
    'Онтология дискретного машиностроительного производства (KBSI IDEF5 Ontology)'
  );

  // 1. Top concepts (Kinds)
  const kindProduct = editor.addKind({
    name: 'Изделие',
    description: 'Конечный или промежуточный материальный результат производства',
    properties: [
      { name: 'артикул_гост', valueType: 'string', isMandatory: true },
      { name: 'наименование', valueType: 'string', isMandatory: true },
    ],
    x: 200,
    y: 80,
  });

  const kindSubassembly = editor.addKind({
    name: 'Сборочная_Единица',
    description: 'Разъемное или неразъемное соединение составных частей',
    properties: [
      { name: 'номер_сборочного_чертежа', valueType: 'string', isMandatory: true },
      { name: 'масса_брутто_кг', valueType: 'float' },
    ],
    x: 80,
    y: 220,
  });

  const kindPart = editor.addKind({
    name: 'Деталь',
    description: 'Изделие, изготовленное из однородного материала без сборочных операций',
    properties: [
      { name: 'шероховатость_Ra_мкм', valueType: 'float' },
      { name: 'квалитет_точности', valueType: 'int', defaultValue: '7' },
    ],
    x: 320,
    y: 220,
  });

  const kindMaterial = editor.addKind({
    name: 'Конструкционный_Материал',
    description: 'Сырьевой полуфабрикат или сплав',
    properties: [
      { name: 'марка_стали_сплава', valueType: 'string', isMandatory: true },
      { name: 'предел_текучести_МПа', valueType: 'int' },
    ],
    x: 520,
    y: 220,
  });

  const kindEquipment = editor.addKind({
    name: 'Технологическое_Оборудование',
    description: 'Станки, агрегаты и производственные обрабатывающие центры',
    properties: [
      { name: 'потребляемая_мощность_кВт', valueType: 'float' },
      { name: 'класс_точности', valueType: 'string' },
    ],
    x: 250,
    y: 380,
  });

  const kindCncMilling = editor.addKind({
    name: 'Фрезерный_ЧПУ_Станок',
    description: '5-осевой многоцелевой обрабатывающий центр',
    properties: [
      { name: 'число_управляемых_осей', valueType: 'int', defaultValue: '5' },
      { name: 'макс_обороты_шпинделя', valueType: 'int', defaultValue: '18000' },
    ],
    x: 100,
    y: 520,
  });

  const kindLathe = editor.addKind({
    name: 'Токарный_Станок',
    description: 'Токарно-револьверный станок с ЧПУ',
    properties: [
      { name: 'макс_диаметр_точения_мм', valueType: 'float' },
    ],
    x: 400,
    y: 520,
  });

  const kindTool = editor.addKind({
    name: 'Режущий_Инструмент',
    description: 'Сменный инструмент для съема стружки',
    properties: [
      { name: 'сплав_пластины', valueType: 'string' },
      { name: 'период_стойкости_мин', valueType: 'int' },
    ],
    x: 650,
    y: 380,
  });

  const kindEndMill = editor.addKind({
    name: 'Фреза_Твердосплавная',
    description: 'Концевая монолитная фреза',
    properties: [
      { name: 'диаметр_d_мм', valueType: 'float', isMandatory: true },
      { name: 'число_зубьев_z', valueType: 'int', defaultValue: '4' },
    ],
    x: 650,
    y: 520,
  });

  const kindOperator = editor.addKind({
    name: 'Оператор_ЧПУ',
    description: 'Рабочий персонал цеха механообработки',
    properties: [
      { name: 'табельный_номер', valueType: 'string', isMandatory: true },
      { name: 'разряд_квалификации', valueType: 'int', defaultValue: '6' },
    ],
    x: -120,
    y: 380,
  });

  // 2. Individuals (KBSI IDEF5 individual concepts)
  const indMachineInstance = editor.addKind({
    name: 'Станок_DMG_MORI_№104',
    description: 'Физический экземпляр станка в цехе №3',
    isIndividual: true,
    properties: [
      { name: 'инвентарный_номер', valueType: 'string', defaultValue: 'INV-DMG-00104' },
      { name: 'статус', valueType: 'string', defaultValue: 'В_РАБОТЕ' },
    ],
    x: 100,
    y: 670,
  });

  const indAssemblyInstance = editor.addKind({
    name: 'Редуктор_Ц2У-250_СБ',
    description: 'Экземпляр редуктора главного привода',
    isIndividual: true,
    properties: [
      { name: 'заводской_номер', valueType: 'string', defaultValue: 'SN-90821-2026' },
      { name: 'дата_сборки', valueType: 'string', defaultValue: '2026-03-15' },
    ],
    x: -120,
    y: 220,
  });

  // 3. Taxonomy Relations (subkind-of)
  editor.addRelation({
    sourceKindId: kindSubassembly.id,
    targetKindId: kindProduct.id,
    type: OntologyRelationType.SUBKIND_OF,
    name: 'subkind-of',
  });

  editor.addRelation({
    sourceKindId: kindPart.id,
    targetKindId: kindProduct.id,
    type: OntologyRelationType.SUBKIND_OF,
    name: 'subkind-of',
  });

  editor.addRelation({
    sourceKindId: kindCncMilling.id,
    targetKindId: kindEquipment.id,
    type: OntologyRelationType.SUBKIND_OF,
    name: 'subkind-of',
  });

  editor.addRelation({
    sourceKindId: kindLathe.id,
    targetKindId: kindEquipment.id,
    type: OntologyRelationType.SUBKIND_OF,
    name: 'subkind-of',
  });

  editor.addRelation({
    sourceKindId: kindEndMill.id,
    targetKindId: kindTool.id,
    type: OntologyRelationType.SUBKIND_OF,
    name: 'subkind-of',
  });

  // 4. Mereological Relation (part-of)
  editor.addRelation({
    sourceKindId: kindPart.id,
    targetKindId: kindSubassembly.id,
    type: OntologyRelationType.PART_OF,
    name: 'part-of (компонент-входит-в)',
  });

  // 5. Instantiation Relations (instantiates)
  editor.addRelation({
    sourceKindId: indMachineInstance.id,
    targetKindId: kindCncMilling.id,
    type: OntologyRelationType.INSTANTIATES,
    name: 'instantiates (экземпляр-вида)',
  });

  editor.addRelation({
    sourceKindId: indAssemblyInstance.id,
    targetKindId: kindSubassembly.id,
    type: OntologyRelationType.INSTANTIATES,
    name: 'instantiates (экземпляр-вида)',
  });

  // 6. First-Order Semantic Relations
  editor.addRelation({
    sourceKindId: kindPart.id,
    targetKindId: kindMaterial.id,
    type: OntologyRelationType.FIRST_ORDER_RELATION,
    name: 'изготавливается-из',
  });

  editor.addRelation({
    sourceKindId: kindPart.id,
    targetKindId: kindEquipment.id,
    type: OntologyRelationType.FIRST_ORDER_RELATION,
    name: 'обрабатывается-на',
  });

  editor.addRelation({
    sourceKindId: kindEquipment.id,
    targetKindId: kindTool.id,
    type: OntologyRelationType.FIRST_ORDER_RELATION,
    name: 'оснащается-инструментом',
  });

  editor.addRelation({
    sourceKindId: kindOperator.id,
    targetKindId: kindEquipment.id,
    type: OntologyRelationType.FIRST_ORDER_RELATION,
    name: 'управляет-и-обслуживает',
  });
}
