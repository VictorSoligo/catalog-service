import { EditProductUseCase } from '@/domain/catalog/application/use-cases/edit-product'
import { ProductAlreadyExistsError } from '@/domain/catalog/application/use-cases/errors/product-already-exists-error'
import { ResourceNotFoundError } from '@/domain/catalog/application/use-cases/errors/resource-not-found-error'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const bodySchema = z.object({
  description: z.string(),
  owner_id: z.string(),
  title: z.string(),
  price: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/products/:id')
export class EditProductController {
  constructor(private editProductUseCase: EditProductUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') productId: string,
    @Body(bodyValidationPipe) body: BodySchema,
  ) {
    const result = await this.editProductUseCase.execute({
      productId,
      description: body.description,
      ownerId: body.owner_id,
      title: body.title,
      price: body.price,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case ProductAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
