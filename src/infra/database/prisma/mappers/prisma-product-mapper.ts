import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '@/domain/catalog/enterprise/entities/product'
import { Product as PrismaProduct, Prisma } from '@prisma/client'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    const product = Product.create(
      {
        description: raw.description,
        ownerId: new UniqueEntityID(raw.ownerId),
        title: raw.title,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        categoryId: new UniqueEntityID(raw.categoryId),
        price: raw.price,
      },
      new UniqueEntityID(raw.id),
    )

    return product
  }

  static toPersistence(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      createdAt: product.createdAt,
      description: product.description,
      ownerId: product.ownerId.toString(),
      title: product.title,
      id: product.id.toString(),
      updatedAt: product.updatedAt,
      categoryId: product.categoryId.toString(),
      price: product.price,
    }
  }
}
