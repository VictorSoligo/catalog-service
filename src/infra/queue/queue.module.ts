import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Module } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'
import { CatalogChangedProducer } from './rabbitmq/producers/catalog-changed-producer'
import { CatalogChangedConsumer } from './rabbitmq/consumers/catalog-changed-consumer'

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
              name: 'catalog-changed',
              routingKey: 'changed',
            },
          ],
        }
      },
    }),
  ],
  providers: [CatalogChangedProducer, CatalogChangedConsumer],
})
export class QueueModule {}
