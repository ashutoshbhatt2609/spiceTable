"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, CheckCircle } from "lucide-react";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone:    z.string().optional(),
  role:     z.enum(["admin", "manager", "cashier", "waiter", "kitchen"]),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const [success, setSuccess] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "waiter" },
  });

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email:    values.email,
      password: values.password,
    });
    if (error) { form.setError("root", { message: error.message }); return; }
    if (data.user) {
      const { error: profileErr } = await supabase.from("profiles").insert({
        id:    data.user.id,
        name:  values.name,
        email: values.email,
        phone: values.phone ?? null,
        role:  values.role,
      });
      if (profileErr) { form.setError("root", { message: profileErr.message }); return; }
    }
    setSuccess(true);
    form.reset();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="size-5 text-[hsl(var(--primary))]" />
          Register Staff
        </CardTitle>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Admin-controlled staff account creation.</p>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle className="size-12 text-[hsl(var(--success))]" />
            <p className="font-bold text-lg">Account Created!</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Staff account created successfully. They may need to confirm their email.
            </p>
            <Button variant="secondary" onClick={() => setSuccess(false)}>Add Another</Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <Input placeholder="Full Name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-xs text-[hsl(var(--destructive))]">{form.formState.errors.name.message}</p>}

            <Input placeholder="Email address" type="email" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-xs text-[hsl(var(--destructive))]">{form.formState.errors.email.message}</p>}

            <Input placeholder="Password (min 6 characters)" type="password" {...form.register("password")} />
            {form.formState.errors.password && <p className="text-xs text-[hsl(var(--destructive))]">{form.formState.errors.password.message}</p>}

            <Input placeholder="Phone (optional)" {...form.register("phone")} />

            <Select {...form.register("role")}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
              <option value="waiter">Waiter</option>
              <option value="kitchen">Kitchen Staff</option>
            </Select>

            {form.formState.errors.root && (
              <p className="rounded-lg bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.3)] px-3 py-2 text-sm text-[hsl(var(--destructive))]">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button type="submit" loading={form.formState.isSubmitting}>
              Create Staff Account
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
