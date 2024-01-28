import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { EditProductUseCase } from './edit-product'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: EditProductUseCase

describe('edit product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()

    sut = new EditProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to edit a product', async () => {
    const product = makeProduct({
      title: 'Title',
      description: 'Description',
      price: 1200,
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      title: 'New title',
      description: 'New description',
      ownerId: product.ownerId.toString(),
      productId: product.id.toString(),
      price: 1400,
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryProductsRepository.items[0]).toMatchObject({
      title: 'New title',
      description: 'New description',
      price: 1400,
    })
  })

  it('should not be able to edit a product with a title that already exists', async () => {
    const ownerId = new UniqueEntityID()

    await inMemoryProductsRepository.create(
      makeProduct({
        title: 'Product 01',
        ownerId,
      }),
    )

    const product = makeProduct({
      title: 'Product 02',
      ownerId,
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      title: 'Product 01',
      description: 'Description',
      ownerId: product.ownerId.toString(),
      productId: product.id.toString(),
      price: 1400,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ProductAlreadyExistsError)
  })

  it('should not be able to edit a product from another owner', async () => {
    const product = makeProduct({
      title: 'Product 02',
      ownerId: new UniqueEntityID('owner-01'),
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      title: 'Product 01',
      description: 'Description',
      ownerId: 'owner-02',
      productId: product.id.toString(),
      price: 1400,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a product that does not exist', async () => {
    const result = await sut.execute({
      title: 'Product 01',
      description: 'Description',
      ownerId: 'owner-01',
      productId: 'product-01',
      price: 1400,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
