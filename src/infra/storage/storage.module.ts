import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { Uploader } from '@/domain/catalog/application/storage/uploader'
import { S3Storage } from './s3-storage.service'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: S3Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
