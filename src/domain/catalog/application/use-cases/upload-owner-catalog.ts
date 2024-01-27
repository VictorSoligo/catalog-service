import { Either, right } from '@/core/logic/either'
import { Catalog } from '../../enterprise/entities/value-objects/catalog'
import { CategoriesRepository } from '../repositories/categories-repository'
import { ProductsRepository } from '../repositories/products-repository'
import { Uploader } from '../storage/uploader'
import { Injectable } from '@nestjs/common'

interface Request {
  ownerId: string
}

type Response = Either<null, { catalog: Catalog }>

@Injectable()
export class UploadOwnerCatalogUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private productsRepository: ProductsRepository,
    private uploader: Uploader,
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

    await this.uploader.upload({
      fileName: ownerId,
      fileType: 'json',
      body: Buffer.from(catalog.toJson()),
    })

    return right({ catalog })
  }
}
