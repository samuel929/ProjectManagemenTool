/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from "@/util/api"; // adjust path if needed
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, UsersIcon } from "lucide-react";
import { toast } from "react-toastify";
import { AppState, User } from "@/types/types";
import { getInitials, getRoleBadgeVariant } from "@/util/util";

export default function UsersPage() {
  const [user, setUser] = useState<AppState>();
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user-storage");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.state.user.role !== "admin") {
        router.push("/dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!mounted || !user) return;

    const fetchUsers = async () => {
      try {
        const response = await getUsers();

        setUsers(response.data.users);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [mounted, user]);
  if (!mounted || !user || user.state.user.role !== "admin") {
    return null;
  }

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search users...'
            className='pl-8'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className='text-center py-10'>Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='rounded-full bg-muted p-3'>
            <UsersIcon className='h-6 w-6 text-muted-foreground' />
          </div>
          <h3 className='mt-4 text-lg font-semibold'>No users found</h3>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredUsers.map((user) => (
            <Card key={user._id}>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-12 w-12'>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className='font-semibold'>{user.name}</h3>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className='mt-4 space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Mail className='h-4 w-4 text-muted-foreground' />
                    <span>{user.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
