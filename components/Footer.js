export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 text-center mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© 2025 Royal University of Phnom Penh - Exam System</p>
        <div className="space-x-4">
          <a href="#" className="hover:text-white transition duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-white transition duration-200">Terms of Use</a>
          <a href="mailto:support@rupp.edu.kh" className="hover:text-white transition duration-200">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
