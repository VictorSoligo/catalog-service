import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Category } from '../entities/category'

export class CatalogCategoriesUpdatedEvent implements DomainEvent {
  ocurredAt: Date
  category: Category
  ownerId: UniqueEntityID

  constructor(category: Category) {
    this.ocurredAt = new Date()
    this.category = category
    this.ownerId = category.ownerId
  }

  getAggregateId() {
    return this.category.id
  }
}
