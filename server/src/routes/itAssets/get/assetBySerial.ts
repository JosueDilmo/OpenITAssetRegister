import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAssetBySerial } from '../../../functions/itAssets/getAssetBySerial'

export const assetBySerial: FastifyPluginAsyncZod = async app => {
  app.get(
    '/assetBySerial',
    {
      schema: {
        querystring: z.object({
          serialNumber: z.string(),
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
                type: z.string(),
                assignedTo: z.string().nullable(),
                datePurchased: z.string(),
                assetNumber: z.string(),
                status: z.string(),
                note: z.string().nullable(),
                createdAt: z.string(),
                createdBy: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { serialNumber } = request.query
      const { success, message, assetList } = await getAssetBySerial({
        serialNumber,
      })

      const filteredAsset = serialNumber
        ? assetList.filter(asset => asset.serialNumber === serialNumber)
        : assetList

      return reply.status(200).send({
        success,
        message,
        assetList: filteredAsset.map(asset => ({
          id: asset.id,
          serialNumber: asset.serialNumber,
          name: asset.name,
          type: asset.type,
          assignedTo: asset.assignedTo,
          datePurchased: asset.datePurchased,
          assetNumber: asset.assetNumber,
          status: asset.status,
          note: asset.note,
          createdAt: asset.createdAt.toString(),
          createdBy: asset.createdBy,
        })),
      })
    }
  )
}
