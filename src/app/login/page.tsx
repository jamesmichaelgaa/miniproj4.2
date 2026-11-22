import Link from "next/link";
import { signIn } from "@/app/auth/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const { error, message } = await searchParams;
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6"><h1 className="text-3xl font-semibold">Welcome back</h1><p className="mt-2 text-muted-foreground">Sign in to manage your finances.</p>
    {message && <p role="status" className="mt-4 rounded-md bg-secondary p-3 text-sm">Check your email to confirm your account, then sign in.</p>}
    {error && <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm">Sign in failed. Check your details and try again.</p>}
    <form action={signIn} className="mt-6 grid gap-4"><label className="grid gap-2 text-sm">Email<input name="email" type="email" autoComplete="email" required className="h-11 rounded-md border bg-background px-3" /></label><label className="grid gap-2 text-sm">Password<input name="password" type="password" autoComplete="current-password" required className="h-11 rounded-md border bg-background px-3" /></label><button className="h-11 rounded-md bg-primary px-4 font-medium text-primary-foreground">Sign in</button></form>
    <p className="mt-5 text-sm text-muted-foreground">New here? <Link className="text-primary underline" href="/signup">Create an account</Link></p></main>;
}
