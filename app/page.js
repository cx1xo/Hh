export default async function Home({ searchParams }) {
  const params = await searchParams;
  const targetUrl = params.url || '';

  let ogData = {
    title: "Viral Video Clip +3",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7", // Backup image
    destination: "https://google.com" // Backup redirect
  };

  // 🕵️‍♂️ 1. Facebook Bot Ko Direct Data Dikhane Ka Bypass Code
  // Is se Vercel use kabhi block (403) nahi karega
  if (targetUrl) {
    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.google.com/'
        },
        next: { revalidate: 0 } // Cache clear rakhne ke liye
      });
      
      if (res.ok) {
        const html = await res.text();
        
        // Image nikalna
        const imgMatch = html.match(/src=["'](https:\/\/blogger\.googleusercontent\.com\/img\/b\/[^"']+)["']/i) ||
                         html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) || 
                         html.match(/<img[^>]*src=["']([^"']*)["']/i);
        if (imgMatch) ogData.image = imgMatch[1];
        
        // Title nikalna
        const titleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i) ||
                          html.match(/<title>([^<]*)<\/title>/i);
        if (titleMatch) ogData.title = titleMatch[1];
        
        // Link nikalna
        const rawLinks = html.match(/https?:\/\/[^\s"'<>]+/g);
        if (rawLinks) {
          const foundLink = rawLinks.find(link => 
            !link.includes('blogspot.com') && !link.includes('google.com') && 
            !link.includes('w3.org') && !link.includes('blogger.com') && !link.includes('whatsapp.com')
          );
          if (foundLink) ogData.destination = foundLink.split('"')[0].split("'")[0];
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <title>{ogData.title}</title>
      <meta property="og:title" content={ogData.title} />
      <meta property="og:image" content={ogData.image} />
      <meta property="og:description" content="Click to watch full video." />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={targetUrl} />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            const isBot = /facebookexternalhit|Facebot|Twitterbot|Pinterestbot/i.test(navigator.userAgent);
            if (!isBot && "${ogData.destination}") {
              window.location.href = "${ogData.destination}";
            }
          `,
        }}
      />
      <div style={{ textAlign: 'center', marginTop: '20%', fontFamily: 'sans-serif', color: '#333' }}>
        <h2>Loading Secure Player...</h2>
        <p>Please wait while the stream configures.</p>
      </div>
    </>
  );
}
