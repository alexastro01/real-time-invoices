import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextApiRequest, NextApiResponse } from "next"

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      return await NextAuth(authOptions)(req, res)
    } catch (error) {
      console.error('NextAuth Error:', error)
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  }
  
  export { handler as GET, handler as POST }