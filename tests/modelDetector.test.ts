import { describe, it, expect } from 'bun:test';
import { detectAndNormalizeIDEFModel } from '../src/shared/domain/modelDetector';

describe('Universal IDEF Model Auto-Detector', () => {
  it('should auto-detect embedded IDEF10 architecture in complex project config', async () => {
    const jsonStr = await Bun.file('tang_nano_4k_smart_home_edge_guard.json').text();
    const result = detectAndNormalizeIDEFModel(jsonStr);

    expect(result.standard).toBe('idef10');
    expect(result.standardTitle).toContain('IDEF10');
    expect(result.modelObject.diagrams).toBeDefined();
    expect(result.modelObject.diagrams.length).toBeGreaterThanOrEqual(1);
    expect(result.modelObject.diagrams[0].executionNodes.length).toBe(4);
    expect(result.modelObject.diagrams[0].components.length).toBe(5);
  });

  it('should auto-detect IDEF12 organization model JSON', () => {
    const idef12Data = {
      id: 'model-org-test',
      name: 'Тестовая оргструктура',
      diagrams: [
        {
          id: 'diag-1',
          name: 'Дирекция',
          orgUnits: [{ id: 'u1', code: 'OU-1', name: 'Отдел АСУ' }],
          positions: [{ id: 'p1', code: 'POS-1', name: 'Главный инженер' }],
          roles: [{ id: 'r1', code: 'ROL-1', name: 'Ответственный за безопасность' }],
          competencies: [{ id: 'c1', code: 'CMP-1', name: 'Допуск к ЭУ' }],
          links: [],
        },
      ],
    };

    const result = detectAndNormalizeIDEFModel(idef12Data);
    expect(result.standard).toBe('idef12');
    expect(result.modelObject.diagrams[0].orgUnits.length).toBe(1);
  });

  it('should auto-detect single IDEF0 diagram and wrap into model', () => {
    const idef0Data = {
      nodeNumber: 'A0',
      title: 'Управление производством',
      activities: [
        { id: 'act1', name: 'Закупка сырья', nodeNumber: 'A1' },
      ],
      arrows: [],
    };

    const result = detectAndNormalizeIDEFModel(idef0Data);
    expect(result.standard).toBe('idef0');
    expect(result.modelObject.diagrams.length).toBe(1);
    expect(result.modelObject.diagrams[0].activities.length).toBe(1);
  });

  it('should throw informative error on unknown JSON structure', () => {
    const randomJson = { foo: 'bar', count: 42 };
    expect(() => detectAndNormalizeIDEFModel(randomJson)).toThrow('Не удалось автоматически распознать');
  });
});
