// import { eq } from 'drizzle-orm'
// import { db } from '../../drizzle/client'
// import { assetTab } from '../../drizzle/schema/assetTab'
// import { staffTab } from '../../drizzle/schema/staffTab'

// export async function assignAssetToStaff({
//   id,
//   assignedTo,
//   updatedBy,
// }: AssignAssetParams) {
//   // Check if the new email belongs to a staff
//   const staffExists = await db
//     .select()
//     .from(staffTab)
//     .where(eq(staffTab.email, assignedTo))
//     .limit(1)

//   if (staffExists.length === 0) {
//     return {
//       success: false,
//       message: 'The provided email does not belong to a valid staff member',
//     }
//   }

//   // Find the current asset
//   const currentAsset = await db
//     .select()
//     .from(assetTab)
//     .where(eq(assetTab.id, id))
//     .limit(1)

//   if (currentAsset.length > 0) {
//     const previousAssignedTo = currentAsset[0].assignedTo

//     // If the asset was previously assigned, remove it from the previous staff's assetList
//     if (previousAssignedTo) {
//       const previousStaff = await db
//         .select()
//         .from(staffTab)
//         .where(eq(staffTab.email, previousAssignedTo))
//         .limit(1)

//       if (previousStaff.length > 0) {
//         const previousAssetList = Array.isArray(
//           previousStaff[0].assetHistoryList
//         )
//           ? previousStaff[0].assetHistoryList
//           : []
//         const updatedPreviousAssetList = previousAssetList.filter(
//           (assetId: string) => assetId !== id
//         )

//         await db
//           .update(staffTab)
//           .set({ assetHistoryList: updatedPreviousAssetList })
//           .where(eq(staffTab.email, previousAssignedTo))
//       }
//     }
//   }

//   // Update the assetTab with the new assignedTo email
//   const assignAsset = await db
//     .update(assetTab)
//     .set({ assignedTo, dateAssigned: new Date().toISOString() })
//     .where(eq(assetTab.id, id))
//     .returning()

//   if (assignAsset) {
//     // Select the staff where the email matches the new assignedTo email
//     const staffToUpdate = await db
//       .select()
//       .from(staffTab)
//       .where(eq(staffTab.email, assignedTo))
//       .limit(1)

//     if (staffToUpdate.length > 0) {
//       // Get the current assetList or initialize it as an empty array
//       const currentAssetList = staffToUpdate[0].assetHistoryList || []

//       // Add the new asset ID to the list, ensuring no duplicates
//       const updatedAssetList = Array.isArray(currentAssetList)
//         ? [...new Set([...currentAssetList, id])]
//         : [id]

//       // Update the staffTab with the new assetList
//       await db
//         .update(staffTab)
//         .set({ assetHistoryList: updatedAssetList })
//         .where(eq(staffTab.email, assignedTo))
//     }
//   }

//   // Update the changeLog in the assetTab
//   // Get the current changeLog or initialize it as an empty array
//   const changeLog = Array.isArray(currentAsset[0].changeLog)
//     ? currentAsset[0].changeLog
//     : []
//   const newChangeLog = {
//     updatedBy,
//     updatedAt: new Date(),
//     updatedField: 'assignedTo',
//     previousValue: currentAsset[0].assignedTo,
//     newValue: assignedTo,
//   }
//   const updatedChangeLog = [...changeLog, newChangeLog]
//   await db
//     .update(assetTab)
//     .set({
//       changeLog: updatedChangeLog,
//     })
//     .where(eq(assetTab.id, id))

//   return {
//     success: true,
//     message: 'Asset assigned successfully',
//   }
// }
