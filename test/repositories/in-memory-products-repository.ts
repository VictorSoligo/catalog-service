import { DomainEvents } from '@/core/events/domain-events'
import { ProductsRepository } from '@/domain/catalog/application/repositories/products-repository'
import { Product } from '@/domain/catalog/enterprise/entities/product'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async findById(id: string) {
    const product = this.items.find((item) => {
      return item.id.toString() === id
    })

    if (!product) {
      return null
    }

    return product
  }

  async findByTitle(title: string, ownerId: string) {
    const product = this.items.find((item) => {
      return item.title === title && item.ownerId.toString() === ownerId
    })

    if (!product) {
      return null
    }

    return product
  }

  async findManyByOwnerId(ownerId: string) {
    const products = this.items.filter((item) => {
      return item.ownerId.toString() === ownerId
    })

    return products
  }

  async create(product: Product) {
    this.items.push(product)

    DomainEvents.dispatchEventsForAggregate(product.id)
  }

  async save(product: Product) {
    const itemIndex = this.items.findIndex((item) => {
      return item.id === product.id
    })

    this.items[itemIndex] = product

    DomainEvents.dispatchEventsForAggregate(product.id)
  }

  async delete(product: Product) {
    const itemIndex = this.items.findIndex((item) => {
      return item.id === product.id
    })

    this.items.splice(itemIndex, 1)

    DomainEvents.dispatchEventsForAggregate(product.id)
  }
}
