import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CatalogProductsUpdatedEvent } from '../events/catalog-products-updated-event'

export interface ProductProps {
  title: string
  price: number
  description: string
  ownerId: UniqueEntityID
  categoryId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class Product extends AggregateRoot<ProductProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  get price() {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get ownerId() {
    return this.props.ownerId
  }

  get categoryId() {
    return this.props.categoryId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  delete() {
    this.addDomainEvent(new CatalogProductsUpdatedEvent(this))
  }

  edit() {
    this.addDomainEvent(new CatalogProductsUpdatedEvent(this))
  }

  static create(
    props: Optional<ProductProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )

    const isNew = !id

    if (isNew) {
      product.addDomainEvent(new CatalogProductsUpdatedEvent(product))
    }

    return product
  }
}
