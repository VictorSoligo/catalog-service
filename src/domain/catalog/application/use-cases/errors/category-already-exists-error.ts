import { UseCaseError } from '@/core/errors/use-case-error'

export class CategoryAlreadyExistsError extends Error implements UseCaseError {
  constructor(title: string) {
    super(`Category with title "${title}" already exists`)
  }
}
