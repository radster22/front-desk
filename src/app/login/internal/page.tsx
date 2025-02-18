"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react"; // Import both `signIn` and `useSession`
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";

function InternalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session, status } = useSession(); // Get session info and status
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // If email or password is empty, show an error
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    // Proceed to sign in
    const response = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    console.log("Sign-in response:", response); // Debugging

    if (response?.error) {
      console.error("Login error:", response.error); // Log the error
      setErrorMessage("Invalid email or password");
    } else {
      console.log("Login success! Redirecting...");
    }
  };

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session user:", session?.user);

    if (status === "authenticated" && session?.user?.role) {
      if (session.user.role === "internal") {
        router.push("/dashboard/internal");
      } else if (session.user.role === "external") {
        router.push("/dashboard/external");
      }
    }
  }, [status, session, router]); // Trigger on session or status change

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-20 text-blue-900">Front Desk</h1>

      <form onSubmit={handleLogin} className="w-full max-w-md p-6">
        {/* Email Caption */}
        <div className="w-full max-w-md p-6">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold mb-2 font-arial">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-semibold mb-2 font-arial">
                Password
              </label>
              {/* change href */}
              <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">
              {errorMessage}
            </div>
          )}

          {/* Remember me Checkbox */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="remember"
              className="mr-2 rounded-sm"
            />
            <label htmlFor="remember" className="text-sm">Remember for 30 days</label>
          </div>

          {/* Sign in button */}
          <button type="submit" className="w-full py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
            Sign In
          </button>

          {/* OR caption */}
          <div className="flex items-center justify-center mt-8 mb-20">
            <span className="flex-1 border-t border-gray-300"></span>
            <span className="mx-2">Or</span>
            <span className="flex-1 border-t border-gray-300"></span>
          </div>

          {/* Sign in with Google and Apple buttons */}
          <div className="flex gap-4 mb-6">
            {/* Google Sign-In Button */}
            <button
              onClick={() => signIn("google")}
              className="w-full py-2 bg-white text-black border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              <Image
                src="/google.png" // Add your Google logo path here
                alt="Google Logo"
                width={20}
                height={20}
              />
              Sign in with Google
            </button>

            {/* Apple Sign-In Button */}
            <button className="w-full py-2 bg-white text-black border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              <Image
                src="/apple.png" // Add your Apple logo path here
                alt="Apple Logo"
                width={20}
                height={20}
              />
              Sign in with Apple
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <p className="text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup/internal" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function Internal() {
  return (
    <SessionProvider>
      <InternalPage />
    </SessionProvider>
  );
}
