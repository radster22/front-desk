"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import Sidebar from "@/app/dashboard/sidebar";

const RequestsPage = () => {
  return (
    <SessionProvider>
      <RequestsForm />
    </SessionProvider>
  );
};

const RequestsForm = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [isManualEntry, setIsManualEntry] = useState(false);

  const [formData, setFormData] = useState({
    submitter: "",
    requestType: "service",
    priority: "unassigned",
    status: "new",
    requestTitle: "",
    details: "",
    phone: "",
  });

  useEffect(() => {
    if (session?.user) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch("/api/auth/session");
          if (!response.ok) throw new Error("Failed to fetch user profile");

          const userData = await response.json();
          if (!userData?.user) throw new Error("User data missing");

          setUser({
            name: userData.user.name || "",
            email: userData.user.email || "",
          });

          setFormData((prev) => ({
            ...prev,
            submitter: userData.user.name || "",
          }));
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setIsManualEntry(true);
        }
      };

      fetchUserProfile();
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit request");

      alert("Request submitted successfully!");
      router.push("/dashboard/external");
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">New Request</h2>

        <form onSubmit={handleSubmit} className="bg-grey-100 p-6">
          {/* Name & Email Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input
                type="text"
                name="submitter"
                value={formData.submitter}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                disabled={!isManualEntry && !!user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Phone & Request Title Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Request Title</label>
              <input
                type="text"
                name="requestTitle"
                value={formData.requestTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
                placeholder="Enter request title"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Request Type */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Request Type</label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="service">Service</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            {/* Priority Selection */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="unassigned">Unassigned</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Details */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-gray-100 h-32"
              placeholder="Enter request details"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/dashboard/external")}
              className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800"
            >
              Submit Request
            </button>
          </div>
        </form>

        {isManualEntry && (
          <p className="mt-4 text-red-600">
            Unable to fetch profile. Please enter your email manually.
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
