export default function Dashboard({ name }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2f7] to-[#e3e9f4] flex items-center justify-center p-10">

      <div className="w-full max-w-6xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Hi {name}, Ready to Improve Your Heart Health?
        </h1>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition">
            <h2 className="font-semibold text-gray-800 mb-2">
              Analyze Your Heart Risk
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Use AI to predict your current heart health status.
            </p>
            <button className="text-purple-600 font-medium">
              Start Analysis →
            </button>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition">
            <h2 className="font-semibold text-gray-800 mb-2">
              Get AI Insights
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Understand key factors affecting your heart risk.
            </p>
            <button className="text-purple-600 font-medium">
              View Insights →
            </button>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition">
            <h2 className="font-semibold text-gray-800 mb-2">
              Reduce Your Risk
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Simulate lifestyle changes and improve your health.
            </p>
            <button className="text-purple-600 font-medium">
              Start Simulation →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}