# Официальные спецификации стандартов IDEF (FIPS PUB 183 & FIPS PUB 184)

В этой директории размещены официальные документы государственных стандартов США (National Institute of Standards and Technology - NIST / IEEE):

- **[FIPS_PUB_183.pdf](./FIPS_PUB_183.pdf)** — **IDEF0**: Integration Definition for Function Modeling (Функциональное моделирование процессов, 4.67 МБ).
- **[FIPS_PUB_184.doc](./FIPS_PUB_184.doc)** — **IDEF1X**: Integration Definition for Information Modeling (Информационное моделирование данных, 823 КБ).
- **[FIPS_PUB_184.txt](./FIPS_PUB_184.txt)** — Полная текстовая версия стандарта FIPS 184 (304 КБ) для индексации и верификации правил.

---

## 📘 1. Стандарт IDEF0 (FIPS PUB 183) — Функциональное моделирование

### Ключевые положения нотации:
1. **Функциональный блок (Activity Box)**:
   - Прямоугольник, представляющий действие, процесс или функцию предприятия.
   - Имя формулируется в виде **активной глагольной фразы** (Active Verb Phrase).
   - В правом нижнем углу — номер детализации блока (от `1` до `6`).
   - Под блоком — код родительского контекста (например, `A0`, `A1`, `A2.1`).
   - Индикатор декомпозиции (D-number) при наличии дочерней диаграммы.
2. **Семантика стрелок ICOM**:
   - **Input (Вход, I)**: Стрелки входят в блок с **ЛЕВОЙ** стороны. Преобразуются функцией в выход.
   - **Control (Управление, C)**: Стрелки входят в блок с **ВЕРХНЕЙ** стороны. Регламентируют, управляют или ограничивают выполнение функции (стандарты, регламенты, планы).
   - **Output (Выход, O)**: Стрелки выходят из блока с **ПРАВОЙ** стороны. Результат выполнения функции.
   - **Mechanism (Механизм, M)**: Стрелки входят в блок с **НИЖНЕЙ** стороны. Ресурсы для исполнения (персонал, станки, ПО).
   - **Call (Вызов)**: Стрелки выходят из блока **СНИЗУ** и направлены вниз. Ссылка на другую модель или внешнюю подсистему.
3. **Правило 3-6 блоков (§3.3.2)**:
   - Каждая диаграмма декомпозиции должна содержать от **3 до 6** функциональных блоков.
   - Исключение: контекстная диаграмма верхнего уровня **A-0**, содержащая ровно **1** блок **A0**.
4. **Диагональное доминирование (Diagonal Dominance)**:
   - Блоки располагаются по диагонали сверху-вниз слева-направо в порядке их системного приоритета и потока управления.
5. **Туннелирование стрелок (Tunneling, §3.4)**:
   - Обозначается круглыми скобками `( )` у начала или конца стрелки.
   - Туннель у источника (`AT_SOURCE`): стрелка не отображается на родительской диаграмме, а возникает на дочерней.
   - Туннель у цели (`AT_TARGET`): стрелка с родительской диаграммы не переносится в дочернюю декомпозицию.

---

## 📙 2. Стандарт IDEF1X (FIPS PUB 184) — Информационное моделирование данных

### Ключевые положения нотации:
- **§3.1 Entities**: Независимые (прямоугольные) и зависимые (со скругленными углами) сущности.
- **§3.4 Attributes**: Разделение на Primary Key (над чертой) и Non-Key (под чертой).
- **§3.5 Connection Relationships**:
  - Identifying: сплошная линия, дочерняя зависима, PK мигрирует в PK потомка.
  - Non-identifying: пунктирная линия, PK мигрирует в Non-Key.
  - Опциональность: ромб (`Diamond`) на стороне родителя при Nullable FK.
  - Мощности: точка (0..*), точка с P (1..*), точка с Z (0..1), диапазон.
- **§3.6 Categorization (Подтипы)**: Родовая сущность, дискриминатор, полная (две черты) и неполная (одна черта) категоризация.
- **§3.7 Non-Specific (N:M)**: Сплошная линия со сплошными кружками на обоих концах.
- **§3.9 Foreign Key Migration & Role Names**: Автоматическая миграция ключей и ролевые имена при рекурсивных связях.

---

## 🔗 Соответствие кодовой базе репозитория

| Стандарт | Раздел | Реализующий модуль в репозитории |
|---|---|---|
| **IDEF0** | Activity & ICOM Ports | `src/idef0/domain/models/Activity.ts`, `src/idef0/infrastructure/adapters/outbound/gojs/templates/ActivityNodeTemplate.ts` |
| **IDEF0** | ICOM Arrows & Tunneling | `src/idef0/domain/models/Arrow.ts`, `src/idef0/infrastructure/adapters/outbound/gojs/templates/ArrowLinkTemplate.ts` |
| **IDEF0** | Hierarchy & Decomposition | `src/idef0/domain/models/IDEF0Model.ts`, `src/idef0/domain/models/IDEF0Diagram.ts` |
| **IDEF0** | FIPS 183 Rules (3-6 boxes, DAG) | `src/idef0/domain/rules/IDEF0Rules.ts` |
| **IDEF0** | Diagonal Layout Engine | `src/idef0/infrastructure/adapters/outbound/gojs/GoJSIDEF0Adapter.ts` |
| **IDEF1X** | Entities & Attributes | `src/domain/models/Entity.ts`, `src/domain/models/Attribute.ts` |
| **IDEF1X** | Relationships & Migration | `src/domain/models/Relationship.ts`, `src/domain/rules/IDEF1Rules.ts` |
| **IDEF1X** | Categorization / Subtypes | `src/domain/models/Categorization.ts` |
