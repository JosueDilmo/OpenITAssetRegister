# IT Asset Register

**IT Asset Register** is an internal full-stack web application designed for managing and registering IT assets within company. This tool provides a centralized system to keep track of all IT assets, as well as the employees currently assigned to each asset.

> **Note:** This tool is still under development.

## Why This Project?

As the only employee in the IT department, I found that our company did not have any management system for IT assets. Rather than relying on Excel sheets for manual tracking—which can be error-prone and hard to maintain—I decided to develop my own system. This web app ensures better accountability and makes it easier to provide records if they are ever requested.

---

## Key Features

- **Asset Management**
  - Create, edit, and list assets.
  - Track detailed asset information: serial number, type, status, assigned staff, purchase/assignment dates, asset number, notes, and changelogs.
  - Assign and unassign assets to staff, with tracking of assignment history.

- **Staff Management**
  - Create, edit, and list staff.
  - Track staff details: name, email, department, job title, status, note, asset history, and changelog.
  - Update staff status and notes.

- **Assignment & Removal**
  - Assign assets to staff with confirmation for reassignment.
  - Remove asset assignments with consistent historical tracking.
  - Assignment and removal logic updates both asset and staff history, and logs all changes.

- **Authentication & Authorization**
  - User login via Microsoft Entra ID.
  - Role-based access: "admin" (full access), "viewer" (read-only).
  - Only users with organization emails can sign in.

- **Audit Trails**
  - Change logs for both assets and staff, maintaining history of all changes with who, when, and what was changed.

- **User Interface**
  - Admin dashboard for asset and staff management.
  - Detail and edit pages for assets and staff, with permissions based on user roles.
  - Responsive and modern UI using React, Next.js, and Tailwind CSS.

---

## Tech Stack

- **Backend**: Node.js (TypeScript), Fastify, Drizzle ORM, custom route handlers, OpenAPI (with Orval for API client generation).
- **Frontend**: Next.js (React), TypeScript, Tailwind CSS, React Hook Form, Zod for validation.
- **Authentication**: next-auth with Microsoft Entra ID provider.
- **Database**: Accessed via Drizzle ORM, ensuring type safety and maintainability.
- **API**: OpenAPI-based, providing a clear contract between frontend and backend.

---

## Data Integrity & Security

- Transactional updates for assignments to prevent data inconsistencies.
- Role-based access enforced both in frontend and backend.
- Append-only asset history to preserve all past assignments for audit and compliance.

---

## Test

> **Working on it.** 

---

## Getting Started

> **Project is currently under active development. Setup and usage instructions will be provided soon.**

## Contributing

Please open an issue or pull request to discuss any changes.

## License

This project is intended for internal use. License details to be determined.

---

*Developed by [JosueDilmo](https://github.com/JosueDilmo) for internal IT asset management within the company.*
