import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.number().default(3333),
  MYSQL_USER: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
  DATABASE_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_REGION: z.string(),
})

export type Env = z.infer<typeof envSchema>
