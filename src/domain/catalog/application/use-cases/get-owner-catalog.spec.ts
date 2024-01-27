import { makeCategory } from 'test/factories/make-category'
import { GetOwnerCatalogUseCase } from './get-owner-catalog'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeProduct } from 'test/factories/make-product'
import { Catalog } from '../../enterprise/entities/value-objects/catalog'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: GetOwnerCatalogUseCase

describe('get owner catalog', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository()

    sut = new GetOwnerCatalogUseCase(
      inMemoryCategoriesRepository,
      inMemoryProductsRepository,
    )
  })

  it('should be able to get owner catalog', async () => {
    const ownerId = new UniqueEntityID('1')

    for (let i = 1; i <= 5; i++) {
      inMemoryCategoriesRepository.items.push(
        makeCategory(
          {
            ownerId,
          },
          new UniqueEntityID(String(i)),
        ),
      )
    }

    for (let i = 1; i <= 5; i++) {
      inMemoryProductsRepository.items.push(
        makeProduct(
          {
            ownerId,
            categoryId: new UniqueEntityID(String(i)),
          },
          new UniqueEntityID(String(i)),
        ),
      )
    }

    const result = await sut.execute({
      ownerId: '1',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.catalog).toBeInstanceOf(Catalog)
      expect(result.value.catalog.categories).toHaveLength(5)
      expect(result.value.catalog.ownerId).toEqual(ownerId.toString())
    }
  })
})
