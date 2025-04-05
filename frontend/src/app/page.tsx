// import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  // In a real app, we would check authentication here
  // For demo purposes, we'll just redirect to the dashboard
  // redirect("/dashboard");

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm'>
        <h1 className='text-4xl font-bold'>Project Management System</h1>
        <div className='mt-8 flex gap-4'>
          <Button asChild>
            <Link href='/login'>Login</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/register'>Register</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
