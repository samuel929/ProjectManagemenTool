"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { login } from "@/util/api";
import useStore from "@/store/useStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password);

      if (response.status === 200) {
        // Set user in Zustand store
        setUser(response.data.user);

        // Store token in cookies (secure HttpOnly cookie)
        document.cookie = `token=${
          response.data.token
        }; path=/; secure; samesite=strict${
          process.env.NODE_ENV === "production" ? "; httponly" : ""
        }`;

        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error(response.data?.message || "Login failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Login</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete='username'
              />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
              </div>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='current-password'
              />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col'>
            <Button
              type='submit'
              className='w-full my-1.5'
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{" "}
              <Link
                href='/register'
                className='text-primary underline-offset-4 hover:underline'
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
