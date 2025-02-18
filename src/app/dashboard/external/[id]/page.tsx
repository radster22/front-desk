"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/dashboard/sidebar";

interface RequestType {
  id: number;
  name: string;
  type: string;
  priority: string;
  status: string;
  createdAt: string;
  changedAt?: string;
  phone: string;
  email?: string;
  requestTitle: string;
  details: string;
  requestCount?: number; // Total number of requests by this user
}

const RequestDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<RequestType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(`/api/requests/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch request: ${response.status}`);

        const data = await response.json();

        const formattedData: RequestType = {
          id: data.requests.id,
          name: data.requests.name,
          type: data.requests.type,
          priority: data.requests.priority,
          status: data.requests.status,
          createdAt: data.requests.createdAt,
          changedAt: data.requests.changedAt,
          phone: data.requests.phone,
          email: data.users?.email || "",
          requestTitle: data.requests.requestTitle,
          details: data.requests.details,
          requestCount: data.requestCount || 0, // Total requests by this user
        };

        setRequest(formattedData);
      } catch (error) {
        setError("Error fetching request details.");
        console.error(error);
      }
    };

    if (id) fetchRequestDetails();
  }, [id]);

  const handleAddDetails = async () => {
    if (!request) return;

    setLoading(true);
    try {
      const newDetails = prompt("Enter additional details:");
      if (!newDetails) {
        setLoading(false);
        return;
      }

      const newRequest = {
        name: request.name,
        type: request.type,
        priority: request.priority,
        status: request.status,
        phone: request.phone,
        email: request.email,
        requestTitle: request.requestTitle,
        details: `${request.details}\n\n[${new Date().toLocaleString()}]: ${newDetails}`, // Append new details
      };

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRequest),
      });

      const responseData = await response.json(); // Get API response data
      console.log("API Response:", responseData);

      if (!response.ok) throw new Error("Failed to add new request");

      alert("New request entry added!");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error adding request details.");
    }
    setLoading(false);
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!request) return <p className="text-center text-gray-500">Loading request details...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Request Details</h2>

        <div className="bg-white p-6 rounded-md shadow-md">
          {/* Contact Information */}
          <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
          <p><strong>Full Name:</strong> {request.name}</p>
          {request.email && <p><strong>Email:</strong> {request.email}</p>}
          <p><strong>Phone:</strong> {request.phone || "N/A"}</p>

          {/* Divider */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Request Information */}
          <h3 className="text-xl font-semibold mb-2">Request Information</h3>
          <p><strong>Request Title:</strong> {request.requestTitle}</p>
          <p><strong>Request Type:</strong> {request.type}</p>
          <p><strong>Priority:</strong> {request.priority}</p>
          <p><strong>Status:</strong> {request.status}</p>
          <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
          {request.changedAt && <p><strong>Last Updated:</strong> {new Date(request.changedAt).toLocaleString()}</p>}

          {/* Divider */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Request History (Total Requests) */}
          <h3 className="text-xl font-semibold mb-2">Request History</h3>
          <p className="text-gray-700 mb-2">
            Total Requests by {request.name}: {request.requestCount}
          </p>

          {/* Previous Details */}
          <h3 className="text-l font-semibold mb-1">Details:</h3>
          <p className="text-gray-700 whitespace-pre-line">{request.details || "No details provided."}</p>

          {/* Divider */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Buttons: Add Details (Left) | Back (Right) */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleAddDetails}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Adding..." : "+ Add Details"}
            </button>

            <button
              onClick={() => router.push("/dashboard/external")}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
