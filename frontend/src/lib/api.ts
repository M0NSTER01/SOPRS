export const fetchWithFallback = async (path: string, options?: RequestInit) => {
  const localUrl = `http://localhost:9000${path}`;
  const prodUrl = `https://phone-lost-and-found.vercel.app${path}`;

  // If the website is loaded on Netlify (or any non-localhost domain),
  // skip local entirely and go straight to the fast Vercel backend.
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return fetch(prodUrl, options);
  }

  try {
    const response = await fetch(localUrl, options);
    // If localhost is running but returns 404, it might be the wrong endpoint, but if it fails to connect it throws.
    return response;
  } catch (error) {
    console.warn(`Local backend not reachable for ${path}, falling back to production backend.`, error);
    return fetch(prodUrl, options);
  }
};
