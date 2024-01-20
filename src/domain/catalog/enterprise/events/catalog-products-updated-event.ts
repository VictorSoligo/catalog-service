import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Product } from '../entities/product'

export class CatalogProductsUpdatedEvent implements DomainEvent {
  ocurredAt: Date
  product: Product
  ownerId: UniqueEntityID

  constructor(product: Product) {
    this.ocurredAt = new Date()
    this.product = product
    this.ownerId = product.ownerId
  }

  getAggregateId() {
    return this.product.id
  }
}
