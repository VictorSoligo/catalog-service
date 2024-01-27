import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Module } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'
import { CatalogChangedProducer } from './rabbitmq/producers/catalog-changed-producer'
import { CatalogChangedConsumer } from './rabbitmq/consumers/catalog-changed-consumer'
import { UploadOwnerCatalogUseCase } from '@/domain/catalog/application/use-cases/upload-owner-catalog'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [EnvModule],
      inject: [EnvService],
      async useFactory(envService: EnvService) {
        return {
          uri: envService.get('RABBITMQ_URL'),
          exchanges: [
            {
              name: 'catalog',
              type: 'topic',
            },
          ],
          queues: [
            {
              exchange: 'catalog',
              name: 'catalog-emit',
              routingKey: 'emit',
            },
          ],
        }
      },
    }),
    DatabaseModule,
    StorageModule,
  ],
  providers: [
    CatalogChangedProducer,
    CatalogChangedConsumer,
    UploadOwnerCatalogUseCase,
  ],
})
export class QueueModule {}
