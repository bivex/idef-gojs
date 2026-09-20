# IDEF1 / IDEF1X GoJS Diagram Engine (DDD-HEX Architecture)

Профессиональная библиотека для информационного моделирования по стандарту **IDEF1 / IDEF1X** на базе **GoJS**, спроектированная в строгом соответствии с принципами **Domain-Driven Design (DDD)** и **Hexagonal Architecture (Ports and Adapters)**.

---

## 🏛 Архитектура DDD-HEX (Ports & Adapters)

Библиотека разделена на независимые слои с направлением зависимостей снаружи внутрь:

```
src/
├── domain/                      # DOMAIN LAYER (Чистый TS, 0 внешних библиотек)
│   ├── models/                  # Сущности, Value Objects, Aggregate Root
│   │   ├── Position.ts          # Value Object: (x, y)
│   │   ├── Attribute.ts         # Value Object: PK, FK, тип данных, роль
│   │   ├── Entity.ts            # Entity: Independent vs Dependent (скругленные углы)
│   │   ├── Relationship.ts      # Relationship: Identifying vs Non-Identifying, Cardinality
│   │   ├── Categorization.ts    # Subtype Cluster: Полная/Неполная категоризация
│   │   └── IDEF1Model.ts        # AGGREGATE ROOT: Инварианты, миграция ключей (FK)
│   ├── events/                  # Domain Events (EntityCreated, RelationshipAdded, ...)
│   ├── rules/                   # Правила IDEF1X (отсутствие циклов, миграция ключей)
│   └── errors/                  # Доменные исключения
│
├── application/                 # APPLICATION LAYER (Варианты использования и Порты)
│   ├── ports/
│   │   ├── inbound/             # Driving Ports (IIDEF1EditorUseCase)
│   │   └── outbound/            # Driven Ports (IDiagramRendererPort, IModelRepositoryPort, ...)
│   ├── services/                # Application Service: оркестрация команд и адаптеров
│   └── dtos/                    # ModelDTO, EntityDTO, AttributeDTO
│
└── infrastructure/              # INFRASTRUCTURE LAYER (Адаптеры)
    ├── adapters/
    │   ├── inbound/
    │   │   └── IDEF1Editor.ts   # Фасад для потребителей библиотеки
    │   └── outbound/
    │       ├── gojs/            # Адаптер GoJS (шаблоны узлов/связей IDEF1X)
    │       │   ├── GoJSDiagramAdapter.ts
    │       │   └── templates/   # Node / Link / Subtype templates
    │       └── persistence/     # Репозиторий хранения моделей (In-memory / JSON)
    └── events/
        └── SimpleEventPublisher.ts # Шина доменных событий
```

---

## 📐 Соответствие стандарту IDEF1 / IDEF1X

1. **Сущности (Entities)**:
   - **Независимая сущность (Independent Entity)**: отображается прямоугольником с **прямыми углами**.
   - **Зависимая сущность (Dependent Entity)**: отображается прямоугольником со **скругленными углами**.
   - Верхняя секция: имя сущности и номер (`E/1`, `E/2`...).
   - Горизонтальная черта-разделитель.
   - **Primary Key (PK)**: атрибуты первичного ключа отображаются выше разделительной линии.
   - **Non-Key Attributes**: неключевые атрибуты отображаются ниже разделительной линии.
   - Обозначение `(FK)` при миграции внешних ключей.

2. **Отношения (Relationships)**:
   - **Идентифицирующее (Identifying Relationship)**: **сплошная линия**. Дочерняя сущность автоматически становится зависимой (скругленные углы), а PK родителя мигрирует в состав PK дочерней сущности.
   - **Неидентифицирующее (Non-Identifying Relationship)**: **пунктирная (штриховая) линия**. PK родителя мигрирует в неключевые атрибуты потомка.
   - **Мощность (Cardinality)** на стороне потомка:
     - `ZERO_OR_MORE`: черный кружок (dot).
     - `ONE_OR_MORE`: черный кружок с буквой **P** (Positive).
     - `ZERO_OR_ONE`: черный кружок с буквой **Z** (Zero or one).
     - `EXACTLY_N` / `SPECIFIC_RANGE`: кружок с числом или диапазоном.
   - **Опциональность**: для неидентифицирующих связей ромб со стороны родителя.

3. **Категоризация / Подтипы (Subtypes)**:
   - Узел-кружок с дискриминатором.
   - Одинарная черта снизу для неполной категоризации.
   - Двойная черта снизу для полной категоризации.

---

## 🚀 Быстрый старт

### Установка

```bash
npm install idef-gojs gojs
```

### Использование

```typescript
import { IDEF1Editor, RelationshipType, Cardinality } from 'idef-gojs';

// 1. Создаем фасад редактора и монтируем в контейнер
const editor = new IDEF1Editor({
  container: document.getElementById('diagramDiv')!,
  modelName: 'Corporate Database Model',
});

// 2. Создаем независимую сущность DEPARTMENT (прямые углы)
const deptId = await editor.addEntity('DEPARTMENT', {
  isDependent: false,
  position: { x: 100, y: 100 },
  primaryKeys: [{ name: 'dept_no', dataType: 'CHAR(4)' }],
  nonKeys: [{ name: 'dept_name', dataType: 'VARCHAR(50)' }],
});

// 3. Создаем сущность EMPLOYEE
const empId = await editor.addEntity('EMPLOYEE', {
  position: { x: 450, y: 100 },
  primaryKeys: [{ name: 'emp_no', dataType: 'INTEGER' }],
  nonKeys: [{ name: 'full_name', dataType: 'VARCHAR(100)' }],
});

// 4. Связываем неидентифицирующим отношением (пунктирная линия)
// PK родителя (dept_no) автоматически мигрирует в EMPLOYEE как неключевой FK!
await editor.addRelationship(deptId, empId, {
  name: 'employs',
  type: RelationshipType.NON_IDENTIFYING,
  cardinality: Cardinality.ZERO_OR_MORE,
});

// 5. Создаем дочернюю зависимую сущность PROJECT_ASSIGNMENT
const assignId = await editor.addEntity('PROJECT_ASSIGNMENT', {
  position: { x: 450, y: 350 },
  primaryKeys: [{ name: 'assignment_id', dataType: 'INTEGER' }],
});

// 6. Связываем идентифицирующим отношением (сплошная линия)
// Дочерняя сущность становится зависимой (скругленные углы), а emp_no мигрирует в PK!
await editor.addRelationship(empId, assignId, {
  name: 'assigned to',
  type: RelationshipType.IDENTIFYING,
  cardinality: Cardinality.ONE_OR_MORE, // Маркер кружка с 'P'
});

// 7. Экспорт в JSON или SVG
const jsonString = editor.exportJson();
const svgString = editor.exportSvg();
```

---

## 🧪 Запуск тестов и сборки

```bash
# Запуск unit-тестов
npm test

# Сборка библиотеки (ESM, CJS, UMD и типы .d.ts)
npm run build

# Запуск интерактивного demo-стенда
npm run dev
```
