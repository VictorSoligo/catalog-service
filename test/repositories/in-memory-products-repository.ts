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

  async create(product: Product) {
    this.items.push(product)
  }

  async save(product: Product) {
    const itemIndex = this.items.findIndex((item) => {
      return item.id === product.id
    })

    this.items[itemIndex] = product
  }

  async delete(product: Product) {
    const itemIndex = this.items.findIndex((item) => {
      return item.id === product.id
    })

    this.items.splice(itemIndex, 1)
  }
}
