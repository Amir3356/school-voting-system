export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p className="mb-2">&copy; {new Date().getFullYear()} School Voting System. All rights reserved.</p>
          <p className="text-sm">Empowering democratic participation in education</p>
        </div>
      </div>
    </footer>
  );
}
