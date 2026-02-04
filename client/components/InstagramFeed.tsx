import { useEffect } from "react";

declare global {
  interface Window {
    Instafeed: any;
  }
}

export default function InstagramFeed() {
  useEffect(() => {
    // Load Instafeed.js library
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/instafeed.js@2";
    script.async = true;
    script.onload = () => {
      initializeInstafeed();
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializeInstafeed = () => {
    // Get access token from environment variable
    const accessToken = process.env.REACT_APP_INSTAGRAM_TOKEN;

    if (!accessToken) {
      console.log(
        "Instagram access token not configured. Set REACT_APP_INSTAGRAM_TOKEN environment variable."
      );
      return;
    }

    try {
      const feed = new window.Instafeed({
        accessToken: accessToken,
        limit: 6,
        target: "instafeed",
        template: `<a href="{{link}}" target="_blank" rel="noopener noreferrer" class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <img src="{{image}}" alt="Instagram post" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <svg class="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/></svg>
          </div>
        </a>`,
      });
      feed.run();
    } catch (error) {
      console.log("Instafeed initialization error:", error);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Sosyal Medya
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Instagram'da bizi takip edin ve en son haberler için güncel kalın
          </p>
          <a
            href="https://www.instagram.com/otofinansglobal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
            </svg>
            @otofinansglobal'ı takip et
          </a>
        </div>

        {/* Instafeed Grid */}
        <div id="instafeed" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

        {/* Setup Instructions */}
        <div className="mt-8 text-center text-sm text-gray-600 bg-white p-6 rounded-lg shadow">
          <p className="mb-3">Instagram feed'i etkinleştirmek için:</p>
          <ol className="text-left inline-block space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-pink-600 flex-shrink-0">1.</span>
              <span>
                <a
                  href="https://developers.facebook.com/docs/instagram-basic-display-api/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 font-semibold"
                >
                  Instagram Basic Display API
                </a>
                'den access token alın
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-pink-600 flex-shrink-0">2.</span>
              <span>
                <code className="bg-gray-100 px-2 py-1 rounded">REACT_APP_INSTAGRAM_TOKEN</code>
                ortam değişkenini ayarlayın
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-pink-600 flex-shrink-0">3.</span>
              <span>Sayfayı yenileyin ve postaları görün!</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
