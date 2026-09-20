# Официальные спецификации стандартов IDEF Suite (IDEF0, IDEF1X, IDEF3)

В этой директории размещены официальные документы государственных и международных стандартов (NIST / IEEE / KBSI):

- **[FIPS_PUB_183.pdf](./FIPS_PUB_183.pdf)** — **IDEF0**: Integration Definition for Function Modeling (Функциональное моделирование процессов, 4.67 МБ).
- **[FIPS_PUB_184.doc](./FIPS_PUB_184.doc)** — **IDEF1X**: Integration Definition for Information Modeling (Информационное моделирование данных, 823 КБ).
- **[FIPS_PUB_184.txt](./FIPS_PUB_184.txt)** — Текстовая версия стандарта FIPS 184 (304 КБ) для быстрой индексации и верификации правил.
- **[IDEF3_Report.pdf](./IDEF3_Report.pdf)** — **IDEF3**: Process Description Capture Method Report (KBSI / IICE, 1.8 МБ).

---

## 📘 1. Стандарт IDEF0 (FIPS PUB 183) — Функциональное моделирование процессов
- **Функциональный блок**: действие/функция (активная глагольная фраза), 4 стороны ICOM (Input, Control, Output, Mechanism).
- **Правило 3-6 блоков**: на диаграмме декомпозиции от 3 до 6 блоков (на контекстной A-0 — строго 1 блок).
- **Диагональное доминирование**: ступенчатое расположение блоков от левого верхнего к правому нижнему углу.
- **Туннелирование**: скрытие стрелок на родительской или дочерней диаграмме `( )`.

---

## 📙 2. Стандарт IDEF1X (FIPS PUB 184) — Информационное моделирование данных
- **Сущности**: независимые (прямоугольные) и зависимые (со скругленными углами).
- **Атрибуты**: первичные ключи PK (над чертой) и неключевые атрибуты Non-Key (под чертой).
- **Связи**:
  - Идентифицирующие (сплошная линия, миграция PK родителя в PK потомка).
  - Неидентифицирующие (пунктирная линия, миграция в Non-Key).
  - Опциональные (ромб со стороны родителя).
  - Связи N:M (точки на обоих концах).
  - Альтернативные уникальные ключи (AK1, AK2).
- **Категоризация**: родовая сущность, дискриминатор, полная (две черты) и неполная (одна черта) категоризация подтипов.

---

## 📗 3. Стандарт IDEF3 (KBSI Report) — Описание технологических процессов и сценариев
- **Единица работы / Действие (Unit of Behavior, UOB)**:
  - Прямоугольник, разделенный горизонтальной чертой.
  - Верхняя часть: наименование операции (глагольная фраза).
  - Нижняя левая часть: номер шага процесса (1, 2, 2.1).
  - Нижняя правая часть: идентификатор UOB# (UOB-1, UOB-101) и метка декомпозиции.
- **Логические перекрестки (Junctions)**:
  - **AND (&)**: одновременный запуск/слияние всех ветвей.
  - **OR (O)**: запуск/слияние одной или нескольких ветвей.
  - **XOR (X)**: исключающее ветвление (строго один исход).
  - **Синхронность**: одинарная вертикальная полоса (асинхронный), двойная вертикальная полоса (синхронный).
  - **Направление**: Fan-Out (разветвление) и Fan-In (слияние).
- **Типы связей (Links)**:
  - **Связь предшествования (Precedence)**: сплошная линия с одной стрелкой.
  - **Относительная связь (Relational)**: пунктирная линия со стрелкой и текстовой пометкой.
  - **Поток объектов (Object Flow)**: сплошная линия со сдвоенной стрелкой.
- **Референты (Referents)**:
  - Ссылки на состояние объекта `[Объект: Состояние]`, вызов другого сценария, безусловный переход `[GOTO: UOB]` или примечание.
- **Декомпозиция**:
  - Раскрытие сложного шага процесса в детальную вложенную процессную схему.

---

## 🔗 Соответствие кодовой базе репозитория

| Нотация | Раздел стандарта | Реализующий модуль в `src/` |
|---|---|---|
| **IDEF3** | UOB (Unit of Behavior) | `src/idef3/domain/models/UOB.ts`, `src/idef3/infrastructure/adapters/outbound/gojs/templates/UOBNodeTemplate.ts` |
| **IDEF3** | Junctions (&, O, X, Sync/Async) | `src/idef3/domain/models/Junction.ts`, `src/idef3/infrastructure/adapters/outbound/gojs/templates/JunctionNodeTemplate.ts` |
| **IDEF3** | Links (Precedence, Relational, Object Flow) | `src/idef3/domain/models/Link.ts`, `src/idef3/infrastructure/adapters/outbound/gojs/templates/ProcessLinkTemplate.ts` |
| **IDEF3** | Referents (Object States, GOTO, Scenarios) | `src/idef3/domain/models/Referent.ts`, `src/idef3/infrastructure/adapters/outbound/gojs/templates/ReferentNodeTemplate.ts` |
| **IDEF3** | Scenario Hierarchy & Decomposition | `src/idef3/domain/models/IDEF3Model.ts`, `src/idef3/domain/models/IDEF3Diagram.ts` |
| **IDEF3** | Rules & Flow Validation | `src/idef3/domain/rules/IDEF3Rules.ts` |
| **IDEF0** | Function Boxes & ICOM Ports | `src/idef0/domain/models/Activity.ts`, `src/idef0/infrastructure/adapters/outbound/gojs/templates/ActivityNodeTemplate.ts` |
| **IDEF0** | ICOM Arrows & Tunneling | `src/idef0/domain/models/Arrow.ts`, `src/idef0/infrastructure/adapters/outbound/gojs/templates/ArrowLinkTemplate.ts` |
| **IDEF0** | FIPS 183 Validation Rules | `src/idef0/domain/rules/IDEF0Rules.ts` |
| **IDEF1X** | Entities & Attributes | `src/domain/models/Entity.ts`, `src/domain/models/Attribute.ts` |
| **IDEF1X** | Identifying / Non-Identifying Relations | `src/domain/models/Relationship.ts`, `src/domain/rules/IDEF1Rules.ts` |
| **IDEF1X** | Categorization / Subtypes | `src/domain/models/Categorization.ts` |
