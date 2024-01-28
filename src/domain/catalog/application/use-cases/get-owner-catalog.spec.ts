import { FakeStorage } from 'test/storage/fake-storage'
import { Catalog } from '../../enterprise/entities/value-objects/catalog'
import { GetOwnerCatalogUseCase } from './get-owner-catalog'

let fakeStorage: FakeStorage
let sut: GetOwnerCatalogUseCase

describe('get owner catalog', () => {
  beforeEach(() => {
    fakeStorage = new FakeStorage()

    sut = new GetOwnerCatalogUseCase(fakeStorage)
  })

  it('should be able to get owner catalog', async () => {
    const ownerId = 'owner-01'

    const catalog = Catalog.create({
      ownerId,
      categories: [
        {
          id: 'category-01',
          title: 'category-title',
          description: 'category-description',
          products: [
            {
              id: 'product-01',
              title: 'product-title',
              description: 'product-description',
              price: 2200,
            },
          ],
        },
      ],
    })

    fakeStorage.items.push({
      fileName: ownerId,
      body: catalog.toJson(),
    })

    const result = await sut.execute({
      ownerId,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.catalog).toBeInstanceOf(Catalog)
    }
  })
})
