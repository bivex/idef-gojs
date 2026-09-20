# Официальные спецификации стандартов IDEF Suite (IDEF0, IDEF1X, IDEF3, IDEF4)

В этой директории размещены официальные документы государственных и отраслевых стандартов (NIST / IEEE / KBSI):

- **[FIPS_PUB_183.pdf](./FIPS_PUB_183.pdf)** — **IDEF0**: Integration Definition for Function Modeling (Функциональное моделирование процессов, 4.67 МБ).
- **[FIPS_PUB_184.doc](./FIPS_PUB_184.doc)** — **IDEF1X**: Integration Definition for Information Modeling (Информационное моделирование данных, 823 КБ).
- **[FIPS_PUB_184.txt](./FIPS_PUB_184.txt)** — Текстовая версия стандарта FIPS 184 (304 КБ) для быстрой индексации и верификации правил.
- **[IDEF3_Report.pdf](./IDEF3_Report.pdf)** — **IDEF3**: Process Description Capture Method Report (KBSI / IICE, 1.8 МБ).
- **[IDEF4_Report.pdf](./IDEF4_Report.pdf)** — **IDEF4**: Object-Oriented Design Method Report (KBSI / IICE, 1.6 МБ).

---

## 📘 1. Стандарт IDEF0 (FIPS PUB 183) — Функциональное моделирование процессов
- **Функциональный блок**: 4 стороны ICOM (Input слева, Control сверху, Output справа, Mechanism снизу, Call вниз).
- **Правило 3-6 блоков**: на диаграмме декомпозиции от 3 до 6 блоков (на контекстной A-0 — строго 1 блок).
- **Диагональное доминирование**: ступенчатое расположение блоков.
- **Туннелирование**: скрытие стрелок на родительской или дочерней диаграмме `( )`.

---

## 📙 2. Стандарт IDEF1X (FIPS PUB 184) — Информационное моделирование данных
- **Сущности**: независимые (прямоугольные) и зависимые (со скругленными углами).
- **Атрибуты**: первичные ключи PK (над чертой) и неключевые атрибуты Non-Key (под чертой).
- **Связи**: идентифицирующие (сплошная линия), неидентифицирующие (пунктир), опциональные (ромб), N:M (точки на концах).
- **Категоризация**: полная (2 черты) и неполная (1 черта) категоризация подтипов.

---

## 📗 3. Стандарт IDEF3 (KBSI Report) — Описание технологических процессов
- **Блок действия (UOB)**: наименование операции, номер шага, код UOB# и метка декомпозиции.
- **Логические перекрестки (Junctions)**: `&` (AND), `O` (OR), `X` (XOR); синхронные (двойная полоса) и асинхронные (одинарная полоса); Fan-Out и Fan-In.
- **Связи**: предшествование (Precedence), относительные (Relational), поток объектов (двойная стрелка Object Flow).
- **Референты**: состояния деталей `[OBJECT_STATE]`, переходы `[GOTO]`, вызовы сценариев.

---

## 📐 4. Стандарт IDEF4 (KBSI Report) — Объектно-ориентированное проектирование
- **Классы (Class Submodel)**:
  - 3-секционная карточка: заголовок со стереотипом (`«interface»`, `{abstract}`), секция атрибутов, секция методов.
  - Модификаторы видимости: `+` (public), `#` (protected), `-` (private).
  - Поддержка статических полей (`static`) и параметров методов с возвращаемыми типами.
- **Отношения между классами**:
  - **Наследование (Inheritance / Generalization)**: сплошная линия с полым замкнутым треугольником к суперклассу.
  - **Композиция (Composition)**: закрашенный темный ромб на стороне контейнера-владельца.
  - **Агрегация (Aggregation)**: полый светлый ромб на стороне контейнера.
  - **Клиент-Сервер (Client-Server / Association)**: вызов методов с открытой стрелкой и аннотациями ролей/мощностей (`1`, `1..*`).
- **Правила верификации**:
  - Детекция циклических зависимостей в графе наследования.
  - Проверка запрета абстрактных методов в конкретных классах.
  - Контроль уникальности имен классов на диаграмме.

---

## 🔗 Соответствие кодовой базе репозитория

| Нотация | Раздел стандарта | Реализующий модуль в `src/` |
|---|---|---|
| **IDEF4** | Class & Members | `src/idef4/domain/models/IDEF4Class.ts`, `src/idef4/infrastructure/adapters/outbound/gojs/templates/ClassNodeTemplate.ts` |
| **IDEF4** | Relationships (Inheritance, Composition, Client-Server) | `src/idef4/domain/models/IDEF4Relationship.ts`, `src/idef4/infrastructure/adapters/outbound/gojs/templates/ClassLinkTemplate.ts` |
| **IDEF4** | Rules (Cycle Detection, Abstract Integrity) | `src/idef4/domain/rules/IDEF4Rules.ts` |
| **IDEF3** | UOB & Junctions (&, O, X) | `src/idef3/domain/models/UOB.ts`, `src/idef3/domain/models/Junction.ts` |
| **IDEF3** | Links (Precedence, Relational, Object Flow) | `src/idef3/domain/models/Link.ts` |
| **IDEF0** | Function Boxes & ICOM Ports | `src/idef0/domain/models/Activity.ts`, `src/idef0/domain/models/Arrow.ts` |
| **IDEF1X** | Entities, Attributes, Relationships | `src/domain/models/Entity.ts`, `src/domain/models/Relationship.ts` |
