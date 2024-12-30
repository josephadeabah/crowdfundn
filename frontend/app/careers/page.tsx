// pages/careers.js

export default function Careers() {
  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto p-6 text-center">
        {/* Header Section */}
        <h1 className="text-4xl font-extrabold text-green-800 mb-4">
          We're Hiring!
        </h1>
        <p className="text-xl text-green-700 mb-6">
          Join our team and make an impact. We’re always looking for talented
          individuals to join us. Come back soon for the latest opportunities.
        </p>

        {/* Notification Section */}
        <div className="bg-white rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">
            Check Back Soon!
          </h2>
          <p className="text-lg text-green-600 mb-4">
            We're updating our open positions. Stay tuned for new job
            opportunities!
          </p>
        </div>
      </div>
    </div>
  );
}
