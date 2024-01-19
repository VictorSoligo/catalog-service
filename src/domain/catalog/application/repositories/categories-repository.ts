import { Category } from '../../enterprise/entities/category'

export abstract class CategoriesRepository {
  abstract findById(id: string): Promise<Category | null>
  abstract findByTitle(title: string, ownerId: string): Promise<Category | null>
  abstract create(category: Category): Promise<void>
  abstract save(category: Category): Promise<void>
  abstract delete(category: Category): Promise<void>
}
