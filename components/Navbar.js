import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-primary text-white py-4 px-6">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="font-bold text-xl">Exam System</Link>
        <div>
          <Link href="/" className="px-4">Home</Link>
          <Link href="/admin/login" className="px-4">Teacher Admin</Link>
        </div>
      </div>
    </nav>
  );
}
