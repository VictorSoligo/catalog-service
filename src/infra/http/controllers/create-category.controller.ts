import { CreateCategoryUseCase } from '@/domain/catalog/application/use-cases/create-category'
import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const bodySchema = z.object({
  description: z.string(),
  owner_id: z.string(),
  title: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/categories')
export class CreateCategoryController {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: BodySchema) {
    const result = await this.createCategoryUseCase.execute({
      description: body.description,
      ownerId: body.owner_id,
      title: body.title,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new ConflictException(error.message)
    }
  }
}
