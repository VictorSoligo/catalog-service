import { EditCategoryUseCase } from '@/domain/catalog/application/use-cases/edit-category'
import { CategoryAlreadyExistsError } from '@/domain/catalog/application/use-cases/errors/category-already-exists-error'
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
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/categories/:id')
export class EditCategoryController {
  constructor(private editCategoryUseCase: EditCategoryUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') categoryId: string,
    @Body(bodyValidationPipe) body: BodySchema,
  ) {
    const result = await this.editCategoryUseCase.execute({
      categoryId,
      description: body.description,
      ownerId: body.owner_id,
      title: body.title,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case CategoryAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
