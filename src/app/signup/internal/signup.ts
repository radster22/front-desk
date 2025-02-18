import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      await db.insert(users).values({
        name,
        email,
        passwordHash: hashedPassword,
        provider: "credentials", // Set provider as "credentials" for email/password signup
        providerId: email, // Use the email as the providerId
        role: "external",  // Set the default role
        createdAt: sql`CURRENT_TIMESTAMP`,  // Optional: Add createdAt timestamp
      });

      return res.status(200).json({ message: "Sign-up successful" });
    } catch (error) {
      console.error("Error during sign-up:", error);
      return res.status(500).json({ error: "Something went wrong during sign-up." });
    }
  } else {
    // Method Not Allowed
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
