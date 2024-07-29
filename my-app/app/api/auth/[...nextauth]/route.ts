import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(authOptions)(req, res)
}

export { handler as GET, handler as POST }