type AdminSession = { id: number; name: string; pin: string; is_admin: boolean };

let session: AdminSession | null = null;

export function setShowcaseAdmin(sessionValue: AdminSession | null) {
  session = sessionValue;
}

export function getShowcaseAdmin() {
  return session;
}

export function getShowcaseAdminPin() {
  return session?.pin ?? null;
}
