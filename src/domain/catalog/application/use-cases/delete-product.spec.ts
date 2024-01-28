import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeProduct } from 'test/factories/make-product'
import { DeleteProductUseCase } from './delete-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: DeleteProductUseCase

describe('delete product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()

    sut = new DeleteProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to delete a product', async () => {
    const product = makeProduct({
      ownerId: new UniqueEntityID('owner-01'),
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      ownerId: product.ownerId.toString(),
      productId: product.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a product from another owner', async () => {
    const product = makeProduct({
      ownerId: new UniqueEntityID('owner-01'),
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      ownerId: 'owner-33',
      productId: product.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryProductsRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete a product that does not exist', async () => {
    const result = await sut.execute({
      ownerId: 'owner-01',
      productId: 'product-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
