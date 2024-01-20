import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CatalogCategoriesUpdatedEvent } from '../events/catalog-categories-updated-event'

export interface CategoryProps {
  title: string
  description: string
  ownerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class Category extends AggregateRoot<CategoryProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CategoryProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )

    const isNew = !id

    if (isNew) {
      category.addDomainEvent(new CatalogCategoriesUpdatedEvent(category))
    }

    return category
  }
}
