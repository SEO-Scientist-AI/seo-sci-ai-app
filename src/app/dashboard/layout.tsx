import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { getThemeToggler } from "@/lib/theme/get-theme-button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/");
  }

  return children;
} 