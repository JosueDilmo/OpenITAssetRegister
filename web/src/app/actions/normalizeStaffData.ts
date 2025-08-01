interface staffNormalizeData {
  name: string
  email: string
  department: string
  jobTitle: string
  createdBy: string
}

export function normalizeStaffData({
  name,
  email,
  department,
  jobTitle,
  createdBy,
}: staffNormalizeData) {
  return {
    name: name.toUpperCase(),
    email: email.toLowerCase(),
    department: department.toUpperCase(),
    jobTitle: jobTitle.toUpperCase(),
    createdBy,
  }
}
