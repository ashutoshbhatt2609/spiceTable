import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="grid gap-5">
      <div><p className="text-sm font-bold uppercase text-primary">Admin</p><h1 className="text-3xl font-black">Settings</h1></div>
      <Card>
        <CardHeader><CardTitle>Restaurant Configuration</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <p>Configure GST, invoice branding, staff permissions, QR ordering domain, and Supabase Storage bucket settings here.</p>
          <p>Current app expects a `menu-images` storage bucket for menu item photos.</p>
        </CardContent>
      </Card>
    </div>
  );
}
