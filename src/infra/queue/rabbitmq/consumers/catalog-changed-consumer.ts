import { RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'

interface MessagePayload {
  ownerId: string
}

@Injectable()
export class CatalogChangedConsumer {
  @RabbitRPC({
    exchange: 'catalog',
    routingKey: 'changed',
    queue: 'catalog-changed',
  })
  async consume({ ownerId }: MessagePayload) {
    console.log(ownerId)
  }
}
