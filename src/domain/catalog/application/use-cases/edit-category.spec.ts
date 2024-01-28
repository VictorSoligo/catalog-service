import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { EditCategoryUseCase } from './edit-category'
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: EditCategoryUseCase

describe('edit category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new EditCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to edit a category', async () => {
    const category = makeCategory({
      title: 'Title',
      description: 'Description',
    })

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      title: 'New title',
      description: 'New description',
      ownerId: category.ownerId.toString(),
      categoryId: category.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryCategoriesRepository.items[0]).toMatchObject({
      title: 'New title',
      description: 'New description',
    })
  })

  it('should not be able to edit a category with a title that already exists', async () => {
    const ownerId = new UniqueEntityID()

    await inMemoryCategoriesRepository.create(
      makeCategory({
        title: 'Category 01',
        ownerId,
      }),
    )

    const category = makeCategory({
      title: 'Category 02',
      ownerId,
    })

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      title: 'Category 01',
      description: 'Description',
      ownerId: category.ownerId.toString(),
      categoryId: category.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it('should not be able to edit a category from another owner', async () => {
    const category = makeCategory({
      title: 'Category 02',
      ownerId: new UniqueEntityID('owner-01'),
    })

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      title: 'Category 01',
      description: 'Description',
      ownerId: 'owner-02',
      categoryId: category.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a category that does not exist', async () => {
    const result = await sut.execute({
      title: 'Category 01',
      description: 'Description',
      ownerId: 'owner-01',
      categoryId: 'category-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
