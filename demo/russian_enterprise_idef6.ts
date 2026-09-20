import { IDEF6Editor } from '../src/idef6/infrastructure/adapters/inbound/IDEF6Editor';
import { IssueStatus, IssuePriority } from '../src/idef6/domain/models/IDEF6Issue';
import { AlternativeStatus } from '../src/idef6/domain/models/IDEF6Alternative';
import { CriterionType, CriterionWeight } from '../src/idef6/domain/models/IDEF6Criterion';
import { ArgumentType, ArgumentStrength } from '../src/idef6/domain/models/IDEF6Argument';
import { RationaleLinkType } from '../src/idef6/domain/models/IDEF6Link';

/**
 * Creates and loads an architecture decision rationale model for a Russian industrial enterprise
 * (АСУ ТП / MES цифрового машиностроительного завода) in accordance with the KBSI IDEF6 standard.
 * Captures Issues (Вопросы), Alternatives (Варианты решений), Criteria (Критерии/Ограничения),
 * Arguments (Аргументы ЗА/ПРОТИВ) and justification links.
 */
export function loadRussianEnterpriseIDEF6Demo(editor: IDEF6Editor): void {
  editor.createModel(
    'enterprise-rationale-01',
    'Обоснование архитектуры АСУ ТП и MES цифрового завода (KBSI IDEF6 Design Rationale)'
  );

  // ==========================================
  // ISSUE 1: Брокер сообщений для станков с ЧПУ и SCADA
  // ==========================================
  const issue1 = editor.addIssue({
    name: 'Выбор брокера телеметрии станочного парка ЧПУ и АСУ ТП',
    description: 'Определение базовой шины обмена сообщениями телеметрии между 120 станками ЧПУ, робототехническими ячейками и MES-системой',
    status: IssueStatus.RESOLVED,
    priority: IssuePriority.HIGH,
    x: 80,
    y: 160,
  });

  // Alternatives for Issue 1
  const altKafka = editor.addAlternative({
    name: 'Apache Kafka + Strimzi (Kubernetes)',
    description: 'Распределенный персистентный лог событий с высокой пропускной способностью и долгосрочным буфером сообщений',
    status: AlternativeStatus.ACCEPTED,
    x: 360,
    y: 90,
  });

  const altRabbitMQ = editor.addAlternative({
    name: 'RabbitMQ (AMQP / Quorum Queues)',
    description: 'Традиционный брокер очередей сообщений с развитой маршрутизацией по темам',
    status: AlternativeStatus.REJECTED,
    x: 360,
    y: 220,
  });

  const altEMQX = editor.addAlternative({
    name: 'EMQX Enterprise (MQTT / Sparkplug B)',
    description: 'Специализированный распределенный MQTT-брокер промышленного класса для IoT/IIoT',
    status: AlternativeStatus.SUPERSEDED,
    x: 360,
    y: 350,
  });

  // Criteria for Issue 1
  const critThroughput = editor.addCriterion({
    name: 'Пропускная способность >= 150k msg/sec',
    description: 'Станки с ЧПУ передают показания датчиков вибрации и температур с частотой 100 Гц',
    type: CriterionType.GOAL,
    weight: CriterionWeight.CRITICAL,
    x: 640,
    y: 50,
  });

  const critReliability = editor.addCriterion({
    name: 'Гарантия сохранности телеметрии при сетевых сбоях цеха',
    description: 'Возможность локального накопления и повторного чтения истории (replay log)',
    type: CriterionType.CONSTRAINT,
    weight: CriterionWeight.CRITICAL,
    x: 640,
    y: 150,
  });

  const critLatency = editor.addCriterion({
    name: 'Задержка доставки сигнала аварии < 15 мс',
    description: 'Критично для автоматического отключения подачи при заклинивании шпинделя',
    type: CriterionType.CONSTRAINT,
    weight: CriterionWeight.IMPORTANT,
    x: 640,
    y: 250,
  });

  // Arguments for Issue 1
  const argKafkaPro1 = editor.addArgument({
    name: 'Горизонтальное масштабирование и replay логов до 30 дней без деградации',
    type: ArgumentType.PRO,
    strength: ArgumentStrength.STRONG,
    description: 'Партиционирование по ID станка обеспечивает линейное масштабирование при расширении производства',
    x: 940,
    y: 70,
  });

  const argKafkaCon1 = editor.addArgument({
    name: 'Высокие накладные расходы на администрирование кластера KRaft',
    type: ArgumentType.CON,
    strength: ArgumentStrength.MEDIUM,
    description: 'Требуются выделенные узлы под брокеры и контроллеры кластера',
    x: 940,
    y: 140,
  });

  const argRabbitCon1 = editor.addArgument({
    name: 'Резкая деградация производительности при накоплении миллионов сообщений в очереди',
    type: ArgumentType.CON,
    strength: ArgumentStrength.STRONG,
    description: 'RabbitMQ проектировался для быстрого опустошения очередей, а не длительного архивного лога',
    x: 940,
    y: 220,
  });

  const argEMQXPro1 = editor.addArgument({
    name: 'Нативная поддержка промышленного протокола Sparkplug B для OPC UA шлюзов',
    type: ArgumentType.PRO,
    strength: ArgumentStrength.STRONG,
    description: 'Легковесное подключение микроконтроллеров и контроллеров Siemens S7 / ОВЕН',
    x: 940,
    y: 330,
  });

  // Links for Issue 1
  // Alternatives respond to Issue
  editor.addLink({
    sourceId: altKafka.id,
    targetId: issue1.id,
    type: RationaleLinkType.RESPONDS_TO,
    label: 'Предлагаемое решение',
  });
  editor.addLink({
    sourceId: altRabbitMQ.id,
    targetId: issue1.id,
    type: RationaleLinkType.RESPONDS_TO,
    label: 'Альтернатива',
  });
  editor.addLink({
    sourceId: altEMQX.id,
    targetId: issue1.id,
    type: RationaleLinkType.RESPONDS_TO,
    label: 'IoT-вариант',
  });

  // Kafka resolves Issue
  editor.addLink({
    sourceId: altKafka.id,
    targetId: issue1.id,
    type: RationaleLinkType.RESOLVES,
    label: 'Утверждено техкомитетом',
  });

  // Criteria evaluate Alternatives
  editor.addLink({
    sourceId: critThroughput.id,
    targetId: altKafka.id,
    type: RationaleLinkType.EVALUATES,
    label: 'Оценивает пропускную способность',
  });
  editor.addLink({
    sourceId: critReliability.id,
    targetId: altKafka.id,
    type: RationaleLinkType.EVALUATES,
    label: 'Оценивает персистентность',
  });
  editor.addLink({
    sourceId: critLatency.id,
    targetId: altRabbitMQ.id,
    type: RationaleLinkType.EVALUATES,
    label: 'Оценивает latency',
  });

  // Arguments support / object to Alternatives
  editor.addLink({
    sourceId: argKafkaPro1.id,
    targetId: altKafka.id,
    type: RationaleLinkType.SUPPORTS,
    label: 'ЗА (Масштабируемость)',
  });
  editor.addLink({
    sourceId: argKafkaCon1.id,
    targetId: altKafka.id,
    type: RationaleLinkType.OBJECTS_TO,
    label: 'ПРОТИВ (Сложность)',
  });
  editor.addLink({
    sourceId: argRabbitCon1.id,
    targetId: altRabbitMQ.id,
    type: RationaleLinkType.OBJECTS_TO,
    label: 'ПРОТИВ (Очереди)',
  });
  editor.addLink({
    sourceId: argEMQXPro1.id,
    targetId: altEMQX.id,
    type: RationaleLinkType.SUPPORTS,
    label: 'ЗА (Sparkplug B)',
  });

  // ==========================================
  // ISSUE 2: СУБД временных рядов (Time-Series) для архива технологических параметров
  // ==========================================
  const issue2 = editor.addIssue({
    name: 'Выбор базы данных временных рядов (TSDB) для телеметрии и анализа брака',
    description: 'Архивирование 50 000 тегов АСУ ТП, расчет трендов износа резцов и предиктивной аналитики OEE',
    status: IssueStatus.RESOLVED,
    priority: IssuePriority.HIGH,
    x: 80,
    y: 520,
  });

  // Alternatives for Issue 2
  const altTimescale = editor.addAlternative({
    name: 'TimescaleDB (PostgreSQL + Hypertables)',
    description: 'Реляционная СУБД с расширением временных рядов, полным SQL и сжатием чанков',
    status: AlternativeStatus.ACCEPTED,
    x: 360,
    y: 470,
  });

  const altInfluxDB = editor.addAlternative({
    name: 'InfluxDB 3.0 (Apache Arrow / DataFusion)',
    description: 'Специализированная колоночная база временных рядов',
    status: AlternativeStatus.REJECTED,
    x: 360,
    y: 590,
  });

  const altClickHouse = editor.addAlternative({
    name: 'ClickHouse (MergeTree Engine)',
    description: 'Сверхбыстрая аналитическая колоночная СУБД для агрегации огромных массивов телеметрии',
    status: AlternativeStatus.PROPOSED,
    x: 360,
    y: 710,
  });

  // Criteria for Issue 2
  const critSQL = editor.addCriterion({
    name: 'Стандартный SQL и JOIN со справочниками ERP 1С:УПП/ERP',
    description: 'Возможность связывать технологические тренды со сменами, рабочими центрами и номерами партий',
    type: CriterionType.GOAL,
    weight: CriterionWeight.CRITICAL,
    x: 640,
    y: 450,
  });

  const critCompression = editor.addCriterion({
    name: 'Сжатие архивных данных >= 90%',
    description: 'Хранение 2 лет непрерывных измерений в пределах 12 ТБ дискового пространства SAN-массива',
    type: CriterionType.CONSTRAINT,
    weight: CriterionWeight.IMPORTANT,
    x: 640,
    y: 570,
  });

  // Arguments for Issue 2
  const argTimescalePro1 = editor.addArgument({
    name: '100% совместимость с PostgreSQL: сложные оконные функции и JOIN с таблицами MES/1C',
    type: ArgumentType.PRO,
    strength: ArgumentStrength.STRONG,
    description: 'Инженеры и аналитики используют привычный SQL без переобучения',
    x: 940,
    y: 450,
  });

  const argTimescalePro2 = editor.addArgument({
    name: 'Автоматическое сжатие гипертаблиц по времени и фоновые политики непрерывной агрегации',
    type: ArgumentType.PRO,
    strength: ArgumentStrength.STRONG,
    description: 'Коэффициент сжатия до 93% на промышленных временных рядах',
    x: 940,
    y: 520,
  });

  const argInfluxCon1 = editor.addArgument({
    name: 'Сложность прямого JOIN с реляционными базами данных 1C/ERP и специфичный язык Flux',
    type: ArgumentType.CON,
    strength: ArgumentStrength.STRONG,
    description: 'Потребует создания промежуточных ETL-пайплайнов и синхронизации справочников',
    x: 940,
    y: 600,
  });

  const argClickHousePro1 = editor.addArgument({
    name: 'Рекордная скорость сканирования миллиардов строк при расчете квартальных метрик OEE',
    type: ArgumentType.PRO,
    strength: ArgumentStrength.STRONG,
    description: 'Векторизованное исполнение запросов опережает классические СУБД в 10-50 раз',
    x: 940,
    y: 690,
  });

  // Links for Issue 2
  editor.addLink({
    sourceId: altTimescale.id,
    targetId: issue2.id,
    type: RationaleLinkType.RESPONDS_TO,
    label: 'Основной кандидат',
  });
  editor.addLink({
    sourceId: altInfluxDB.id,
    targetId: issue2.id,
    type: RationaleLinkType.RESPONDS_TO,
    label: 'TSDB кандидат',
  });
  editor.addLink({
    sourceId: altClickHouse.id,
    targetId: issue2.id,
    type: RationaleLinkType.RESPONDS_TO,
    label: 'OLAP кандидат',
  });

  editor.addLink({
    sourceId: altTimescale.id,
    targetId: issue2.id,
    type: RationaleLinkType.RESOLVES,
    label: 'Принято архитектурным советом',
  });

  editor.addLink({
    sourceId: critSQL.id,
    targetId: altTimescale.id,
    type: RationaleLinkType.EVALUATES,
    label: 'Оценивает реляционные связи',
  });
  editor.addLink({
    sourceId: critCompression.id,
    targetId: altTimescale.id,
    type: RationaleLinkType.EVALUATES,
    label: 'Оценивает сжатие',
  });

  editor.addLink({
    sourceId: argTimescalePro1.id,
    targetId: altTimescale.id,
    type: RationaleLinkType.SUPPORTS,
    label: 'ЗА (SQL & 1C)',
  });
  editor.addLink({
    sourceId: argTimescalePro2.id,
    targetId: altTimescale.id,
    type: RationaleLinkType.SUPPORTS,
    label: 'ЗА (Сжатие 93%)',
  });
  editor.addLink({
    sourceId: argInfluxCon1.id,
    targetId: altInfluxDB.id,
    type: RationaleLinkType.OBJECTS_TO,
    label: 'ПРОТИВ (Изолированность)',
  });
  editor.addLink({
    sourceId: argClickHousePro1.id,
    targetId: altClickHouse.id,
    type: RationaleLinkType.SUPPORTS,
    label: 'ЗА (Скорость OLAP)',
  });
}
