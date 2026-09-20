import { IModelRepositoryPort } from '../../../../application/ports/outbound/IModelRepositoryPort';
import { IDEF1Model } from '../../../../domain/models/IDEF1Model';
import { Entity } from '../../../../domain/models/Entity';
import { Attribute } from '../../../../domain/models/Attribute';
import { Relationship } from '../../../../domain/models/Relationship';
import { CategorizationCluster } from '../../../../domain/models/Categorization';
import { Position } from '../../../../domain/models/Position';

export class InMemoryOrJsonRepository implements IModelRepositoryPort {
  private store: Map<string, string> = new Map();

  public async save(model: IDEF1Model): Promise<void> {
    const json = JSON.stringify(model.toJSON());
    this.store.set(model.id, json);
  }

  public async findById(id: string): Promise<IDEF1Model | null> {
    const json = this.store.get(id);
    if (!json) return null;

    const data = JSON.parse(json);
    const model = new IDEF1Model({ id: data.id, name: data.name });

    for (const entData of data.entities || []) {
      const attrs = (entData.attributes || []).map(
        (a: any) =>
          new Attribute(
            a.name,
            a.isPrimaryKey,
            a.isForeignKey,
            a.dataType,
            a.foreignKeyRef,
            a.roleName,
            a.isOptional
          )
      );
      const entity = new Entity({
        id: entData.id,
        name: entData.name,
        number: entData.number,
        isDependent: entData.isDependent,
        position: new Position(entData.position?.x ?? 0, entData.position?.y ?? 0),
        attributes: attrs,
      });
      model.addEntity(entity);
    }

    for (const relData of data.relationships || []) {
      const rel = new Relationship({
        id: relData.id,
        name: relData.name,
        parentEntityId: relData.parentEntityId,
        childEntityId: relData.childEntityId,
        type: relData.type,
        cardinality: relData.cardinality,
        cardinalityValue: relData.cardinalityValue,
        isOptional: relData.isOptional,
      });
      model.addRelationship(rel);
    }

    for (const catData of data.categorizations || []) {
      const cluster = new CategorizationCluster({
        id: catData.id,
        genericEntityId: catData.genericEntityId,
        discriminatorAttributeName: catData.discriminatorAttributeName,
        specificEntityIds: catData.specificEntityIds,
        isComplete: catData.isComplete,
      });
      model.addCategorization(cluster);
    }

    return model;
  }

  public async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
