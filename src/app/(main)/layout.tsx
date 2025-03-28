import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { headers } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "/dashboard";

  if (!session?.user) {
    redirect("/");
  }

  return <DashboardLayout>{children}</DashboardLayout>; 
}
