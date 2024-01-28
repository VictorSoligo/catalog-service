import { Either, left, right } from '@/core/logic/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error'
import { Category } from '../../enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Injectable } from '@nestjs/common'

interface Request {
  categoryId: string
  title: string
  description: string
  ownerId: string
}

type Response = Either<
  ResourceNotFoundError | NotAllowedError | CategoryAlreadyExistsError,
  { category: Category }
>

@Injectable()
export class EditCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    categoryId,
    description,
    ownerId,
    title,
  }: Request): Promise<Response> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    if (category.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    if (category.title !== title) {
      const categoryWithSameTitle = await this.categoriesRepository.findByTitle(
        title,
        ownerId,
      )

      if (categoryWithSameTitle) {
        return left(new CategoryAlreadyExistsError(title))
      }

      category.title = title
    }

    category.description = description

    category.edit()

    await this.categoriesRepository.save(category)

    return right({
      category,
    })
  }
}
