import { Catalog } from '@/domain/catalog/enterprise/entities/value-objects/catalog'

export class CatalogPresenter {
  static toHttp(catalog: Catalog) {
    return {
      owner_id: catalog.ownerId,
      categories: catalog.categories.map((category) => {
        return {
          id: category.id,
          title: category.title,
          description: category.description,
          products: category.products.map((product) => {
            return {
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
            }
          }),
        }
      }),
    }
  }
}
