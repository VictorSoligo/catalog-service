import { Either, left, right } from '@/core/logic/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'

interface Request {
  ownerId: string
  productId: string
}

type Response = Either<ResourceNotFoundError | NotAllowedError, null>

@Injectable()
export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ productId, ownerId }: Request): Promise<Response> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (product.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    product.delete()

    await this.productsRepository.delete(product)

    return right(null)
  }
}
