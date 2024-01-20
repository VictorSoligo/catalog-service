import { ValueObject } from '@/core/entities/value-object'

export interface CatalogProps {
  ownerId: string
  categories: {
    id: string
    title: string
    description: string
    products: {
      id: string
      title: string
      description: string
      price: number
    }[]
  }[]
}

export class Catalog extends ValueObject<CatalogProps> {
  get ownerId() {
    return this.props.ownerId
  }

  get categories() {
    return this.props.categories
  }

  static create(props: CatalogProps) {
    const catalog = new Catalog(props)

    return catalog
  }
}
