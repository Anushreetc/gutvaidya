export const ADMIN_EMAILS: readonly string[] = [
  "anushreetc678@gmail.com",
  "gutvaidya@gmail.com",
  "mr.sohan0507@gmail.com",
  "admin@thegutvaidya.com",
];

export function isEmailAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(normalized);
}

