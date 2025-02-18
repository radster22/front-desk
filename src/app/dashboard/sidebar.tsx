'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut, SessionProvider } from "next-auth/react";

const SidebarContent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  // Fallback user data if session is undefined
  const user = {
    name: session?.user?.name || "Guest",
    image: session?.user?.image || null,
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  const renderProfile = () => {
    return user.image ? (
      <Image src={user.image} alt="User profile" width={40} height={40} className="rounded-full" />
    ) : (
      <div className="flex items-center justify-center bg-orange-300 text-black rounded-full w-10 h-10">
        {user.name
          .split(" ")
          .map(word => word[0])
          .join("")}
      </div>
    );
  };

  return (
    <div className={`bg-gray-800 text-white ${collapsed ? "w-16" : "w-64"} h-screen transition-all flex flex-col`}>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-center">
          <h2 className={`${collapsed ? "text-center" : ""} text-xl font-bold`}>
            {collapsed ? "FD" : "Front Desk"}
          </h2>
        </div>

        {/* Navigation menu */}
        <nav className="mt-8">
          <ul>
            <li>
              <Link href="/dashboard" className="block py-2 px-2 hover:bg-gray-700 flex items-center gap-2">
                <Image src="/speedometer.svg" alt="Dashboard Icon" width={20} height={20} />
                {!collapsed && "Dashboard"}
              </Link>
            </li>
            <li>
              <Link href="/preferences" className="block py-2 px-2 hover:bg-gray-700 flex items-center gap-2 cursor-not-allowed">
                <Image src="/settings.svg" alt="Settings Icon" width={20} height={20} />
                {!collapsed && "Preferences"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* User profile display */}
        <div className={`flex items-center justify-${collapsed ? "center" : "start"} mt-auto`}>
          <Link href="dashboard/external/profile" className="flex items-center">
            {renderProfile()}
            {!collapsed && <p className="ml-3 text-sm">{user.name}</p>}
          </Link>
        </div>
                {/* Logout Button */}
        <button 
          onClick={() => signOut({ callbackUrl: "/login/internal" })} 
          className={`mt-4 flex items-center justify-center px-4 py-2 text-white rounded-md transition 
            ${collapsed ? "flex items-center bg-gray-700 hover:bg-gray-600 rounded-full justify-start" 
                        : "bg-gray-700 hover:bg-gray-600"}`}
        >
          {collapsed ? "L" : "Logout"}  {/* Only show text when expanded */}
        </button>
      </div>

      {/* Toggle Sidebar Button */}
      <button onClick={toggleSidebar} className="text-white p-4 mt-auto bg-gray-700 hover:bg-gray-600 w-full">
        {collapsed ? "▶" : "◁"}
      </button>
    </div>
  );
};

// Wrap only the Sidebar component with SessionProvider
const Sidebar = () => (
  <SessionProvider>
    <SidebarContent />
  </SessionProvider>
);

export default Sidebar;
