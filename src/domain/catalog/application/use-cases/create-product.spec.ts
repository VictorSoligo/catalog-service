import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateProductUseCase } from './create-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeCategory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeProduct } from 'test/factories/make-product'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase

describe('create product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new CreateProductUseCase(
      inMemoryProductsRepository,
      inMemoryCategoriesRepository,
    )
  })

  it('should be able to create a product', async () => {
    const ownerId = new UniqueEntityID('owner-01')

    const category = makeCategory({
      ownerId,
    })

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      categoryId: category.id.toString(),
      ownerId: ownerId.toString(),
      description: 'Description',
      price: 10000,
      title: 'Title',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items).toHaveLength(1)
  })

  it('should not be able to create a product with a name that already exists', async () => {
    const ownerId = new UniqueEntityID('owner-01')

    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId,
        title: 'Title',
      }),
    )

    const category = makeCategory({
      ownerId,
    })

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      categoryId: category.id.toString(),
      ownerId: ownerId.toString(),
      description: 'Description',
      price: 10000,
      title: 'Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ProductAlreadyExistsError)
  })

  it('should not be able to create a product with a category from another owner', async () => {
    const ownerId = new UniqueEntityID('owner-01')

    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId,
        title: 'Title',
      }),
    )

    const category = makeCategory({
      ownerId,
    })

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      categoryId: category.id.toString(),
      ownerId: 'owner-02',
      description: 'Description',
      price: 10000,
      title: 'Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
