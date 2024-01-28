import { CreateProductUseCase } from '@/domain/catalog/application/use-cases/create-product'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { ResourceNotFoundError } from '@/domain/catalog/application/use-cases/errors/resource-not-found-error'
import { ProductAlreadyExistsError } from '@/domain/catalog/application/use-cases/errors/product-already-exists-error'

const bodySchema = z.object({
  description: z.string(),
  ownerId: z.string(),
  title: z.string(),
  category_id: z.string(),
  price: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/products')
export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: BodySchema) {
    const result = await this.createProductUseCase.execute({
      description: body.description,
      ownerId: body.ownerId,
      title: body.title,
      categoryId: body.category_id,
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
