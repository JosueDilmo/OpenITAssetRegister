import { z } from 'zod'
import { ERROR_MESSAGES } from '../constants/errorMessages'

export const staffSchema = z.object({
  name: z.string().min(2, ERROR_MESSAGES.name),
  email: z.string().email(ERROR_MESSAGES.email),
  department: z.string().min(2, ERROR_MESSAGES.department),
  jobTitle: z.string().min(2, ERROR_MESSAGES.jobTitle),
})
export type StaffSchemaType = z.infer<typeof staffSchema>
