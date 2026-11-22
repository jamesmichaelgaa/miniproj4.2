import Link from "next/link";
import { signUp } from "@/app/auth/actions";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6"><h1 className="text-3xl font-semibold">Create your account</h1><p className="mt-2 text-muted-foreground">Your financial records stay private to your account.</p>
    {error && <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm">Use a valid email and a password of at least 10 characters.</p>}
    <form action={signUp} className="mt-6 grid gap-4"><label className="grid gap-2 text-sm">Email<input name="email" type="email" autoComplete="email" required className="h-11 rounded-md border bg-background px-3" /></label><label className="grid gap-2 text-sm">Password<input name="password" type="password" minLength={10} autoComplete="new-password" required className="h-11 rounded-md border bg-background px-3" /><span className="text-xs text-muted-foreground">At least 10 characters.</span></label><button className="h-11 rounded-md bg-primary px-4 font-medium text-primary-foreground">Create account</button></form>
    <p className="mt-5 text-sm text-muted-foreground">Already registered? <Link className="text-primary underline" href="/login">Sign in</Link></p></main>;
}
