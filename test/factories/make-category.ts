import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Category,
  CategoryProps,
} from '@/domain/catalog/enterprise/entities/category'
import { faker } from '@faker-js/faker'

export function makeCategory(
  override?: Partial<CategoryProps>,
  id?: UniqueEntityID,
) {
  const category = Category.create(
    {
      description: faker.lorem.words(4),
      ownerId: new UniqueEntityID(),
      title: faker.lorem.words(2),
      ...override,
    },
    id,
  )

  return category
}
