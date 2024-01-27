import { DomainEvent } from '@/core/events/domain-event'
import { Category } from '../entities/category'

export class CatalogCategoriesUpdatedEvent implements DomainEvent {
  ocurredAt: Date
  category: Category
  ownerId: string

  constructor(category: Category) {
    this.ocurredAt = new Date()
    this.category = category
    this.ownerId = category.ownerId.toString()
  }

  getAggregateId() {
    return this.category.id
  }
}
