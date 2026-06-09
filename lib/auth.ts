import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

export const roleAccess: Record<string, Role[]> = {
  "/dashboard": ["admin", "manager", "cashier", "waiter", "kitchen"],
  "/tables": ["admin", "manager", "waiter"],
  "/menu": ["admin", "manager"],
  "/orders": ["admin", "manager", "cashier", "waiter"],
  "/kitchen": ["admin", "manager", "kitchen"],
  "/customers": ["admin", "manager", "cashier", "waiter"],
  "/reservations": ["admin", "manager", "waiter"],
  "/inventory": ["admin", "manager"],
  "/billing": ["admin", "manager", "cashier"],
  "/payments": ["admin", "manager", "cashier"],
  "/reports": ["admin", "manager"],
  "/settings": ["admin"]
};

export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data as Profile | null;
}

export async function requireProfile(allowed?: Role[]) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login");
  if (allowed && !allowed.includes(profile.role)) redirect("/dashboard");
  return profile;
}
