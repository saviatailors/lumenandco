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

/** Pre-approved Google Accounts mapped to their specific roles */
export const SUPER_ADMIN_EMAILS = [
  "sahitsai6@gmail.com",
];

export const ADMIN_EMAILS_LIST = [
  "saviatailors@gmail.com",
  "admin@lumenandco.com",
  "sahit@lumenandco.in",
];

export const MANAGER_EMAILS_LIST = [
  "santhan@lumenandco.in",
  "priya@lumenandco.in",
];

/** All permissions granted to each role */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  super_admin: [
    "crm:view",
    "crm:manage_leads",
    "crm:delete_leads",
    "crm:manage_clients",
    "crm:delete_clients",
    "crm:manage_billing",
    "crm:delete_billing",
    "crm:manage_staff",
    "delivery:view",
    "delivery:manage_tasks",
    "videos:view",
    "videos:upload",
    "videos:delete",
    "settings:view",
    "settings:manage",
    "super_admin:all",
  ],
  admin: [
    "crm:view",
    "crm:manage_leads",
    "crm:delete_leads",
    "crm:manage_clients",
    "crm:delete_clients",
    "crm:manage_billing",
    "crm:manage_staff",
    "delivery:view",
    "delivery:manage_tasks",
    "videos:view",
    "videos:upload",
    "settings:view",
    "settings:manage",
  ],
  manager: [
    "crm:view",
    "crm:manage_leads",
    "crm:manage_clients",
    "delivery:view",
    "delivery:manage_tasks",
    "videos:view",
    "videos:upload",
    "settings:view",
  ],
  employee: [
    "delivery:view",
    "delivery:manage_tasks",
    "videos:view",
  ],
};

/**
 * Returns the assigned RBAC role for a given email address.
 * Defaults to 'admin' for any authenticated Google account,
 * while reserving 'super_admin' exclusively for authorized ownership.
 */
export function getRoleForEmail(email?: string | null): UserRole {
  if (!email) return "admin";
  const clean = email.trim().toLowerCase();

  // 1. Super Admin: strictly restricted to authorized super admin email
  if (SUPER_ADMIN_EMAILS.some((e) => e.toLowerCase() === clean)) {
    return "super_admin";
  }

  // 2. Additional environment override for Super Admin
  const envSuperAdmin =
    (typeof process !== "undefined" && process.env?.["SUPER_ADMIN_EMAIL"]) ||
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPER_ADMIN_EMAIL);
  if (envSuperAdmin && String(envSuperAdmin).toLowerCase().trim() === clean) {
    return "super_admin";
  }

  // 3. Manager list
  if (MANAGER_EMAILS_LIST.some((e) => e.toLowerCase() === clean)) {
    return "manager";
  }

  // All other authenticated Google accounts are granted admin access
  return "admin";
}

/**
 * Checks whether an email is authorized for Command Center access.
 * Any authenticated Google account is permitted.
 */
export function isAuthorizedEmail(email?: string | null): boolean {
  return typeof email === "string" && email.trim().length > 0;
}

/**
 * Validates if a user role has a specific permission.
 */
export function hasPermission(role: UserRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
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

