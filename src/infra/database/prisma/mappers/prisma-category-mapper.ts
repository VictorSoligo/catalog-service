import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/catalog/enterprise/entities/category'
import { Category as PrismaCategory, Prisma } from '@prisma/client'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    const category = Category.create(
      {
        description: raw.description,
        ownerId: new UniqueEntityID(raw.ownerId),
        title: raw.title,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )

    return category
  }

  static toPersistence(
    category: Category,
  ): Prisma.CategoryUncheckedCreateInput {
    return {
      createdAt: category.createdAt,
      description: category.description,
      ownerId: category.ownerId.toString(),
      title: category.title,
      id: category.id.toString(),
      updatedAt: category.updatedAt,
    }
  }
}
