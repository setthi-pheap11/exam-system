import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-primary text-black py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="/RUPP.jpg" alt="School Logo" className="h-12 w-auto mr-3" />
          <Link href="/" className="font-bold text-xl">Exam System</Link>
        </div>
      
        <div>
          <Link href="/" className="px-4">Home</Link>
          <Link href="/admin/login" className="px-4">Teacher</Link>
        </div>

      </div>
    </nav>
  );
}
