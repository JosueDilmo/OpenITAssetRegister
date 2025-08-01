import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { updateStaffDetails } from '../../../functions/staff/updateStaffDetails'

export const staffDetails: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/staffDetails/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          status: z.string(),
          note: z.string().nullable(),
          updatedBy: z.string(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
          500: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const staffId = request.params.id
      const { status, note, updatedBy } = request.body

      const result = await updateStaffDetails({
        id: staffId,
        status: status,
        note: note,
        updatedBy: updatedBy,
      })

      if (!result || !result.success) {
        // Ensure 500 response has success: false
        return reply.status(500).send({
          success: false,
          message: result?.message || 'Failed to manage staff details',
        })
      }

      const { success, message } = result
      return reply.status(200).send({
        success,
        message,
      })
    }
  )
}
