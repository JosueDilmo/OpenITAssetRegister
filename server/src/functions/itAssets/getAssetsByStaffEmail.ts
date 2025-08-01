import { eq } from 'drizzle-orm'
import { db } from '../../drizzle/client'
import { assetTab } from '../../drizzle/schema/assetTab'
import type { GetAssetParams } from '../../types'

export async function getAssetsByStaffEmail({ email }: GetAssetParams) {
  const asset = await db
    .select()
    .from(assetTab)
    .where(eq(assetTab.assignedTo, email))

  if (asset.length === 0) {
    return {
      success: false,
      message: 'No asset found',
      assetList: [],
    }
  }

  const assetList = asset.map(asset => {
    return {
      id: asset.id,
      serialNumber: asset.serialNumber,
      name: asset.name,
      email: asset.assignedTo,
    }
  })

  return {
    success: true,
    message: 'Asset list retrieved successfully',
    assetList,
  }
}
