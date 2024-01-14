import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category'
import { makeCategory } from 'test/factories/make-category'
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('create category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to create a category', async () => {
    const result = await sut.execute({
      title: 'Title',
      description: 'Description',
      ownerId: 'owner-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(1)
  })

  it('should not be able to create a category with a title that already exists', async () => {
    await inMemoryCategoriesRepository.create(
      makeCategory({
        title: 'Title',
        ownerId: new UniqueEntityID('owner-01'),
      }),
    )

    const result = await sut.execute({
      title: 'Title',
      description: 'Description',
      ownerId: 'owner-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError)
  })
})
