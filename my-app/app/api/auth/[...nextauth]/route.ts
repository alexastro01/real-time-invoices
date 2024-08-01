import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Use NextAuth as a function that returns a handler
    const authHandler = NextAuth(authOptions);
    // Call the handler with the request and response
    return authHandler(req, res);
}

// Export the handler as both GET and POST methods
export { handler as GET, handler as POST }