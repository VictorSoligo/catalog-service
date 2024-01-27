import {
  UploadParams,
  Uploader,
} from '@/domain/catalog/application/storage/uploader'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { Storage } from '@/domain/catalog/application/storage/storage'

@Injectable()
export class S3Storage implements Uploader, Storage {
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

  async get(fileName: string) {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.envService.get('AWS_BUCKET_NAME'),
          Key: fileName,
        }),
      )

      const file = await response.Body?.transformToString()

      return file
    } catch (error) {
      return undefined
    }
  }
}
