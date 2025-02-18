'use client';

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/dashboard/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RequestType {
  id: number;
  name: string;
  type: string;
  priority: string;
  status: string;
  createdAt: string;
  changedAt: string;
}

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [requests, setRequests] = useState<RequestType[]>([]);
  const router = useRouter();


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests");
        if (!response.ok) throw new Error("Failed to fetch requests");
  
        const data: RequestType[] = await response.json();
        console.log("Fetched Requests:", data); // Log the response here
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
  
    fetchRequests();
  }, []);
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleSortChange = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleRefresh = () => {
    console.log("Data refreshed");
  };

  const requestCounts = {
    new: requests.filter(req => req.status.toLowerCase() === "new").length,
    open: requests.filter(req => req.status.toLowerCase() === "open").length,
    resolved: requests.filter(req => req.status.toLowerCase() === "resolved").length,
    closed: requests.filter(req => req.status.toLowerCase() === "closed").length,
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">My Requests (Internal page)</h1>

        {/* Request Counts Table */}
        <div className="mb-6">
          <table className="min-w-full bg-blue-100 border-collapse border rounded-md shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-r text-left">New</th>
                <th className="py-2 px-4 border-b border-r text-left">Open</th>
                <th className="py-2 px-4 border-b border-r text-left">Resolved</th>
                <th className="py-2 px-4 border-b text-left">Closed</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-200">
                <td className="py-2 px-4 border-b border-r">{requestCounts.new}</td>
                <td className="py-2 px-4 border-b border-r">{requestCounts.open}</td>
                <td className="py-2 px-4 border-b border-r">{requestCounts.resolved}</td>
                <td className="py-2 px-4 border-b">{requestCounts.closed}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="my-5">
            <div className="flex justify-between mb-4">
              <button
                onClick={() => router.push("/dashboard/internal/requests")}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
              >
                + New Request
              </button>
            </div>

          <div className="flex justify-between mb-4">
            {/* Search Bar */}
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search submitted forms"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="px-4 pl-10 py-2 border rounded-md"
                />
                <Image
                  src="/search.svg"
                  alt="Search Icon"
                  width={20}
                  height={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
              </div>
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 bg-gray-200 text-black rounded-md border hover:bg-gray-300 ml-1"
              >
                Search
              </button>
            </div>

            {/* Sort & Refresh Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleSortChange}
                className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-300 border flex items-center gap-2"
              >
                <Image src="/sort.svg" alt="Sort Icon" width={15} height={15} />
                {sortDirection === "asc" ? "▲" : "▼"}
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-3 bg-gray-100 text-black rounded-md border hover:bg-gray-300"
              >
                <Image src="/refresh.svg" alt="Refresh Icon" width={15} height={15} />
              </button>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white border rounded-md shadow p-4">
            {requests.length === 0 ? (
              <p className="text-center text-gray-500">No requests found</p>
            ) : (
              <table className="min-w-full bg-white border-collapse border rounded-md">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-r text-left">Submit Id</th>
                    <th className="py-2 px-4 border-b border-r text-left">Submitter</th>
                    <th className="py-2 px-4 border-b border-r text-left">Type</th>
                    <th className="py-2 px-4 border-b border-r text-left">Priority</th>
                    <th className="py-2 px-4 border-b border-r text-left">Status</th>
                    <th className="py-2 px-4 border-b text-left">Modified Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(request => (
                    <tr 
                      key={request.id} 
                      onClick={() => router.push(`/dashboard/internal/${request.id}`)}
                      className="cursor-pointer hover:bg-gray-200"
                    >
                      <td className="py-2 px-4 border-b border-r">{request.id}</td>
                      <td className="py-2 px-4 border-b border-r">{request.name}</td>
                      <td className="py-2 px-4 border-b border-r">{request.type}</td>
                      <td className="py-2 px-4 border-b border-r">{request.priority}</td>
                      <td className="py-2 px-4 border-b border-r">{request.status}</td>
                      <td className="py-2 px-4 border-b">{request.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
