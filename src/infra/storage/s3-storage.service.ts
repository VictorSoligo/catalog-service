import {
  UploadParams,
  Uploader,
} from '@/domain/catalog/application/storage/uploader'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'

@Injectable()
export class S3Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      region: this.envService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({ body, fileName, fileType }: UploadParams) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: fileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: fileName,
    }
  }
}
