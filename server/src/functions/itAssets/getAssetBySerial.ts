import { eq } from 'drizzle-orm'
import { db } from '../../drizzle/client'
import { assetTab } from '../../drizzle/schema/assetTab'
import type { GetAssetSerialParams } from '../../types'

export async function getAssetBySerial({ serialNumber }: GetAssetSerialParams) {
  const asset = await db
    .select()
    .from(assetTab)
    .where(eq(assetTab.serialNumber, serialNumber))

  if (asset.length === 0) {
    return {
      success: false,
      message: 'No asset found',
      assetList: [],
    }
  }

  //

  const assetList = asset.map(asset => {
    return {
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
    }
  })

  return {
    success: true,
    message: 'Asset list retrieved successfully',
    assetList,
  }
}
