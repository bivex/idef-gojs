import { IDEF1Editor, RelationshipType, Cardinality } from '../src/index';

/**
 * Загрузка масштабной информационной модели ERP-системы предприятия (IDEF1X) на русском языке.
 * Модель демонстрирует все конструкции стандарта FIPS PUB 184:
 * - Независимые и зависимые сущности
 * - Идентифицирующие и неидентифицирующие связи
 * - Опциональные неидентифицирующие связи (ромб)
 * - Категоризация сущностей (Subtypes): полная и неполная
 * - Рекурсивная связь сущности на саму себя с ролевым именем (Role Name)
 * - Связь многие-ко-многим (Non-Specific N:M с точками на обоих концах)
 * - Альтернативные ключи (AK1, AK2)
 * - Мощности связей (Z, P, N)
 * - Сноски с бизнес-правилами (IDEF1X Notes)
 */
export async function loadRussianEnterpriseModel(editor: IDEF1Editor): Promise<void> {
  // ==========================================
  // 1. ОРГАНИЗАЦИОННАЯ СТРУКТУРА И СОТРУДНИКИ
  // ==========================================

  // Независимая сущность: ОТДЕЛ (прямые углы)
  const deptId = await editor.addEntity('ОТДЕЛ', {
    isDependent: false,
    position: { x: 50, y: 50 },
    primaryKeys: [{ name: 'код_отдела', dataType: 'CHAR(5)' }],
    nonKeys: [
      { name: 'название_отдела', dataType: 'VARCHAR(100)' },
      { name: 'бюджет_руб', dataType: 'DECIMAL(15,2)' },
    ],
  });

  // Сущность: СОТРУДНИК
  const empId = await editor.addEntity('СОТРУДНИК', {
    isDependent: false,
    position: { x: 380, y: 50 },
    primaryKeys: [{ name: 'таб_номер', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'снилс', dataType: 'CHAR(14)', alternateKeyIndex: 1 }, // Альтернативный ключ (AK1)
      { name: 'фио', dataType: 'VARCHAR(120)' },
      { name: 'дата_приема', dataType: 'DATE' },
      { name: 'email', dataType: 'VARCHAR(80)', alternateKeyIndex: 2 }, // Альтернативный ключ (AK2)
    ],
  });

  // Подтипы сотрудника: ШТАТНЫЙ_СОТРУДНИК и ВНЕШТАТНИК
  const staffEmpId = await editor.addEntity('ШТАТНЫЙ_СОТРУДНИК', {
    isDependent: true,
    position: { x: 720, y: 30 },
    nonKeys: [
      { name: 'оклад_руб', dataType: 'DECIMAL(12,2)' },
      { name: 'ставка_премии', dataType: 'DECIMAL(4,2)' },
    ],
  });

  const contractEmpId = await editor.addEntity('КОНТРАКТНИК', {
    isDependent: true,
    position: { x: 720, y: 150 },
    nonKeys: [
      { name: 'номер_договора', dataType: 'VARCHAR(30)', alternateKeyIndex: 1 },
      { name: 'ставка_в_час', dataType: 'DECIMAL(8,2)' },
      { name: 'дата_окончания', dataType: 'DATE' },
    ],
  });

  // Связь: ОТДЕЛ включает СОТРУДНИКОВ (неидентифицирующая, 1 ко многим)
  await editor.addRelationship(deptId, empId, {
    name: 'включает',
    inverseName: 'работает в',
    type: RelationshipType.NON_IDENTIFYING,
    cardinality: Cardinality.ONE_OR_MORE, // Маркер 'P'
  });

  // Рекурсивная связь: СОТРУДНИК руководит СОТРУДНИКАМИ (петля с ролевым именем)
  await editor.addRelationship(empId, empId, {
    name: 'руководит',
    inverseName: 'подчиняется',
    roleName: 'руководитель',
    type: RelationshipType.NON_IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
    isOptional: true, // Ромб на стороне родителя (у гендиректора нет руководителя)
  });

  // Полная категоризация СОТРУДНИКОВ (двойная линия под кружком)
  await editor.addCategorization(empId, 'тип_занятости', [staffEmpId, contractEmpId], true);

  // ==========================================
  // 2. КЛИЕНТЫ (CRM)
  // ==========================================

  // Независимая сущность: КЛИЕНТ (Супертип)
  const clientId = await editor.addEntity('КЛИЕНТ', {
    isDependent: false,
    position: { x: 50, y: 300 },
    primaryKeys: [{ name: 'код_клиента', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'телефон', dataType: 'VARCHAR(20)', alternateKeyIndex: 1 },
      { name: 'дата_регистрации', dataType: 'DATE' },
    ],
  });

  // Подтипы клиента: ФИЗИЧЕСКОЕ_ЛИЦО и ЮРИДИЧЕСКОЕ_ЛИЦО
  const individualId = await editor.addEntity('ФИЗ_ЛИЦО', {
    isDependent: true,
    position: { x: 50, y: 480 },
    nonKeys: [
      { name: 'паспорт_серия_номер', dataType: 'VARCHAR(20)', alternateKeyIndex: 1 },
      { name: 'дата_рождения', dataType: 'DATE' },
    ],
  });

  const legalEntityId = await editor.addEntity('ЮР_ЛИЦО', {
    isDependent: true,
    position: { x: 230, y: 480 },
    nonKeys: [
      { name: 'инн', dataType: 'CHAR(10)', alternateKeyIndex: 1 },
      { name: 'кпп', dataType: 'CHAR(9)' },
      { name: 'наименование_организации', dataType: 'VARCHAR(150)' },
    ],
  });

  // Полная категоризация КЛИЕНТА
  await editor.addCategorization(clientId, 'тип_клиента', [individualId, legalEntityId], true);

  // ==========================================
  // 3. СКЛАД И ТОВАРЫ
  // ==========================================

  // Независимая сущность: СКЛАД
  const warehouseId = await editor.addEntity('СКЛАД', {
    isDependent: false,
    position: { x: 720, y: 300 },
    primaryKeys: [{ name: 'код_склада', dataType: 'CHAR(4)' }],
    nonKeys: [
      { name: 'название_склада', dataType: 'VARCHAR(80)' },
      { name: 'город', dataType: 'VARCHAR(50)' },
    ],
  });

  // Независимая сущность: ТОВАР
  const productId = await editor.addEntity('ТОВАР', {
    isDependent: false,
    position: { x: 1050, y: 300 },
    primaryKeys: [{ name: 'код_товара', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'артикул', dataType: 'VARCHAR(30)', alternateKeyIndex: 1 },
      { name: 'наименование_товара', dataType: 'VARCHAR(120)' },
      { name: 'базовая_цена', dataType: 'DECIMAL(10,2)' },
    ],
  });

  // Сущность: МАРКЕТИНГОВАЯ_АКЦИЯ (для связи N:M с ТОВАРОМ)
  const promoId = await editor.addEntity('АКЦИЯ', {
    isDependent: false,
    position: { x: 1050, y: 100 },
    primaryKeys: [{ name: 'код_акции', dataType: 'CHAR(8)' }],
    nonKeys: [
      { name: 'название_акции', dataType: 'VARCHAR(100)' },
      { name: 'скидка_процент', dataType: 'DECIMAL(4,2)' },
    ],
  });

  // Связь многие-ко-многим (N:M Non-Specific, точки на обоих концах)
  await editor.addRelationship(promoId, productId, {
    name: 'распространяется на',
    inverseName: 'участвует в акции',
    type: RelationshipType.NON_SPECIFIC,
  });

  // Зависимая сущность: ОСТАТОК_НА_СКЛАДЕ (ассоциативная таблица запасов)
  const stockId = await editor.addEntity('ОСТАТОК_СКЛАДА', {
    isDependent: true,
    position: { x: 900, y: 480 },
    primaryKeys: [{ name: 'ячейка_хранения', dataType: 'VARCHAR(20)' }],
    nonKeys: [
      { name: 'количество_в_наличии', dataType: 'INTEGER' },
      { name: 'зарезервировано', dataType: 'INTEGER' },
    ],
  });

  // Идентифицирующая связь от СКЛАДА (миграция код_склада в состав PK)
  await editor.addRelationship(warehouseId, stockId, {
    name: 'хранит',
    inverseName: 'размещен на',
    type: RelationshipType.IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
  });

  // Идентифицирующая связь от ТОВАРА (миграция код_товара в состав PK)
  await editor.addRelationship(productId, stockId, {
    name: 'учитывается в',
    inverseName: 'содержит товар',
    type: RelationshipType.IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
  });

  // ==========================================
  // 4. ЗАКАЗЫ И ПРОДАЖИ
  // ==========================================

  // Зависимая сущность: ЗАКАЗ
  const orderId = await editor.addEntity('ЗАКАЗ', {
    isDependent: false,
    position: { x: 420, y: 350 },
    primaryKeys: [{ name: 'номер_заказа', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'дата_заказа', dataType: 'DATETIME' },
      { name: 'статус_заказа', dataType: 'VARCHAR(30)' },
      { name: 'итоговая_сумма', dataType: 'DECIMAL(12,2)' },
    ],
  });

  // Связь: КЛИЕНТ размещает ЗАКАЗЫ (неидентифицирующая связь)
  await editor.addRelationship(clientId, orderId, {
    name: 'оформляет',
    inverseName: 'принадлежит клиенту',
    type: RelationshipType.NON_IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
    isOptional: false,
  });

  // Связь: СОТРУДНИК курирует ЗАКАЗ (опциональная неидентифицирующая, ромб на родителе)
  await editor.addRelationship(empId, orderId, {
    name: 'курирует',
    inverseName: 'курируется менеджером',
    roleName: 'менеджер',
    type: RelationshipType.NON_IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
    isOptional: true, // Ромб: заказ может быть оформлен через сайт без менеджера
  });

  // Зависимая сущность: ПОЗИЦИЯ_ЗАКАЗА
  const orderItemId = await editor.addEntity('ПОЗИЦИЯ_ЗАКАЗА', {
    isDependent: true,
    position: { x: 600, y: 550 },
    primaryKeys: [{ name: 'номер_строки', dataType: 'SMALLINT' }],
    nonKeys: [
      { name: 'количество', dataType: 'INTEGER' },
      { name: 'цена_продажи', dataType: 'DECIMAL(10,2)' },
      { name: 'скидка_руб', dataType: 'DECIMAL(8,2)', isOptional: true },
    ],
  });

  // Идентифицирующая связь: ЗАКАЗ содержит ПОЗИЦИИ_ЗАКАЗА (solid line + 'P' 1 или более)
  await editor.addRelationship(orderId, orderItemId, {
    name: 'содержит',
    inverseName: 'входит в заказ',
    type: RelationshipType.IDENTIFYING,
    cardinality: Cardinality.ONE_OR_MORE, // Заказ не может существовать без позиций
  });

  // Неидентифицирующая связь: ТОВАР поставляется в ПОЗИЦИЮ_ЗАКАЗА
  await editor.addRelationship(productId, orderItemId, {
    name: 'включается в',
    inverseName: 'указывает товар',
    type: RelationshipType.NON_IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
  });

  // Зависимая сущность: ОПЛАТА
  const paymentId = await editor.addEntity('ОПЛАТА', {
    isDependent: true,
    position: { x: 380, y: 550 },
    primaryKeys: [{ name: 'номер_платежа', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'дата_оплаты', dataType: 'DATETIME' },
      { name: 'сумма_платежа', dataType: 'DECIMAL(12,2)' },
      { name: 'платежная_система', dataType: 'VARCHAR(40)' },
    ],
  });

  // Идентифицирующая связь: ЗАКАЗ оплачивается ОПЛАТАМИ
  await editor.addRelationship(orderId, paymentId, {
    name: 'оплачивается',
    inverseName: 'относится к заказу',
    type: RelationshipType.IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_MORE,
  });

  // Зависимая сущность: ДОСТАВКА (мощность 0 или 1, маркер 'Z')
  const deliveryId = await editor.addEntity('ДОСТАВКА', {
    isDependent: true,
    position: { x: 180, y: 650 },
    primaryKeys: [{ name: 'код_доставки', dataType: 'INTEGER' }],
    nonKeys: [
      { name: 'трек_номер', dataType: 'VARCHAR(40)', alternateKeyIndex: 1 },
      { name: 'адрес_доставки', dataType: 'VARCHAR(200)' },
      { name: 'статус_доставки', dataType: 'VARCHAR(30)' },
    ],
  });

  // Идентифицирующая связь: ЗАКАЗ имеет максимум одну ДОСТАВКУ (маркер 'Z')
  await editor.addRelationship(orderId, deliveryId, {
    name: 'доставляется через',
    inverseName: 'доставляет заказ',
    type: RelationshipType.IDENTIFYING,
    cardinality: Cardinality.ZERO_OR_ONE, // Ровно 0 или 1 доставка (кружок с 'Z')
  });

  // ==========================================
  // 5. БИЗНЕС-ОГРАНИЧЕНИЯ И СНОСКИ (IDEF1X NOTES)
  // ==========================================
  editor.addNote(
    'ПРАВИЛО 1: Заказ считается действительным только при наличии минимум одной позиции (кардинальность 1..N, маркер P).',
    { number: 1, position: { x: 800, y: 700 } }
  );

  editor.addNote(
    'ПРАВИЛО 2: Заказы на сумму более 300 000 руб. обязаны содержать назначенного куратора (менеджер_таб_номер FK).',
    { number: 2, position: { x: 1050, y: 700 } }
  );
}
