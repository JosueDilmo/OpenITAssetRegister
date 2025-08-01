import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAssetsByStaffEmail } from '../../../functions/itAssets/getAssetsByStaffEmail'

export const assetsByStaffEmail: FastifyPluginAsyncZod = async app => {
  app.get(
    '/assetByStaffEmail',
    {
      schema: {
        querystring: z.object({
          email: z.string(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            message: z.string(),
            assetList: z.array(
              z.object({
                id: z.string(),
                serialNumber: z.string(),
                name: z.string(),
                email: z.string().nullable(),
              })
            ),
          }),
          500: z.object({
            success: z.boolean(),
            message: z.string(),
            assetList: z.array(
              z.object({
                id: z.string(),
                serialNumber: z.string(),
                name: z.string(),
                email: z.string().nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.query

      const result = await getAssetsByStaffEmail({ email })

      if (!result || !result.success) {
        // Ensure 500 response has success: false
        return reply.status(500).send({
          success: false,
          message: result?.message || 'Failed to load asset list',
          assetList: [],
        })
      }

      const { success, message, assetList } = result

      return reply.status(200).send({
        success,
        message,
        assetList: assetList.map(asset => ({
          id: asset.id,
          serialNumber: asset.serialNumber,
          name: asset.name,
          email: asset.email,
        })),
      })
    }
  )
}
