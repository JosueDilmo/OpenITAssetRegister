import { z } from 'zod'
import { ASSET_ERROR_MESSAGES } from '../constants/errorMessages'

export const assetSchema = z.object({
  serialNumber: z.string().min(2, ASSET_ERROR_MESSAGES.SERIAL_NUMBER),
  name: z.string().min(2, ASSET_ERROR_MESSAGES.NAME),
  type: z.string().min(2, ASSET_ERROR_MESSAGES.TYPE),
  assignedTo: z.preprocess(
    value => (value === '' ? null : value),
    z.string().email(ASSET_ERROR_MESSAGES.ASSIGNED_TO).nullable()
  ),
  datePurchased: z.string().date(ASSET_ERROR_MESSAGES.DATE_PURCHASED),
  assetNumber: z.string().min(2, ASSET_ERROR_MESSAGES.ASSET_NUMBER),
})

export type AssetSchemaType = z.infer<typeof assetSchema>
