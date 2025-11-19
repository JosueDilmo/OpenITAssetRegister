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
    name: name.toUpperCase().trim(),
    email: email.toLowerCase().trim(),
    department: department.toUpperCase().trim(),
    jobTitle: jobTitle.toUpperCase().trim(),
    createdBy,
  }
}
