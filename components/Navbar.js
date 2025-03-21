import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg fixed top-0 w-full py-4 px-6 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo & Title */}
        <div className="flex items-center">
          <img src="/RUPP.jpg" alt="School Logo" className="h-12 w-auto mr-3 rounded-lg shadow-md" />
          <Link href="/" className="font-bold text-xl text-gray-800 hover:text-gray-600 transition">Exam System</Link>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link href="/" className="text-gray-800 text-lg hover:text-orange-500 transition duration-300">Home</Link>
          <Link href="/admin/login" className="text-gray-800 text-lg hover:text-orange-500 transition duration-300">Teacher</Link>
        </div>

      </div>
    </nav>
  );
}
