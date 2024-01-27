import { Either, right } from '@/core/logic/either'
import { Catalog } from '../../enterprise/entities/value-objects/catalog'
import { CategoriesRepository } from '../repositories/categories-repository'
import { ProductsRepository } from '../repositories/products-repository'

interface Request {
  ownerId: string
}

type Response = Either<null, { catalog: Catalog }>

export class GetOwnerCatalogUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({ ownerId }: Request): Promise<Response> {
    const [categories, products] = await Promise.all([
      this.categoriesRepository.findManyByOwnerId(ownerId),
      this.productsRepository.findManyByOwnerId(ownerId),
    ])

    const catalog = Catalog.create({
      ownerId,
      categories: categories.map((category) => {
        const categoryProducts = products.filter((product) => {
          return product.categoryId.equals(category.id)
        })

        return {
          id: category.id.toString(),
          title: category.title,
          description: category.description,
          products: categoryProducts.map((product) => {
            return {
              id: product.id.toString(),
              title: product.title,
              description: product.description,
              price: product.price,
            }
          }),
        }
      }),
    })

    return right({ catalog })
  }
}