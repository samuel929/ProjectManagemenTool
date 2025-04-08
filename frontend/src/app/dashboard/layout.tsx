"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  LogOut,
  Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { AppState } from "@/types/types";
import { getInitials } from "@/util/util";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AppState>();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast("You have been successfully logged out");
    router.push("/login");
  };

  if (!mounted || !user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className='flex h-screen overflow-hidden'>
        <Sidebar>
          <SidebarHeader className='flex h-14 items-center border-b px-6'>
            <div className='flex items-center gap-2 font-semibold'>
              <FolderKanban className='h-6 w-6' />
              <span>Project Hub</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip='Dashboard'
                >
                  <Link href='/dashboard'>
                    <LayoutDashboard className='h-5 w-5' />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/projects"}
                  tooltip='Projects'
                >
                  <Link href='/dashboard/projects'>
                    <FolderKanban className='h-5 w-5' />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user.state.user.role === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/users"}
                    tooltip='Users'
                  >
                    <a href='/dashboard/users'>
                      <Users className='h-5 w-5' />
                      <span>Users</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className='border-t p-4'>
            <div className='flex items-center justify-between'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='flex items-center gap-2 p-2 hover:bg-accent'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={""} alt={user.state.user.name} />
                      <AvatarFallback>
                        {getInitials(user.state.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col items-start text-sm'>
                      <span className='font-medium'>
                        {user.state.user.name}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {user.state.user.role}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className='flex items-center gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='relative'>
                      <Bell className='h-5 w-5' />
                      <Badge className='absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center'>
                        3
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-80'>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className='max-h-80 overflow-auto'>
                      {[1, 2, 3].map((i) => (
                        <DropdownMenuItem
                          key={i}
                          className='flex flex-col items-start p-4'
                        >
                          <div className='font-medium'>
                            Task assigned to you
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            You have been assigned a new task in Project Alpha
                          </div>
                          <div className='mt-1 text-xs text-muted-foreground'>
                            {new Date().toLocaleTimeString()} -{" "}
                            {new Date().toLocaleDateString()}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='justify-center font-medium'>
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className='flex flex-1 flex-col overflow-hidden'>
          <header className='flex h-14 items-center gap-4 border-b bg-background px-6'>
            <SidebarTrigger />
            <div className='flex-1'>
              <h1 className='text-lg font-semibold'>
                {pathname === "/dashboard" && "Dashboard"}
                {pathname === "/dashboard/projects" && "Projects"}
                {pathname === "/dashboard/users" && "Users"}
              </h1>
            </div>
          </header>
          <main className='flex-1 overflow-auto p-6'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
