import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  const { data: profile, error: profileError } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null, error: null };

  return NextResponse.json({
    user: user ? { id: user.id, email: user.email } : null,
    userError: userError?.message ?? null,
    profile,
    profileError: profileError?.message ?? null,
  });
}
