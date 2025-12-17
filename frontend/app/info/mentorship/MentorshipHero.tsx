// components/mentorship/MentorshipHero.tsx
export default function MentorshipHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16 md:py-24">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-800/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">
              For Founders & Entrepreneurs
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Accelerate Your Fundraising Journey with{' '}
            <span className="text-yellow-300">Expert Mentorship</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Connect with seasoned entrepreneurs and investors who have
            successfully raised funds and scaled businesses. Get personalized
            guidance to refine your pitch, strategy, and investor outreach.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#request-mentor"
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Request a Mentor
            </a>
            <a
              href="#how-it-works"
              className="bg-transparent hover:bg-blue-800/50 border-2 border-white text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300"
            >
              How It Works
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-200">Active Mentors</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-blue-200">Success Rate Improvement</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">48h</div>
              <div className="text-blue-200">Average Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );
}
