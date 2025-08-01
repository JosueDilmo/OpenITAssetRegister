import { eq } from 'drizzle-orm'
import { db } from '../../drizzle/client'
import { assetTab } from '../../drizzle/schema/assetTab'
import { staffTab } from '../../drizzle/schema/staffTab'
import type { AssignAssetWithConfirmationParams } from '../../types'

export async function assignAssetToStaffWithConfirmation({
  userConfirmed,
  staffEmail,
  assetId,
  updatedBy,
}: AssignAssetWithConfirmationParams) {
  // Begin Transaction
  return db
    .transaction(async trx => {
      // Check if the new email belongs to a staff
      const staff = await trx
        .select()
        .from(staffTab)
        .where(eq(staffTab.email, staffEmail))
        .limit(1)
      if (staff.length === 0) {
        return {
          success: false,
          message: 'The provided email does not belong to a valid staff member',
        }
      }

      // Find the current asset assignment
      const asset = await trx
        .select()
        .from(assetTab)
        .where(eq(assetTab.id, assetId))
        .limit(1)
      if (asset.length === 0) {
        return {
          success: false,
          message: 'Asset not found',
        }
      }
      const previousAssignedTo = asset[0].assignedTo

      // If the asset was previously assigned and user has not confirmed, return question if wants to reassign asset
      if (
        previousAssignedTo &&
        previousAssignedTo !== staffEmail &&
        !userConfirmed
      ) {
        return {
          success: false,
          message: `Asset is already assigned to ${previousAssignedTo}. Do you want to reassign it?`,
        }
      }

      // Assign asset to new staff (update asset record))
      await trx
        .update(assetTab)
        .set({ assignedTo: staffEmail, dateAssigned: new Date().toISOString() })
        .where(eq(assetTab.id, assetId))

      // Update staff assetHistoryList (append assetID if not already present)
      const currentAssetHistory: string[] = Array.isArray(
        staff[0].assetHistoryList
      )
        ? staff[0].assetHistoryList
        : []

      const updatedAssetHistory = currentAssetHistory.includes(assetId)
        ? currentAssetHistory
        : [...currentAssetHistory, assetId]
      await trx
        .update(staffTab)
        .set({ assetHistoryList: updatedAssetHistory })
        .where(eq(staffTab.email, staffEmail))

      // Update changeLog in assetTab
      const prevChangeLog = Array.isArray(asset[0].changeLog)
        ? asset[0].changeLog
        : []
      const newChangeLog = {
        updatedBy,
        updatedAt: new Date(),
        updatedField: 'assignedTo',
        previousValue: asset[0].assignedTo,
        newValue: staffEmail,
      }
      const updatedChangeLog = [...prevChangeLog, newChangeLog]
      await trx
        .update(assetTab)
        .set({ changeLog: updatedChangeLog })
        .where(eq(assetTab.id, assetId))
      return {
        success: true,
        message: 'Asset assigned successfully',
      }
    })
    .catch(error => {
      console.error('Error assigning asset:', error)
      return {
        success: false,
        message: 'An error occurred while assigning the asset',
      }
    })
}
