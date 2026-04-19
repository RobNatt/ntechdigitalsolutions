export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 text-4xl md:text-6xl tracking-tight" style={{ color: '#2B2E33' }}>
            Your Website Is Costing You<br />Customers Every Day
          </h1>

          <p className="mb-10 text-lg md:text-xl max-w-2xl mx-auto" style={{ color: '#7B7F85' }}>
            {
              "Find out exactly what's broken — and how to fix it — with a FREE Website Audit from N-Tech Digital Solutions."
            }
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                className="px-8 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: '#2B2E33', color: '#F5F6F7' }}
              >
                Schedule My Free Audit
              </button>

              <a
                href="#signs"
                className="flex items-center gap-2 transition-opacity hover:opacity-70"
                style={{ color: '#7B7F85' }}
              >
                <span>See if this is for you</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 4L10 16M10 16L16 10M10 16L4 10"
                    stroke="#7B7F85"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm">
              {[
                '100% Free Audit',
                'No Obligation',
                'Results-Driven Agency'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3333 4L6 11.3333L2.66667 8"
                      stroke="#2B2E33"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ color: '#7B7F85' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section id="signs" className="px-6 py-20 md:py-24" style={{ backgroundColor: '#2B2E33' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center mb-3 tracking-wide uppercase text-sm" style={{ color: '#C1C4C8' }}>
            Sound Familiar?
          </p>

          <h2 className="text-center mb-4 text-3xl md:text-5xl tracking-tight" style={{ color: '#F5F6F7' }}>
            Signs Your Website Is Working Against You
          </h2>

          <p className="text-center mb-16 max-w-3xl mx-auto" style={{ color: '#C1C4C8' }}>
            If any of these hit close to home, you're not alone — and the good news is every single one is fixable.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Visitors Leave Without Contacting You",
                description: "Your website gets traffic but the phone isn't ringing. A confusing layout and weak calls-to-action are silently killing your leads."
              },
              {
                title: "It Looks Terrible on Mobile",
                description: "Over 60% of web traffic is mobile. If your site isn't optimized, you're handing those customers directly to your competitors."
              },
              {
                title: "Google Can't Find You",
                description: "An outdated site with poor SEO means you're invisible to people actively searching for what you offer right now."
              },
              {
                title: "It Loads Too Slowly",
                description: "53% of visitors abandon a site that takes more than 3 seconds to load. A slow website is a leaky bucket — no matter how much you spend on ads."
              },
              {
                title: "It Doesn't Reflect Your Brand",
                description: "Your business has grown, but your website still looks like it did years ago. First impressions matter — and yours may be sending the wrong message."
              },
              {
                title: "You're Losing to Competitors",
                description: "When prospects compare you to competitors online, a polished, modern website wins the deal before a single conversation happens."
              }
            ].map((card, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border"
                style={{
                  backgroundColor: '#F5F6F7',
                  borderColor: '#7B7F85'
                }}
              >
                <h3 className="mb-4" style={{ color: '#2B2E33' }}>
                  {card.title}
                </h3>
                <p style={{ color: '#7B7F85' }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              className="px-8 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg flex items-center gap-3"
              style={{ backgroundColor: '#F5F6F7', color: '#2B2E33' }}
            >
              <span>GET MY FREE AUDIT NOW</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 10H16M16 10L10 4M16 10L10 16"
                  stroke="#2B2E33"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="px-6 py-20 md:py-24 bg-[#F5F6F7]">
        <div className="max-w-6xl mx-auto">
          <p className="text-center mb-3 tracking-wide uppercase text-sm" style={{ color: '#7B7F85' }}>
            The Transformation
          </p>

          <h2 className="text-center mb-4 text-3xl md:text-5xl tracking-tight" style={{ color: '#2B2E33' }}>
            From Outdated to Outstanding
          </h2>

          <p className="text-center mb-12 max-w-3xl mx-auto" style={{ color: '#7B7F85' }}>
            We don't just build websites — we build revenue-generating machines that work for you 24/7.
          </p>

          {/* Photo Placeholder */}
          <div className="mb-16 rounded-2xl overflow-hidden max-w-4xl mx-auto" style={{ backgroundColor: '#C1C4C8', aspectRatio: '16/9' }}>
            <div className="w-full h-full flex items-center justify-center" style={{ color: '#7B7F85' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#7B7F85" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#7B7F85"/>
                <path d="M3 16L8 11L13 16" stroke="#7B7F85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14L16 10L21 15" stroke="#7B7F85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: '3X',
                description: 'More Leads Generated'
              },
              {
                stat: '67%',
                description: 'Faster Load Times'
              },
              {
                stat: 'Top 3',
                description: 'Average Google Ranking'
              }
            ].map((card, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border text-center"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#C1C4C8'
                }}
              >
                <h3 className="mb-3 text-4xl md:text-5xl" style={{ color: '#2B2E33' }}>
                  {card.stat}
                </h3>
                <p style={{ color: '#7B7F85' }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Section */}
      <section className="px-6 py-20 md:py-24" style={{ backgroundColor: '#2B2E33' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center mb-3 tracking-wide uppercase text-sm" style={{ color: '#C1C4C8' }}>
            What's next?
          </p>

          <h2 className="text-center mb-6 text-3xl md:text-5xl tracking-tight" style={{ color: '#F5F6F7' }}>
            Get a Free Website Audit and Schedule your Discovery Call
          </h2>

          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: '#C1C4C8' }}>
            Schedule a time to discuss your business needs and the results of your website audit. Every business has different needs and requires a different strategy for online growth. The audit will paint a clear picture of where you're starting from. The audit includes:
          </p>

          {/* Checklist */}
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            {[
              'Speed Check',
              'Mobile Readiness',
              'Responsiveness',
              'Search Engine Visibility',
              'AI visibility'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" fill="#F5F6F7"/>
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#2B2E33"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-lg" style={{ color: '#F5F6F7' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}