// Server component: enforces admin access at the request layer so that no
// client-only check can be bypassed. The visible UI shell is in AdminShell.tsx.
import { requireAdminPage } from "@/lib/supabase/auth";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <AdminShell>{children}</AdminShell>;
}
