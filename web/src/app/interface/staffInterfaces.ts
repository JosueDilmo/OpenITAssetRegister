export interface EditStaffInfoProps {
  data: Array<{
    id: string
    name: string
    email: string
    department: string
    jobTitle: string
    status: string
    note: string | null
    assetHistoryList: string[]
    createdAt: string
  }>
  userEmail: string
  userRole: string
}

export interface EditStaffAssetListProps {
  email: string
  userEmail: string
  userRole: string
}

export interface StaffModuleProps {
  userEmail: string
}

export interface staffNormalizeData {
  name: string
  email: string
  department: string
  jobTitle: string
  createdBy: string
}
