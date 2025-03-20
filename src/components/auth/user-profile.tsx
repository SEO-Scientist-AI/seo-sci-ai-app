import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { DashboardIcon } from "@radix-ui/react-icons"
import {
    LogOut,
    Pen,
    Settings
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function UserProfile() {
    const router = useRouter()
    const { data: session } = useSession()

    if (!session) {
        return null
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-[2.25rem] h-[2.25rem]">
                <Avatar>
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'User Profile'} />
                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/dashboard/settings">
                        <DropdownMenuItem>
                            <Pen className="mr-2 h-4 w-4" />
                            <span>My Listing</span>
                            <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard">
                        <DropdownMenuItem>
                            <DashboardIcon className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/settings">
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
