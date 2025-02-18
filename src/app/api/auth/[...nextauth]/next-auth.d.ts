import "next-auth"; // No need to import `NextAuth` explicitly

// Extend the User type to include "role"
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role?: string;  // Adding role field (optional)
  }

  interface Session {
    user?: User;
    accessToken?: string; // Adding accessToken field
  }
  interface JWT {
    role?: string;
  }
}


