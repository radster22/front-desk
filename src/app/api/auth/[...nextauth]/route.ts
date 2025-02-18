import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, User } from "next-auth";  // Import types
import { JWT } from "next-auth/jwt";

interface CustomJWT extends JWT {
  id?: string;
  role?: string;
}

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials!;

        // Fetch user and compare passwords (sign-in)
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (user.length === 0 || !user[0].email) {
          throw new Error("No user found with this email.");
        }

        if (!user[0].passwordHash){
          throw new Error("No password entered")
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].passwordHash);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: user[0].id.toString(),
          name: user[0].name,
          email: user[0].email,
          role: user[0].role ?? "external",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login/internal", // Customize to match your path
    //error: "/auth/error",   // Customize to match your path
  },
  callbacks: {

    async jwt({ token, user }: {token: CustomJWT; user?: User}) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? 'external'; // Ensure role is passed into JWT
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: CustomJWT }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "external";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const, // Use JWT strategy for session handling
  },
};

export const POST = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);  // Named export for POST
export const GET = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);  // Named export for GET