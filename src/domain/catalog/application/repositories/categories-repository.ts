import { Category } from '../../enterprise/entities/category'

export abstract class CategoriesRepository {
  abstract findById(id: string): Promise<Category | null>
  abstract findByTitle(title: string, ownerId: string): Promise<Category | null>
  abstract create(categoty: Category): Promise<void>
  abstract save(categoty: Category): Promise<void>
  abstract delete(categoty: Category): Promise<void>
}
