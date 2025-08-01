import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createStaff } from '../../../functions/staff/createStaff'

export const newStaff: FastifyPluginAsyncZod = async app => {
  app.post(
    '/newStaff',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          department: z.string(),
          jobTitle: z.string(),
          createdBy: z.string().email(),
        }),
        response: {
          201: z.object({
            success: z.boolean(),
            message: z.string(),
            staff: z.string(),
          }),
          500: z.object({
            success: z.boolean(),
            message: z.string(),
            staff: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, department, jobTitle, createdBy } = request.body

      const result = await createStaff({
        name,
        email,
        department,
        jobTitle,
        createdBy,
      })

      if (!result || !result.success) {
        // Ensure 500 response has success: false
        return reply.status(500).send({
          success: false,
          message: result?.message || 'Failed to register staff',
          staff: '',
        })
      }

      const { success, message, staff } = result
      return reply.status(201).send({
        success,
        message,
        staff,
      })
    }
  )
}
