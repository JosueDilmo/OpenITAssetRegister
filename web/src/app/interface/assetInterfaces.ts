export interface EditAssetInfoProps {
  data: Array<{
    id: string
    serialNumber: string
    name: string
    type: string
    assignedTo: string | null
    dateAssigned: string | null
    datePurchased: string
    assetNumber: string
    createdAt: string
    status: string
    note: string | null
  }>
  userEmail: string
  userRole: string
}

export interface AssetProps {
  success: boolean
  message: string
  assetList: {
    id: string
    serialNumber: string
    name: string
    email: string | null
  }[]
}

export interface AssetModuleProps {
  userEmail: string
}

export interface SearchAssetProps {
  email: string
  userEmail: string
  userRole: string
}

export interface assetNormalizeData {
  serialNumber: string
  name: string
  type: string
  assignedTo: string | null
  datePurchased: string
  assetNumber: string
  createdBy: string
}
