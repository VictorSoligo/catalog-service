import { DomainEvents } from '@/core/events/domain-events'
import { CategoriesRepository } from '@/domain/catalog/application/repositories/categories-repository'
import { Category } from '@/domain/catalog/enterprise/entities/category'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async findById(id: string) {
    const category = this.items.find((item) => {
      return item.id.toString() === id
    })

    if (!category) {
      return null
    }

    return category
  }

  async findByTitle(title: string, ownerId: string) {
    const category = this.items.find((item) => {
      return item.title === title && item.ownerId.toString() === ownerId
    })

    if (!category) {
      return null
    }

    return category
  }

  async findManyByOwnerId(ownerId: string) {
    const categories = this.items.filter((item) => {
      return item.ownerId.toString() === ownerId
    })

    return categories
  }

  async create(category: Category) {
    this.items.push(category)

    DomainEvents.dispatchEventsForAggregate(category.id)
  }

  async save(category: Category) {
    const itemIndex = this.items.findIndex((item) => {
      return item.id === category.id
    })

    this.items[itemIndex] = category

    DomainEvents.dispatchEventsForAggregate(category.id)
  }

  async delete(category: Category) {
    const itemIndex = this.items.findIndex((item) => {
      return item.id === category.id
    })

    this.items.splice(itemIndex, 1)

    DomainEvents.dispatchEventsForAggregate(category.id)
  }
}
