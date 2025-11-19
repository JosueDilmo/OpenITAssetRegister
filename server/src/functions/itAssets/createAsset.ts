import { eq } from 'drizzle-orm'
import { db } from '../../drizzle/client'
import { assetTab } from '../../drizzle/schema/assetTab'
import { staffTab } from '../../drizzle/schema/staffTab'
import { ERROR_MESSAGES } from '../../errors/errorMessages'
import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  DatabaseError,
  NotFoundError,
} from '../../errors/errorTypes'
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
  try {
    // Check if staff exists when assignedTo is provided
    if (assignedTo) {
      const checkAssignedTo = await db
        .select()
        .from(staffTab)
        .where(eq(staffTab.email, assignedTo))
        .limit(1)

      if (checkAssignedTo.length === 0) {
        throw new NotFoundError(`Staff with email ${assignedTo} not found`)
      }
    }

    // Check if asset already registered
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

    // Create new asset
    return await db.transaction(async tx => {
      const newAsset = await tx
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

      // Check if asset creation was successful
      if (newAsset.length === 0) {
        throw new DatabaseError(ERROR_MESSAGES.DATABASE_CONNECTION_ERROR)
      }

      // Return success message with assigned staff if applicable
      return {
        success: true,
        message: 'Asset registered successfully',
        staff: newAsset[0].assignedTo,
      }
    })
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof AuthorizationError ||
      error instanceof ConflictError ||
      error instanceof AuthenticationError
    ) {
      throw error
    }

    // Log unexpected errors
    console.error('Error assigning asset:', error)
    throw new DatabaseError(ERROR_MESSAGES.ASSET_ASSIGNMENT_FAILED, error)
  }
}
