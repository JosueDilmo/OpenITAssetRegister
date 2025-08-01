import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createAsset } from '../../../functions/itAssets/createAsset'

export const newAsset: FastifyPluginAsyncZod = async app => {
  app.post(
    '/newAsset',
    {
      schema: {
        body: z.object({
          serialNumber: z.string(),
          name: z.string(),
          type: z.string(),
          assignedTo: z.string().email().nullable(),
          datePurchased: z.string(),
          assetNumber: z.string(),
          createdBy: z.string().email(),
        }),
        response: {
          201: z.object({
            success: z.boolean(),
            message: z.string(),
            staff: z.string().nullable(),
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
      const {
        serialNumber,
        name,
        type,
        assignedTo,
        datePurchased,
        assetNumber,
        createdBy,
      } = request.body

      const result = await createAsset({
        serialNumber,
        name,
        type,
        assignedTo,
        datePurchased,
        assetNumber,
        createdBy,
      })

      if (!result || !result.success) {
        // Ensure 500 response has success: false
        return reply.status(500).send({
          success: false,
          message: result?.message || 'Failed to register asset',
          staff: null,
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
