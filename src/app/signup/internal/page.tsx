"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SessionProvider, signIn } from "next-auth/react";

function InternalPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error messages
    setLoading(true);

    if (!name || !email || !password) {
      setErrorMessage("All fields are required.");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("You must agree to the terms and policies.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      try {
        data = await response.json(); // Attempt to parse JSON
      } catch (error) {
        console.error("Response is not valid JSON:", error);
        setErrorMessage("Error: Could not parse server response.");
        return;
      }

      if (!response.ok) {
        setErrorMessage(data?.error || "Something went wrong.");
        return;
      }

      const userRole = data?.role || "external"; // Default to "external" if not provided
      // Redirect to dashboard after successful sign-up
      if (userRole === "internal") {
        router.push("/login/internal");
      } else if (userRole) {
        router.push("/login/internal");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full flex justify-center mb-10">
        <h1 className="text-2xl font-bold text-black">Get Started Now</h1>
      </div>

      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <form onSubmit={handleSignUp}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          {/* Terms Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              className="mr-2"
              required
            />
            <label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <a
                href="/terms"
                className="text-blue-500 underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                terms & policy
              </a>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center justify-center my-6">
          <span className="flex-1 border-t border-gray-300"></span>
          <span className="mx-2 text-sm">Or</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </div>

        {/* Google & Apple Sign-In */}
        <div className="flex gap-4">
          {/* Google Sign-In */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full py-2 bg-white text-black border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <Image src="/google.png" alt="Google Logo" width={20} height={20} />
            Sign in with Google
          </button>

          {/* Apple Sign-In */}
          <button className="w-full py-2 bg-white text-black border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
            <Image src="/apple.png" alt="Apple Logo" width={20} height={20} />
            Sign in with Apple
          </button>
        </div>

        {/* Sign-in Link */}
        <div className="text-center text-sm mt-4">
          <p className="text-gray-500">
            Have an account?{" "}
            <Link href="/login/internal" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
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
