import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { DeleteCategoryUseCase } from './delete-category'

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
})
