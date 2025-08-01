import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { updateAssetDetails } from '../../../functions/itAssets/updateAssetDetails'

export const assetDetails: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/assetDetails/:id',
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

      const result = await updateAssetDetails({
        id: staffId,
        status: status,
        note: note,
        updatedBy: updatedBy,
      })

      if (!result || !result.success) {
        // Ensure 500 response has success: false
        return reply.status(500).send({
          success: false,
          message: result?.message || 'Failed to manage asset',
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
