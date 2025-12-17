// components/mentorship/CTAdiv.tsx
export default function CTAdiv() {
  return (
    <div
      id="request-mentor"
      className="py-16 md:py-24 bg-gradient-to-r from-gray-900 to-black text-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Fundraising Journey?
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of founders who have accelerated their success with
              expert mentorship
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold mb-4">For Founders</h3>
              <p className="text-gray-300 mb-6">
                Get matched with experienced mentors who can guide you through
                your fundraising journey.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Active campaign required</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Free mentorship program</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Personalized mentor matching</span>
                </li>
              </ul>
              <a
                href="/dashboard/request-mentor"
                className="block w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-6 rounded-lg text-center transition-colors"
              >
                Request a Mentor
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-6">👨‍🏫</div>
              <h3 className="text-2xl font-bold mb-4">For Mentors</h3>
              <p className="text-gray-300 mb-6">
                Share your expertise and help the next generation of founders
                succeed.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Verified users only</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Support up to 5 ventures</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Apply via Account Settings</span>
                </li>
              </ul>
              <a
                href="/account/settings"
                className="block w-full bg-transparent hover:bg-white/20 text-white font-bold py-4 px-6 rounded-lg text-center border-2 border-white transition-colors"
              >
                Become a Mentor
              </a>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              Learn more about mentorship program guidelines and best practices
              in our
              <a
                href="/help/mentorship-guide"
                className="text-white font-medium underline ml-1"
              >
                complete guide
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
