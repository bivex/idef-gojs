# Официальные спецификации стандартов IDEF Suite (IDEF0, IDEF1X, IDEF3, IDEF4)

В этой директории размещены официальные документы государственных и отраслевых стандартов (NIST / IEEE / KBSI):

- **[FIPS_PUB_183.pdf](./FIPS_PUB_183.pdf)** — **IDEF0**: Integration Definition for Function Modeling (Функциональное моделирование процессов, 4.67 МБ).
- **[FIPS_PUB_184.doc](./FIPS_PUB_184.doc)** — **IDEF1X**: Integration Definition for Information Modeling (Информационное моделирование данных, 823 КБ).
- **[FIPS_PUB_184.txt](./FIPS_PUB_184.txt)** — Текстовая версия стандарта FIPS 184 (304 КБ) для быстрой индексации и верификации правил.
- **[IDEF3_Report.pdf](./IDEF3_Report.pdf)** — **IDEF3**: Process Description Capture Method Report (KBSI / IICE, 1.8 МБ).
- **[IDEF4_Report.pdf](./IDEF4_Report.pdf)** — **IDEF4**: Object-Oriented Design Method Report (KBSI / IICE, 1.6 МБ).
- **[IDEF5_Report.pdf](./IDEF5_Report.pdf)** — **IDEF5**: Ontology Description Capture Method Report (KBSI / IICE, 1.4 МБ).
- **IDEF6**: Design Rationale Capture Method (KBSI / US Air Force / IICE) — фиксация обоснований архитектурных и инженерных решений ("ПОЧЕМУ" система спроектирована именно так).
- **IDEF8**: Human-System Interaction Design Method (KBSI / US Air Force / IICE) — проектирование взаимодействия человек-система, человеко-машинных интерфейсов (ЧМИ / HMI / SCADA) и диалоговых сценариев.

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

## 🌐 5. Стандарт IDEF5 (KBSI Report) — Онтологическое моделирование предметной области
- **Элементы онтологии (Ontology Schematic)**:
  - **Виды (Kinds)**: общие категории, типы или понятия реального мира (`⭘ ВИД`) со списком атрибутов/свойств.
  - **Индивиды (Individuals)**: конкретные физические сущности и экземпляры (`● ИНДИВИД`, пунктирная рамка).
  - **Свойства (Properties)**: типизированные атрибуты с ограничениями обязательности.
- **Онтологические отношения (Relations)**:
  - **Таксономия (subkind-of)**: отношение специализации/обобщения (подвид → надвид).
  - **Мереология (part-of)**: отношение включения составных частей (часть → целое, ромбовидный маркер).
  - **Экземпляр вида (instantiates)**: отношение от индивида к его понятию/виду (пунктирная стрелка).
  - **Отношения первого порядка (First-Order Relations)**: прикладные семантические связи (`изготавливается-из`, `обрабатывается-на`, `управляет-и-обслуживает`) с направленной стрелкой и бейджем имени.
- **Правила валидации**:
  - Запрет циклических иерархий в таксономических связях (`subkind-of`).
  - Контроль уникальности наименований видов.
  - Защита от висячих отношений.

---

## 🎯 6. Стандарт IDEF6 (KBSI / US Air Force) — Фиксация обоснований проектных решений (Design Rationale)
- **Концептуальные элементы обоснования (Rationale Graph)**:
  - **Вопросы (Issues)**: инженерные проблемы, архитектурные дилеммы или требования выбора (`? ВОПРОС`, статусы `OPEN`, `RESOLVED`, `REJECTED`).
  - **Альтернативы (Alternatives)**: предлагаемые варианты решений (`■ ВАРИАНТ`, статусы `PROPOSED`, `ACCEPTED`, `REJECTED`, `SUPERSEDED`).
  - **Критерии (Criteria)**: цели, ограничения и стандарты (`⬡ КРИТЕРИЙ`, типы `CONSTRAINT`, `GOAL`, `STANDARD`, вес `CRITICAL`, `IMPORTANT`).
  - **Аргументы (Arguments)**: экспертные доводы с силой аргументации (`▲ ЗА (PRO)` / `▼ ПРОТИВ (CON)`).
- **Обосновывающие связи (Rationale Links)**:
  - `responds-to`: альтернатива отвечает на инженерный вопрос.
  - `supports`: аргумент ЗА выбранную альтернативу (зеленый).
  - `objects-to`: аргумент ПРОТИВ альтернативы (красный пунктир).
  - `evaluates`: критерий оценивает применимость альтернативы (фиолетовый).
  - `resolves`: принятое и утвержденное решение вопроса (изумрудный жирный).
