import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.number().default(3333),
  MYSQL_USER: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
  DATABASE_URL: z.string(),
})

export type Env = z.infer<typeof envSchema>
