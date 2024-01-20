import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateCategoryUseCase } from '@/domain/catalog/application/use-cases/create-category'
import { CreateCategoryController } from './controllers/create-category.controller'

@Module({
  imports: [DatabaseModule],
  providers: [CreateCategoryUseCase],
  controllers: [CreateCategoryController],
})
export class HttpModule {}
