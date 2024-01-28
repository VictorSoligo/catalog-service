import { DeleteProductUseCase } from '@/domain/catalog/application/use-cases/delete-product'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { ResourceNotFoundError } from '@/domain/catalog/application/use-cases/errors/resource-not-found-error'

const bodySchema = z.object({
  owner_id: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/products/:id')
export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') productId: string,
    @Body(bodyValidationPipe) body: BodySchema,
  ) {
    const result = await this.deleteProductUseCase.execute({
      productId,
      ownerId: body.owner_id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
