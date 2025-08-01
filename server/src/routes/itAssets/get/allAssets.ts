import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAsset } from '../../../functions/itAssets/getAsset'

export const allAssets: FastifyPluginAsyncZod = async app => {
  app.get(
    '/allAssets',
    {
      schema: {
        querystring: z.object({
          id: z.string().optional(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              serialNumber: z.string(),
              name: z.string(),
              type: z.string(),
              assignedTo: z.string().nullable(),
              dateAssigned: z.string().nullable(),
              datePurchased: z.string(),
              assetNumber: z.string(),
              status: z.string(),
              note: z.string().nullable(),
              createdAt: z.string(),
              createdBy: z.string(),
              changeLog: z.array(
                z.object({
                  updatedBy: z.string(),
                  updatedAt: z.string(),
                  updatedField: z.string(),
                  previousValue: z.string().nullable(),
                  newValue: z.string().nullable(),
                })
              ),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.query
      const { allAsset } = await getAsset()

      const filteredAsset = id
        ? allAsset.filter(asset => asset.id === id)
        : allAsset

      return reply.status(200).send(
        filteredAsset.map(asset => {
          return {
            id: asset.id,
            serialNumber: asset.serialNumber,
            name: asset.name,
            type: asset.type,
            assignedTo: asset.assignedTo,
            dateAssigned: asset.dateAssigned,
            datePurchased: asset.datePurchased,
            assetNumber: asset.assetNumber,
            status: asset.status,
            note: asset.note,
            createdAt: asset.createdAt.toString(),
            createdBy: asset.createdBy,
            changeLog: asset.changeLog.map(log => ({
              updatedBy: log.updatedBy,
              updatedAt: log.updatedAt.toString(),
              updatedField: log.updatedField,
              previousValue: log.previousValue,
              newValue: log.newValue,
            })),
          }
        })
      )
    }
  )
}
