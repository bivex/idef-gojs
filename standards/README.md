# Официальная спецификация стандарта IDEF1X (FIPS PUB 184)

В этой папке размещен полный официальный текст государственного стандарта США:

- **[FIPS_PUB_184.doc](./FIPS_PUB_184.doc)** — Полный официальный исходный документ стандарта National Institute of Standards and Technology (NIST) от 21 декабря 1993 года в формате Microsoft Word (со всеми встроенными графическими иллюстрациями нотации).
- **[FIPS_PUB_184.txt](./FIPS_PUB_184.txt)** — Полная текстовая версия стандарта (304 КБ) для быстрого поиска, индексации и верификации правил в коде.

---

## 📑 Оглавление стандарта FIPS PUB 184

### 1. Overview (Обзор)
- **1.1 Scope** — Область применения языка IDEF1X.
- **1.2 Purpose** — Назначение стандарта при моделировании данных и проектировании баз данных.

### 2. Definitions (Термины и определения)
- Полный глоссарий стандартизированных терминов: *Entity*, *Domain*, *Attribute*, *Identifying / Non-identifying Relationship*, *Categorization*, *Foreign Key Migration*, *Cardinality*, *Role Name*.

### 3. IDEF1X Syntax and Semantics (Синтаксис и семантика)
- **3.1 Entities**
  - Определение независимых (*Independent*) и зависимых (*Dependent*) сущностей.
  - Графический синтаксис: прямоугольник с прямыми углами vs скругленными углами.
  - Именование сущности и уникальный номер (`E/<number>`).
- **3.2 Domains**
  - Определение доменов значений атрибутов и базовых типов данных.
- **3.3 Views**
  - Контекст представления подмножества сущностей и связей.
- **3.4 Attributes**
  - Разделение атрибутов горизонтальной чертой на **Primary Key** (над линией) и **Non-Key** (под линией).
  - Правило уникальности имен атрибутов.
- **3.5 Connection Relationships**
  - **Identifying Relationships**: сплошная линия, дочерняя сущность обязана быть зависимой, PK мигрирует в PK потомка.
  - **Non-Identifying Relationships**: пунктирная линия, PK мигрирует в Non-Key.
  - **Optionality**: ромб (`Diamond`) со стороны родителя, если внешний ключ может принимать `NULL`.
  - **Cardinality**: мощности на дочернем конце (0, 1 или много — точка; 1 или много — точка с `P`; 0 или 1 — точка с `Z`; ровно N или диапазон).
  - Глагольные фразы (*Verb Phrases*).
- **3.6 Categorization Relationships (Подтипы / Subtypes)**
  - Родовая сущность (*Generic Entity*) и специфические сущности (*Specific Entities*).
  - Дискриминатор подтипа (*Discriminator*).
  - Неполная категоризация (*Incomplete*): кружок над одной чертой.
  - Полная категоризация (*Complete*): кружок над двумя параллельными чертами.
- **3.7 Non-Specific Relationships (Many-to-Many)**
  - Сплошная линия со сплошными кружками на обоих концах.
  - Применяется на концептуальном уровне до декомпозиции на ассоциативную сущность.
- **3.8 Primary and Alternate Keys**
  - Первичные (PK) и альтернативные (AK) ключи.
- **3.9 Foreign Keys & Role Names**
  - Правила миграции ключей (*Key Migration Rules*).
  - Ролевые имена (*Role Names*) при рекурсивных связях и для разрешения коллизий имён.
- **3.10 View Levels**
  - Уровни детализации диаграмм (ER-уровень, Key-уровень, Полный атрибутивный уровень).

---

## 🔗 Соответствие кодовой базе репозитория

| Раздел стандарта FIPS 184 | Реализующий модуль в `src/` |
|---|---|
| **§3.1 Entities** | `src/domain/models/Entity.ts`, `src/infrastructure/adapters/outbound/gojs/templates/EntityNodeTemplate.ts` |
| **§3.4 Attributes** | `src/domain/models/Attribute.ts` |
| **§3.5 Connection Relationships** | `src/domain/models/Relationship.ts`, `src/infrastructure/adapters/outbound/gojs/templates/RelationshipLinkTemplate.ts` |
| **§3.6 Categorization Relationships** | `src/domain/models/Categorization.ts`, `src/infrastructure/adapters/outbound/gojs/templates/SubtypeNodeTemplate.ts` |
| **§3.7 Non-Specific Relationships** | `RelationshipType.NON_SPECIFIC` в `Relationship.ts` |
| **§3.9 Foreign Key Migration & Rules** | `src/domain/models/IDEF1Model.ts`, `src/domain/rules/IDEF1Rules.ts` |
| **Notes & Constraints** | `src/infrastructure/adapters/outbound/gojs/templates/NoteNodeTemplate.ts` |
