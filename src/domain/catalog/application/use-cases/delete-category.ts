import { Either, left, right } from '@/core/logic/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Injectable } from '@nestjs/common'

interface Request {
  ownerId: string
  categoryId: string
}

type Response = Either<ResourceNotFoundError | NotAllowedError, null>

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ categoryId, ownerId }: Request): Promise<Response> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    if (category.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    category.delete()

    await this.categoriesRepository.delete(category)

    return right(null)
  }
}
