import { describe, it, expect, vi } from 'vitest';
import { IDEF1Model } from '../src/domain/models/IDEF1Model';
import { IDEF1ApplicationService } from '../src/application/services/IDEF1ApplicationService';
import { InMemoryOrJsonRepository } from '../src/infrastructure/adapters/outbound/persistence/InMemoryOrJsonRepository';
import { SimpleEventPublisher } from '../src/infrastructure/events/SimpleEventPublisher';
import { IDiagramRendererPort } from '../src/application/ports/outbound/IDiagramRendererPort';
import { RelationshipType, Cardinality } from '../src/domain/models/Relationship';

describe('IDEF1 Application Service & Hexagonal Ports', () => {
  it('should interact through ports without coupling to GoJS', async () => {
    // Mock driven renderer port
    const mockRendererPort: IDiagramRendererPort = {
      initialize: vi.fn(),
      renderModel: vi.fn(),
      renderEntity: vi.fn(),
      removeEntity: vi.fn(),
      renderRelationship: vi.fn(),
      removeRelationship: vi.fn(),
      onEntityMoved: vi.fn(),
      onEntitySelected: vi.fn(),
      onRelationshipCreated: vi.fn(),
      onEntityDeleted: vi.fn(),
      makeSvg: vi.fn().mockReturnValue('<svg></svg>'),
      makeImageDataUrl: vi.fn().mockReturnValue('data:image/png;base64,...'),
      destroy: vi.fn(),
    };

    const repository = new InMemoryOrJsonRepository();
    const eventPublisher = new SimpleEventPublisher();
    const eventSpy = vi.fn();
    eventPublisher.subscribe('EntityCreated', eventSpy);

    const initialModel = new IDEF1Model({ id: 'app_model', name: 'App Test' });
    const appService = new IDEF1ApplicationService(
      initialModel,
      mockRendererPort,
      repository,
      eventPublisher
    );

    // Create entity via Inbound Port
    const customerId = await appService.createEntity({
      name: 'CUSTOMER',
      position: { x: 50, y: 50 },
    });

    expect(customerId).toBeDefined();
    expect(mockRendererPort.renderEntity).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledTimes(1);

    // Add PK attribute
    await appService.addAttribute({
      entityId: customerId,
      name: 'cust_id',
      isPrimaryKey: true,
      dataType: 'INTEGER',
    });

    // Create Order entity
    const orderId = await appService.createEntity({
      name: 'ORDER',
      position: { x: 250, y: 50 },
    });

    // Connect them with identifying relationship
    const relId = await appService.addRelationship({
      parentEntityId: customerId,
      childEntityId: orderId,
      name: 'places',
      type: RelationshipType.IDENTIFYING,
      cardinality: Cardinality.ZERO_OR_MORE,
    });

    expect(relId).toBeDefined();
    expect(mockRendererPort.renderRelationship).toHaveBeenCalled();

    // Verify Model DTO output
    const dto = appService.getModel();
    expect(dto.entities).toHaveLength(2);
    expect(dto.relationships).toHaveLength(1);

    // Verify persistence via Repository Port
    await appService.save();
    const loaded = await repository.findById('app_model');
    expect(loaded).toBeDefined();
    expect(loaded?.name).toBe('App Test');
    expect(loaded?.entities).toHaveLength(2);
  });

  it('should support JSON export and import round-trip', async () => {
    const initialModel = new IDEF1Model({ id: 'm1', name: 'Original' });
    const appService = new IDEF1ApplicationService(initialModel);

    const e1 = await appService.createEntity({ name: 'WAREHOUSE' });
    await appService.addAttribute({ entityId: e1, name: 'wh_id', isPrimaryKey: true });

    const json = appService.exportJson();
    expect(json).toContain('WAREHOUSE');
    expect(json).toContain('wh_id');

    // New service with empty model
    const newService = new IDEF1ApplicationService(new IDEF1Model({ id: 'm2', name: 'New' }));
    await newService.importJson(json);

    const reExportedDto = newService.getModel();
    expect(reExportedDto.entities).toHaveLength(1);
    expect(reExportedDto.entities[0].name).toBe('WAREHOUSE');
    expect(reExportedDto.entities[0].attributes[0].name).toBe('wh_id');
  });
});
