import { eq } from 'drizzle-orm'
import { db } from '../../drizzle/client'
import { staffTab } from '../../drizzle/schema/staffTab'
import type { PatchDetailsParams } from '../../types'

export async function updateStaffDetails({
  id,
  status,
  note,
  updatedBy,
}: PatchDetailsParams) {
  const staff = await db
    .select()
    .from(staffTab)
    .where(eq(staffTab.id, id))
    .limit(1)

  if (staff.length === 0) {
    return {
      success: false,
      message: 'Staff not found',
    }
  }

  // Update the staff's status and note in the database
  await db
    .update(staffTab)
    .set({ status: status, note: note })
    .where(eq(staffTab.id, id))

  // Log the change in the changeLog
  const changeLog = Array.isArray(staff[0].changeLog) ? staff[0].changeLog : []
  const newChangeLog = {
    updatedBy,
    updatedAt: new Date(),
    updatedField: 'status and note',
    previousValue: JSON.stringify({
      status: staff[0].status,
      note: staff[0].note,
    }),
    newValue: JSON.stringify({ status, note }),
  }
  const updatedChangeLog = [...changeLog, newChangeLog]
  await db
    .update(staffTab)
    .set({
      changeLog: updatedChangeLog,
    })
    .where(eq(staffTab.id, id))

  return {
    success: true,
    message: 'Staff details updated successfully',
  }
}
