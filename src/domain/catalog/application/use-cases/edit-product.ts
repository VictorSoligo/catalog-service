import { Either, left, right } from '@/core/logic/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { Injectable } from '@nestjs/common'

interface Request {
  productId: string
  title: string
  description: string
  ownerId: string
  price: number
}

type Response = Either<
  ResourceNotFoundError | NotAllowedError | ProductAlreadyExistsError,
  { product: Product }
>

@Injectable()
export class EditProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    description,
    ownerId,
    title,
    price,
  }: Request): Promise<Response> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (product.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    if (product.title !== title) {
      const productWithSameTitle = await this.productsRepository.findByTitle(
        title,
        ownerId,
      )

      if (productWithSameTitle) {
        return left(new ProductAlreadyExistsError(title))
      }

      product.title = title
    }

    product.description = description
    product.price = price

    product.edit()

    await this.productsRepository.save(product)

    return right({
      product,
    })
  }
}
