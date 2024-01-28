import { Storage } from '@/domain/catalog/application/storage/storage'

interface StorageItem {
  fileName: string
  body: string
}

export class FakeStorage implements Storage {
  public items: StorageItem[] = []

  async get(fileName: string) {
    const item = this.items.find((item) => item.fileName === fileName)

    return item?.body
  }
}
