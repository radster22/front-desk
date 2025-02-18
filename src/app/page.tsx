// pages/index.tsx
//import Image from 'next/image';
import Link from 'next/link'; // Import Link to navigate between pages

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">
          Front Desk Application
        </h1>
        
        {/* Buttons */}
        <div className="flex flex-row gap-4 items-center justify-center">
          {/* Internal Login Button */}
          <Link
            href="/login/internal" // Navigate to the internal login page
            className="w-full sm:w-auto px-6 py-2 bg-blue-900 text-white rounded-full shadow-lg transition-colors hover:bg-blue-700"
          >
            Begin Here
          </Link>
          
        </div>
      </div>
    </div>
  );
}
