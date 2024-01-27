import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { Uploader } from '@/domain/catalog/application/storage/uploader'
import { S3Storage } from './s3-storage.service'
import { Storage } from '@/domain/catalog/application/storage/storage'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Storage,
      useClass: S3Storage,
    },
    {
      provide: Uploader,
      useClass: S3Storage,
    },
  ],
  exports: [Storage, Uploader],
})
export class StorageModule {}
