import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest } from 'next/server'

async function handler(request: NextRequest) {
    try {
        // NextAuth for App Router expects a Request object
        return await NextAuth(authOptions)(request)
    } catch (error) {
        console.error('NextAuth Error:', error)
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        }), { status: 500 })
    }
}

export { handler as GET, handler as POST }