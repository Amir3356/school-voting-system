export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">School Voting System</h1>
            <div className="space-x-4">
              <a href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</a>
              <a href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Register</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Voice Matters
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Participate in democratic school elections. Vote for your representatives and make a difference in your school community.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🗳️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Voting</h3>
              <p className="text-gray-600">Simple and secure voting process for all students</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Results</h3>
              <p className="text-gray-600">View real-time election results and statistics</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Fair</h3>
              <p className="text-gray-600">One vote per student, protected and anonymous</p>
            </div>
          </div>

          <div className="mt-16">
            <a href="/register" className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition inline-block">
              Get Started Now
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2024 School Voting System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
