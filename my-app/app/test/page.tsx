import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';
import { Session } from "next-auth";

interface ExtendedSession extends Session {
  user: {
    address?: string;
  } & Session["user"];
}

async function getAddress(): Promise<string | null> {
  const session = await getServerSession(authOptions) as ExtendedSession | null;
  
  // Use the correct way to get token in a server component
  const token = await getToken({
    req: {
      cookies: cookies().getAll(),
      headers: Object.fromEntries(headers().entries()),
    } as any,
  }) as { address?: string } | null;

  return token?.address ?? session?.user?.address ?? null;
}

export default async function AuthenticatedPage() {
  const address = await getAddress();

  return address ? (
    <h1>Authenticated as {address}</h1>
  ) : (
    <h1>Unauthenticated</h1>
  );
}