- **Правила валидации**:
  - Все решенные вопросы (`RESOLVED`) обязаны иметь ровно одну принятую альтернативу (`ACCEPTED`).
  - Защита от коллизий наименований вопросов и альтернатив.
  - Целостность графа (отсутствие висячих связей).

---

## 🖥️ 7. Стандарт IDEF8 (KBSI / US Air Force) — Проектирование взаимодействия человек-система (Human-System Interaction)
- **Концептуальные элементы интерфейса (Interaction Model)**:
  - **Экраны и окна (Screens / Dialogs)**: объекты взаимодействия (`DASHBOARD`, `CONTROL_PANEL`, `FORM`, `MODAL_DIALOG`, `REPORT_VIEW`) со списком виджетов (кнопки, индикаторы, датчики).
  - **Действия пользователя (User Actions)**: операции оператора над виджетами (`CLICK`, `INPUT_TEXT`, `TOUCH_GESTURE`, `HOTKEY`).
  - **Реакции системы (System Responses)**: отклики оборудования/ПО (`STATE_CHANGE`, `FEEDBACK_MESSAGE`, `ERROR_ALERT`, `DATA_UPDATE`).
  - **Роли пользователей (User Roles / Personas)**: категории пользователей с правами (`OPERATOR`, `SUPERVISOR`, `ENGINEER`, `ADMINISTRATOR`).
- **Связи взаимодействия (Interaction Links)**:
  - `navigates-to`: переход между экранами (синяя стрелка).
  - `triggers`: действие запускает реакцию системы (оранжевая стрелка).
  - `opens-modal`: открытие модального окна блокировки/аварии (красный пунктир).
  - `returns-to`: возврат из модального окна в рабочий экран (серый пунктир).
  - `performed-by`: действие закреплено за ролью (фиолетовый пунктир).
- **Правила валидации**:
  - Защита от тупиковых модальных окон (Modal Trap Detection: каждый модальный экран обязан иметь возврат).
  - Проверка необработанных действий пользователя (Unhandled Actions).
  - Контроль уникальности наименований экранов.

---

## 🔗 Соответствие кодовой базе репозитория

| Нотация | Раздел стандарта | Реализующий модуль в `src/` |
|---|---|---|
| **IDEF8** | Screens, User Actions, System Responses, User Roles | `src/idef8/domain/models/`, `src/idef8/infrastructure/adapters/outbound/gojs/templates/ScreenNodeTemplate.ts` |
| **IDEF8** | Interaction Links (navigates-to, triggers, opens-modal, returns-to, performed-by) | `src/idef8/domain/models/IDEF8Link.ts`, `src/idef8/infrastructure/adapters/outbound/gojs/templates/InteractionLinkTemplate.ts` |
| **IDEF8** | Interaction Rules (Modal Trap Detection, Unhandled Actions) | `src/idef8/domain/rules/IDEF8Rules.ts` |
| **IDEF9** | Constraints, Controlled Objects, Enforcement Mechanisms, Source Documents | `src/idef9/domain/models/`, `src/idef9/infrastructure/adapters/outbound/gojs/templates/ConstraintNodeTemplate.ts` |
| **IDEF9** | Constraint Links (constrains, enforced-by, derived-from, conflicts-with, supersedes) | `src/idef9/domain/models/IDEF9Link.ts`, `src/idef9/infrastructure/adapters/outbound/gojs/templates/ConstraintLinkTemplate.ts` |
| **IDEF9** | Constraint Rules (Mandatory Enforcement, Unattached Constraints, Duplicate Codes, Conflict Detection) | `src/idef9/domain/rules/IDEF9Rules.ts` |
| **IDEF6** | Issues, Alternatives, Criteria, Arguments | `src/idef6/domain/models/`, `src/idef6/infrastructure/adapters/outbound/gojs/templates/RationaleNodeTemplate.ts` |
| **IDEF6** | Rationale Links (responds-to, supports, objects-to, evaluates, resolves) | `src/idef6/domain/models/IDEF6Link.ts`, `src/idef6/infrastructure/adapters/outbound/gojs/templates/RationaleLinkTemplate.ts` |
| **IDEF6** | Rationale Rules (Resolution Integrity, Unique Names) | `src/idef6/domain/rules/IDEF6Rules.ts` |
| **IDEF5** | Kinds, Individuals, Properties | `src/idef5/domain/models/IDEF5Kind.ts`, `src/idef5/infrastructure/adapters/outbound/gojs/templates/KindNodeTemplate.ts` |
| **IDEF5** | Ontology Relations (subkind-of, part-of, instantiates, first-order) | `src/idef5/domain/models/IDEF5Relation.ts`, `src/idef5/infrastructure/adapters/outbound/gojs/templates/OntologyLinkTemplate.ts` |
| **IDEF5** | Ontology Rules (Taxonomy Cycle Detection, Unique Names) | `src/idef5/domain/rules/IDEF5Rules.ts` |
| **IDEF4** | Class & Members | `src/idef4/domain/models/IDEF4Class.ts`, `src/idef4/infrastructure/adapters/outbound/gojs/templates/ClassNodeTemplate.ts` |
| **IDEF4** | Relationships (Inheritance, Composition, Client-Server) | `src/idef4/domain/models/IDEF4Relationship.ts`, `src/idef4/infrastructure/adapters/outbound/gojs/templates/ClassLinkTemplate.ts` |
| **IDEF4** | Rules (Cycle Detection, Abstract Integrity) | `src/idef4/domain/rules/IDEF4Rules.ts` |
| **IDEF3** | UOB & Junctions (&, O, X) | `src/idef3/domain/models/UOB.ts`, `src/idef3/domain/models/Junction.ts` |
| **IDEF3** | Links (Precedence, Relational, Object Flow) | `src/idef3/domain/models/Link.ts` |
| **IDEF0** | Function Boxes & ICOM Ports | `src/idef0/domain/models/Activity.ts`, `src/idef0/domain/models/Arrow.ts` |
| **IDEF1X** | Entities, Attributes, Relationships | `src/domain/models/Entity.ts`, `src/domain/models/Relationship.ts` |

