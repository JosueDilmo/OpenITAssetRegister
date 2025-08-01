import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { assignAssetToStaffWithConfirmation } from '../../../functions/itAssets/assignAssetToStaffWithConfirmation'

export const assetToStaff: FastifyPluginAsyncZod = async app => {
  app.post(
    '/assetToStaff/:email',
    {
      schema: {
        params: z.object({
          email: z.string(),
        }),
        body: z.object({
          assetId: z.string(),
          updatedBy: z.string().email(),
          userConfirmed: z.boolean().optional(),
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
      const staffEmail = request.params.email
      const userConfirmed = request.body.userConfirmed || false
      const assetId = request.body.assetId
      const updatedBy = request.body.updatedBy

      const { success, message } = await assignAssetToStaffWithConfirmation({
        staffEmail,
        assetId,
        updatedBy,
        userConfirmed,
      })

      return reply.status(success ? 200 : 500).send({
        success,
        message,
      })
    }
  )
}
