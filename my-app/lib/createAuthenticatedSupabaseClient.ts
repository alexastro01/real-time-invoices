// File: lib/supabaseAuth.ts

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { Session } from 'next-auth';

export function createAuthenticatedSupabaseClient(session: Session | null) {

    //@ts-ignore
  if (!session || !session.user?.address) {
    throw new Error('Invalid session or missing user address');
  }
    //@ts-ignore
  const userAddress = session.user.address;

  // Generate Supabase JWT
  const supabaseJwtPayload = {
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
    sub: userAddress,
    role: 'authenticated',
  };

  const supabaseToken = jwt.sign(
    supabaseJwtPayload,
    process.env.SUPABASE_JWT_SECRET!
  );

  // Create and return Supabase client with the generated JWT
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${supabaseToken}` } },
    }
  );
}