import { ProductsRepository } from '@/domain/catalog/application/repositories/products-repository'
import { Product } from '@/domain/catalog/enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async findByTitle(title: string, ownerId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        title,
        ownerId,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async create(product: Product) {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(product.id)
  }

  async save(product: Product) {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.update({
      where: {
        id: product.id.toString(),
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(product.id)
  }

  async delete(product: Product) {
    await this.prisma.product.delete({
      where: {
        id: product.id.toString(),
      },
    })

    DomainEvents.dispatchEventsForAggregate(product.id)
  }
}
