interface assetNormalizeData {
  serialNumber: string
  name: string
  type: string
  assignedTo: string | null
  datePurchased: string
  assetNumber: string
  createdBy: string
}

export function normalizeAssetData({
  serialNumber,
  name,
  type,
  assignedTo,
  datePurchased,
  assetNumber,
  createdBy,
}: assetNormalizeData) {
  return {
    serialNumber: serialNumber.toUpperCase().trim(),
    name: name.toUpperCase().trim(),
    type: type.toUpperCase().trim(),
    assignedTo: assignedTo?.toLowerCase().trim() || null,
    datePurchased: datePurchased.trim(),
    assetNumber: assetNumber.toUpperCase().trim(),
    createdBy: createdBy.trim(),
  }
}
