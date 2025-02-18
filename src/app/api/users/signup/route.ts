import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    // Parse JSON request body
    const { name, email, password } = await req.json();

    // Validate input fields
    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
      provider: "credentials", // Set provider as "credentials" for email/password sign-up
      providerId: email, // Use email as providerId
      role: "external", // Set default role
    });

    return Response.json({ message: "Sign-up successful" }, { status: 201 });
  } catch (error) {
    console.error("Error during sign-up:", error);
    return Response.json(
      { error: "Something went wrong during sign-up." },
      { status: 500 }
    );
  }
};