---

## 🔒 8. Стандарт IDEF9 — Business Rules & Constraints Capture Method (KBSI / US Air Force / IICE)

**IDEF9** — стандарт KBSI (Knowledge Based Systems Inc.) / US Air Force для формализованного описания **бизнес-правил, ограничений и регламентов**, которые управляют поведением предприятия и его процессов.

> «IDEF9 provides a method for identifying, analyzing, and stating the business rules that constrain the conduct of business activities.» — KBSI IICE Technical Report

### Основные концепции IDEF9:

| Концепция | Описание | Пример (ОАО «Металл-Авиа») |
|-----------|----------|---------------------------|
| **Ограничение (Constraint)** | Бизнес-правило с кодом CR-xx, текстовой формулировкой/математическим выражением, типом и степенью жёсткости | CR-01: T_закалки ∈ [1050°C, 1080°C] |
| **Объект управления (Controlled Object)** | Процесс, изделие, оборудование, ресурс или персонал, на который накладывается ограничение | Термообработка (Процесс), Лопатка ГТД (Изделие), ПАП-6 (Оборудование) |
| **Механизм исполнения (Enforcement Mechanism)** | Технический, программный или организационный механизм, обеспечивающий соблюдение ограничения | ПЛК Siemens S7-1500, MES Opcenter, ОТК (КИМ Zeiss), ЭЦП главного металлурга |
| **Нормативный документ (Source Document)** | Источник ограничения — ГОСТ, ОСТ, ФЗ, СТП, договор | ГОСТ Р 55892-2013, ОСТ 1 90218-76, ТК РФ ст.103 |

### Типы связей IDEF9:

| Тип связи | Семантика | Визуализация |
|-----------|-----------|--------------|
| **CONSTRAINS** | Ограничение накладывается на объект/процесс | 🔴 Красная сплошная |
| **ENFORCED_BY** | Ограничение обеспечивается механизмом | 🟢 Зелёная сплошная |
| **DERIVED_FROM** | Ограничение выведено из нормативного документа | 🟡 Янтарная пунктирная |
| **CONFLICTS_WITH** | Противоречие/конфликт между ограничениями | 🟣 Фиолетовая пунктирная |
| **SUPERSEDES** | Новое ограничение замещает устаревшее | ⬜ Серая пунктирная |

### Правила валидации IDEF9:
1. **MANDATORY без механизма**: строго обязательное ограничение (MANDATORY) без ENFORCED_BY → предупреждение `IDEF9_MANDATORY_WITHOUT_ENFORCEMENT`.
2. **Изолированное ограничение**: ограничение без ни одного CONSTRAINS-перехода → предупреждение `IDEF9_UNATTACHED_CONSTRAINT`.
3. **Дублирование кодов**: два ограничения с одинаковым кодом CR-xx → ошибка `IDEF9_DUPLICATE_CONSTRAINT_CODE`.
4. **Конфликт**: любая CONFLICTS_WITH-связь → предупреждение `IDEF9_ACTIVE_CONFLICT` (требует гармонизации).
5. **Разорванные связи**: link с несуществующим source/target → ошибка `IDEF9_DANGLING_LINK_SOURCE/TARGET`.

