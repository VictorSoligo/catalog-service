import { Product } from '../../enterprise/entities/product'

export abstract class ProductsRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract findByTitle(title: string, ownerId: string): Promise<Product | null>
  abstract findManyByOwnerId(ownerId: string): Promise<Product[]>
  abstract create(product: Product): Promise<void>
  abstract save(product: Product): Promise<void>
  abstract delete(product: Product): Promise<void>
}
