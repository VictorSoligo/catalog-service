import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CatalogCategoriesUpdatedEvent } from '@/domain/catalog/enterprise/events/catalog-categories-updated-event'
import { CatalogProductsUpdatedEvent } from '@/domain/catalog/enterprise/events/catalog-products-updated-event'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CatalogChangedProducer implements EventHandler {
  constructor(private amqpConnection: AmqpConnection) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.produce.bind(this),
      CatalogCategoriesUpdatedEvent.name,
    )

    DomainEvents.register(
      this.produce.bind(this),
      CatalogProductsUpdatedEvent.name,
    )
  }

  async produce({ ownerId }: { ownerId: string }) {
    await this.amqpConnection.publish('catalog', 'changed', {
      ownerId,
    })
  }
}
