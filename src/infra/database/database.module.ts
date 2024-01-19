import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ProductsRepository } from '@/domain/catalog/application/repositories/products-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'
import { CategoriesRepository } from '@/domain/catalog/application/repositories/categories-repository'
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository'

@Module({
  providers: [
    PrismaService,
    { provide: ProductsRepository, useClass: PrismaProductsRepository },
    { provide: CategoriesRepository, useClass: PrismaCategoriesRepository },
  ],
  exports: [PrismaService, ProductsRepository, CategoriesRepository],
})
export class DatabaseModule {}
