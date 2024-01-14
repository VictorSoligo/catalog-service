import { Either, left, right } from '@/core/logic/either'
import { Injectable } from '@nestjs/common'
import { Category } from '../../enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error'

interface Request {
  title: string
  description: string
  ownerId: string
}

type Response = Either<CategoryAlreadyExistsError, { category: Category }>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ description, ownerId, title }: Request): Promise<Response> {
    const categoryWithSameTitle = await this.categoriesRepository.findByTitle(
      title,
      ownerId,
    )

    if (categoryWithSameTitle) {
      return left(new CategoryAlreadyExistsError(title))
    }

    const category = Category.create({
      description,
      title,
      ownerId: new UniqueEntityID(ownerId),
    })

    await this.categoriesRepository.create(category)

    return right({
      category,
    })
  }
}
