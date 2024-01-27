import { Either, left, right } from '@/core/logic/either'
import { Catalog } from '../../enterprise/entities/value-objects/catalog'
import { Injectable } from '@nestjs/common'
import { Storage } from '../storage/storage'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface Request {
  ownerId: string
}

type Response = Either<ResourceNotFoundError, { catalog: Catalog }>

@Injectable()
export class GetOwnerCatalogUseCase {
  constructor(private storage: Storage) {}

  async execute({ ownerId }: Request): Promise<Response> {
    const storagedCatalog = await this.storage.get(ownerId)

    if (!storagedCatalog) {
      return left(new ResourceNotFoundError())
    }

    const catalog = Catalog.create(JSON.parse(storagedCatalog))

    return right({ catalog })
  }
}
