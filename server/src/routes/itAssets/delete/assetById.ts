import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { removeAssetAssignment } from '../../../functions/itAssets/removeAssetAssignment'

export const assetById: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/assetBy/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          updatedBy: z.string(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
          400: z.object({
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
      const assetId = request.params.id
      const { updatedBy } = request.body

      if (!assetId) {
        return reply.status(400).send({
          success: false,
          message: 'Asset ID is required',
        })
      }

      const result = await removeAssetAssignment({ assetId, updatedBy })

      if (!result || !result.success) {
        // Ensure 500 response has success: false
        return reply.status(500).send({
          success: false,
          message: result?.message || 'Failed to remove asset',
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
