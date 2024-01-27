import { UploadOwnerCatalogUseCase } from '@/domain/catalog/application/use-cases/upload-owner-catalog'
import { Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'

interface MessagePayload {
  ownerId: string
}

@Injectable()
export class CatalogChangedConsumer {
  constructor(private uploadOwnerCatalogUseCase: UploadOwnerCatalogUseCase) {}

  @RabbitRPC({
    exchange: 'catalog',
    queue: 'catalog-emit',
    routingKey: 'emit',
  })
  async consume({ ownerId }: MessagePayload) {
    try {
      const result = await this.uploadOwnerCatalogUseCase.execute({
        ownerId,
      })

      if (result.isLeft()) {
        return new Nack()
      }
    } catch (error) {
      return new Nack()
    }
  }
}
