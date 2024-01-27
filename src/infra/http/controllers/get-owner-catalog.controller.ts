import { GetOwnerCatalogUseCase } from '@/domain/catalog/application/use-cases/get-owner-catalog'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { CatalogPresenter } from '../presenters/catalog-presenter'

@Controller('/catalogs/:ownerId')
export class GetOwnerCatalogController {
  constructor(private getOwnerCatalogUseCase: GetOwnerCatalogUseCase) {}

  @Get()
  async handle(@Param('ownerId') ownerId: string) {
    const result = await this.getOwnerCatalogUseCase.execute({
      ownerId,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const { catalog } = result.value

    return CatalogPresenter.toHttp(catalog)
  }
}
