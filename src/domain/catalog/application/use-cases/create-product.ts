import { Either, left, right } from '@/core/logic/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { CategoriesRepository } from '../repositories/categories-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface Request {
  title: string
  price: number
  description: string
  ownerId: string
  categoryId: string
}

type Response = Either<
  ResourceNotFoundError | ProductAlreadyExistsError | NotAllowedError,
  { product: Product }
>

export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    categoryId,
    description,
    ownerId,
    price,
    title,
  }: Request): Promise<Response> {
    const productWithSameTitle = await this.productsRepository.findByTitle(
      title,
      ownerId,
    )

    if (productWithSameTitle) {
      return left(new ProductAlreadyExistsError(title))
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    if (category.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    const product = Product.create({
      categoryId: category.id,
      description,
      ownerId: new UniqueEntityID(ownerId),
      price,
      title,
    })

    await this.productsRepository.create(product)

    return right({
      product,
    })
  }
}
