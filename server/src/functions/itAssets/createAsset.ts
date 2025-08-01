import { eq } from 'drizzle-orm'
import { db } from '../../drizzle/client'
import { assetTab } from '../../drizzle/schema/assetTab'
import { staffTab } from '../../drizzle/schema/staffTab'
import type { CreateAssetParams } from '../../types'

export async function createAsset({
  serialNumber,
  name,
  type,
  assignedTo,
  datePurchased,
  assetNumber,
  createdBy,
}: CreateAssetParams) {
  if (assignedTo) {
    const checkAssignedTo = await db
      .select()
      .from(staffTab)
      .where(eq(staffTab.email, assignedTo))
      .limit(1)

    if (checkAssignedTo.length === 0) {
      return {
        success: false,
        message: 'The provided email does not belong to a valid staff member',
        staff: assignedTo,
      }
    }
  }

  const alreadyRegistered = await db
    .select()
    .from(assetTab)
    .where(eq(assetTab.serialNumber, serialNumber))
    .limit(1)

  if (alreadyRegistered.length > 0) {
    return {
      success: true,
      message: 'Asset already registered',
      staff: alreadyRegistered[0].assignedTo,
    }
  }

  const newAsset = await db
    .insert(assetTab)
    .values({
      serialNumber,
      name,
      type,
      assignedTo,
      dateAssigned: assignedTo ? new Date().toISOString() : null,
      datePurchased,
      assetNumber,
      createdBy,
    })
    .returning()
  if (newAsset.length > 0) {
    return {
      success: true,
      message: 'Asset registered successfully',
      staff: newAsset[0].assignedTo,
    }
  }
}
