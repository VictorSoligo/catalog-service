import { DomainEvent } from '@/core/events/domain-event'
import { Product } from '../entities/product'

export class CatalogProductsUpdatedEvent implements DomainEvent {
  ocurredAt: Date
  product: Product
  ownerId: string

  constructor(product: Product) {
    this.ocurredAt = new Date()
    this.product = product
    this.ownerId = product.ownerId.toString()
  }

  getAggregateId() {
    return this.product.id
  }
}
