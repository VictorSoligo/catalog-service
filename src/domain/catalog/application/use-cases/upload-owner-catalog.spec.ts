import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { UploadOwnerCatalogUseCase } from './upload-owner-catalog'
import { FakeUploader } from 'test/storage/fake-uploader'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { makeProduct } from 'test/factories/make-product'

let fakeUploader: FakeUploader
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: UploadOwnerCatalogUseCase

describe('upload owner catalog', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadOwnerCatalogUseCase(
      inMemoryCategoriesRepository,
      inMemoryProductsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload owner catalog', async () => {
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

    expect(fakeUploader.uploads[0]).toMatchObject({
      fileName: ownerId.toString(),
    })
  })
})
