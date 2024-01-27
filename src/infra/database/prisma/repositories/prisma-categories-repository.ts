import { CategoriesRepository } from '@/domain/catalog/application/repositories/categories-repository'
import { Category } from '@/domain/catalog/enterprise/entities/category'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findByTitle(title: string, ownerId: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        title,
        ownerId,
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findManyByOwnerId(ownerId: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        ownerId,
      },
    })

    return categories.map(PrismaCategoryMapper.toDomain)
  }

  async create(category: Category) {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(category.id)
  }

  async save(category: Category) {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.update({
      where: {
        id: category.id.toString(),
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(category.id)
  }

  async delete(category: Category) {
    await this.prisma.category.delete({
      where: {
        id: category.id.toString(),
      },
    })

    DomainEvents.dispatchEventsForAggregate(category.id)
  }
}
