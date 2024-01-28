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
import { DeleteProductUseCase } from '@/domain/catalog/application/use-cases/delete-product'
import { DeleteProductController } from './controllers/delete-product.controller'
import { EditCategoryUseCase } from '@/domain/catalog/application/use-cases/edit-category'
import { EditCategoryController } from './controllers/edit-category.controller'
import { EditProductUseCase } from '@/domain/catalog/application/use-cases/edit-product'
import { EditProductController } from './controllers/edit-product.controller'

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [
    CreateCategoryUseCase,
    CreateProductUseCase,
    GetOwnerCatalogUseCase,
    DeleteCategoryUseCase,
    DeleteProductUseCase,
    EditCategoryUseCase,
    EditProductUseCase,
  ],
  controllers: [
    CreateCategoryController,
    CreateProductController,
    GetOwnerCatalogController,
    DeleteCategoryController,
    DeleteProductController,
    EditCategoryController,
    EditProductController,
  ],
})
export class HttpModule {}
