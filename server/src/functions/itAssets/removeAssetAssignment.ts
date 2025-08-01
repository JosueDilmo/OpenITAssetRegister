import { eq } from 'drizzle-orm'
import { db } from '../../drizzle/client'
import { assetTab } from '../../drizzle/schema/assetTab'
import type { DeleteAssetParams } from '../../types'

export async function removeAssetAssignment({
  assetId,
  updatedBy,
}: DeleteAssetParams) {
  // Check if assetID is provided
  if (!assetId) {
    return {
      success: false,
      message: 'Asset ID is required',
    }
  }

  // Begin Transaction
  return db
    .transaction(async trx => {
      // Get the asset to be removed
      const assetResult = await trx
        .select()
        .from(assetTab)
        .where(eq(assetTab.id, assetId))
        .limit(1)
      if (assetResult.length === 0) {
        return {
          success: false,
          message: 'Asset not found',
        }
      }

      const asset = assetResult[0]
      const prevAssignedTo = asset.assignedTo

      // Unassign the asset (clear assignedTo and dateAssigned)
      const assetRemoved = await trx
        .update(assetTab)
        .set({ assignedTo: '', dateAssigned: '' })
        .where(eq(assetTab.id, assetId))
        .returning()

      // Update the asset's changeLog (appen new entry)
      const prevChangeLog = Array.isArray(asset.changeLog)
        ? asset.changeLog
        : []
      const newChangeLog = {
        updatedBy,
        updatedAt: new Date(),
        updatedField: 'assignedTo',
        previousValue: prevAssignedTo,
        newValue:
          'EMPTY - Asset removed from previous user and date assigned cleared',
      }
      const updatedChangeLog = [...prevChangeLog, newChangeLog]
      await trx
        .update(assetTab)
        .set({
          changeLog: updatedChangeLog,
        })
        .where(eq(assetTab.id, assetId))

      // Return success message
      if (assetRemoved.length === 0) {
        return {
          success: false,
          message: 'Failed to remove asset',
        }
      }
      return {
        success: true,
        message: 'Asset removed successfully',
      }
    })
    .catch(error => {
      console.error('Error removing asset assignment:', error)
      return {
        success: false,
        message: 'An error occurred while removing the asset assignment',
      }
    })
}
