"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <LogOut className="h-4 w-4" />
      </Button>
    </form>
  );
}