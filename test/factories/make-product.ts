import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Product,
  ProductProps,
} from '@/domain/catalog/enterprise/entities/product'
import { faker } from '@faker-js/faker'

export function makeProduct(
  override?: Partial<ProductProps>,
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      categoryId: new UniqueEntityID(),
      ownerId: new UniqueEntityID(),
      description: faker.lorem.words(4),
      title: faker.lorem.words(2),
      price: faker.number.int({ min: 1, max: 500000 }),
      ...override,
    },
    id,
  )

  return product
}
