import {
  UploadParams,
  Uploader,
} from '@/domain/catalog/application/storage/uploader'
import { randomUUID } from 'crypto'

interface Upload {
  fileName: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams) {
    const url = randomUUID()

    this.uploads.push({
      fileName,
    })

    return { url }
  }
}
