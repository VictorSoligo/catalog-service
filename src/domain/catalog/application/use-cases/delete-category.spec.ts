import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { DeleteCategoryUseCase } from './delete-category'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: DeleteCategoryUseCase

describe('delete category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new DeleteCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to delete a category', async () => {
    const category = makeCategory({
      ownerId: new UniqueEntityID('owner-01'),
    })

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      ownerId: category.ownerId.toString(),
      categoryId: category.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(0)
  })

  it('should be able to delete a category from another owner', async () => {
    const category = makeCategory({
      ownerId: new UniqueEntityID('owner-01'),
    })

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      ownerId: 'owner-33',
      categoryId: category.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should be able to delete a category that does not exist', async () => {
    const result = await sut.execute({
      ownerId: 'owner-01',
      categoryId: 'category-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
