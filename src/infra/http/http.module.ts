import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateCategoryUseCase } from '@/domain/catalog/application/use-cases/create-category'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateProductUseCase } from '@/domain/catalog/application/use-cases/create-product'
import { CreateProductController } from './controllers/create-product.controller'
import { GetOwnerCatalogUseCase } from '@/domain/catalog/application/use-cases/get-owner-catalog'
import { GetOwnerCatalogController } from './controllers/get-owner-catalog.controller'
import { StorageModule } from '../storage/storage.module'
import { DeleteCategoryUseCase } from '@/domain/catalog/application/use-cases/delete-category'
import { DeleteCategoryController } from './controllers/delete-category.controller'

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [
    CreateCategoryUseCase,
    CreateProductUseCase,
    GetOwnerCatalogUseCase,
    DeleteCategoryUseCase,
  ],
  controllers: [
    CreateCategoryController,
    CreateProductController,
    GetOwnerCatalogController,
    DeleteCategoryController,
  ],
})
export class HttpModule {}
