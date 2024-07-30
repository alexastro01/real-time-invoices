import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { redirect } from 'next/navigation'
import { Session, User } from "next-auth";

interface CustomSession extends Session {
    user: User & {
      address?: string;
      // Add any other custom properties here
    };
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
    useSecureCookies: process.env.NODE_ENV === "production",
    cookies: {
        csrfToken: {
          name: "next-auth.csrf-token",
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
          },
        },
    },
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          const nextAuthUrl = new URL("http://localhost:3000")
          
          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          })

          
          
          if (result.success) {
        
            return {
              id: siwe.address,
            }
   
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    
    async session({ session, token, user }: {
        session: Session;
        token: JWT;
        user: AdapterUser;
      }): Promise<CustomSession> {
  
        return {
          ...session,
          user: {
            ...session.user,
            name: token.sub ?? session?.user?.name,
            address: token.address as string | undefined,
            // Add any other custom properties here
          },
        } as CustomSession;
        
      },
}
}