/**
 * Role-Based Access Control (RBAC) System for Lumen & Co Internal CRM — Command Center
 * 
 * Defines authorized roles, pre-approved Google accounts, permissions,
 * and security policy enforcement across both frontend and backend.
 */

export type UserRole = "super_admin" | "admin" | "manager" | "employee";

export type Permission =
  | "crm:view"
  | "crm:manage_leads"
  | "crm:delete_leads"
  | "crm:manage_clients"
  | "crm:delete_clients"
  | "crm:manage_billing"
  | "crm:delete_billing"
  | "crm:manage_staff"
  | "delivery:view"
  | "delivery:manage_tasks"
  | "videos:view"
  | "videos:upload"
  | "videos:delete"
  | "settings:view"
  | "settings:manage"
  | "super_admin:all";

/** The exclusive, sole email address authorized for Lumen & Co Command Center access */
export const EXCLUSIVE_AUTHORIZED_EMAIL = "sahitsai6@gmail.com";

export const SUPER_ADMIN_EMAILS = [EXCLUSIVE_AUTHORIZED_EMAIL];

/**
 * Returns the assigned RBAC role for a given email address.
 * Strictly restricted to sahitsai6@gmail.com.
 * Returns null for any other email.
 */
export function getRoleForEmail(email?: string | null): UserRole | null {
  if (!email) return null;
  const clean = email.trim().toLowerCase();

  if (clean === EXCLUSIVE_AUTHORIZED_EMAIL.toLowerCase()) {
    return "super_admin";
  }

  // Strictly no other account permitted
  return null;
}

/**
 * Checks whether an email is authorized for Command Center access.
 * Strictly allows sahitsai6@gmail.com only.
 */
export function isAuthorizedEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === EXCLUSIVE_AUTHORIZED_EMAIL.toLowerCase();
}

/**
 * Validates if a user role has a specific permission.
 */
export function hasPermission(role: UserRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;
  return false;
}

/**
 * Returns human-readable label for a role.
 */
export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "super_admin":
      return "Super Admin (Owner)";
    case "admin":
      return "Executive Admin";
    case "manager":
      return "Operations Manager";
    case "employee":
      return "Lumen Staff";
    default:
      return "Authorized Personnel";
  }
}

/**
 * Returns Tailwind CSS badge color classes for a role.
 */
export function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case "super_admin":
      return "bg-[#ef4d23]/25 text-[#fed7aa] border border-[#ef4d23]/50";
    case "admin":
      return "bg-blue-500/20 text-blue-200 border border-blue-500/40";
    case "manager":
      return "bg-purple-500/20 text-purple-200 border border-purple-500/40";
    case "employee":
      return "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40";
    default:
      return "bg-neutral-500/20 text-neutral-300 border border-neutral-500/40";
  }
}

