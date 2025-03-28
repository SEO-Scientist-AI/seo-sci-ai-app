import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { headers } from "next/headers";

interface MainLayoutProps {
  children: React.ReactNode;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function MainLayout({
  children,
  searchParams,
}: MainLayoutProps) {
  const session = await auth();
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "/dashboard";

  console.log("MainLayout - searchParams:", searchParams);

  if (!session?.user) {
    redirect("/");
  }

  // Make sure searchParams is defined before passing it
  const safeSearchParams = searchParams || {};  

  return <DashboardLayout searchParams={safeSearchParams}>{children}</DashboardLayout>; 
}
