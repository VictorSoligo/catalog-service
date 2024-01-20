import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateCategoryUseCase } from '@/domain/catalog/application/use-cases/create-category'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateProductUseCase } from '@/domain/catalog/application/use-cases/create-product'
import { CreateProductController } from './controllers/create-product.controller'

@Module({
  imports: [DatabaseModule],
  providers: [CreateCategoryUseCase, CreateProductUseCase],
  controllers: [CreateCategoryController, CreateProductController],
})
export class HttpModule {}
