const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Remove Three.JS import map completely
  content = content.replace(/<!-- Three\.js \+ GLTFLoader via importmap -->[\s\S]*?<\/script>/, '');

  // 2. Replace the HTML canvas with the video tag
  const videoHTML = `
    <!-- ── SCROLL-DRIVEN VIDEO HERO ── -->
    <div class="video-container">
      <video id="chess-video" src="assets/chess-video.mp4" muted playsinline preload="auto"></video>
    </div>
  `;
  content = content.replace(/<div id="pawn-container"[\s\S]*?<\/canvas>\s*<\/div>/, videoHTML);

  // 3. Add CSS for the video container
  const videoCSS = `
    .video-container {
      position: absolute;
      right: 5%;
      top: 50%;
      transform: translateY(-50%);
      width: 720px;
      height: 720px;
      z-index: 5;
      pointer-events: none;
      mix-blend-mode: screen; /* Remove parts pretas do video */
    }

    #chess-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 1300px) {
      .video-container {
        width: 550px;
        height: 550px;
        right: 0%;
      }
    }

    @media (max-width: 900px) {
      .video-container {
        position: relative;
        right: auto;
        top: auto;
        transform: none;
        width: 100%;
        max-width: 400px;
        height: 400px;
        margin: 40px auto 0;
      }
    }
  `;
  content = content.replace('/* ── LIVE SECTION ── */', videoCSS + '\n    /* ── LIVE SECTION ── */');

  // 4. Remove all ThreeJS Logic
  content = content.replace(/\/\/ ── THREE\.JS 3D CHESS PAWN \(GLB\) — SCROLL-DRIVEN ROTATION ──[\s\S]*?\/\/ ── END THREE\.JS ──/, '');
  // Because I didn't wrap it with "END THREE.JS", I'll use a specific match from starting to end of file, or just replace the specific IIFE block.
  // The ThreeJS block starts at `// ── THREE.JS 3D CHESS PAWN` and ends before `</script>`
  content = content.replace(/\/\/ ── THREE\.JS 3D CHESS PAWN[\s\S]*?\}\)\(\);/g, '');

  // 5. Inject GSAP Scroll Scrub Animation
  const videoJS = `
    // ── SCROLL SCRUB VIDEO LOGIC ──
    const video = document.getElementById('chess-video');
    
    // We must ensure the video metadata is loaded before reading duration
    video.addEventListener('loadedmetadata', function() {
      // Create a render loop mapping scroll directly to video current time
      function scrubVideo() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Define the scroll distance over which the video scrub happens
        // Let's say it finishes the video by the time you reach the second section
        const passHeight = document.documentElement.clientHeight * 1.5;
        
        let progress = scrollY / passHeight;
        
        // Clamp between 0 and 0.99 (avoiding floating point glitch at exact end)
        if (progress > 0.99) progress = 0.99;
        if (progress < 0) progress = 0;
        
        // Scrub video smoothly
        video.currentTime = video.duration * progress;
        
        requestAnimationFrame(scrubVideo);
      }
      
      requestAnimationFrame(scrubVideo);
    });
  `;
  
  // Actually wait, let's just insert the VideoJS logic right before </script>
  content = content.replace('</script>\n</body>', videoJS + '\n  </script>\n</body>');

  // 6. Fix Form Links globally!
  // Searching for CTA links using regex and replacing the hrefs
  content = content.replace(/href="#fechamento"/g, 'href="https://forms.gle/EZNucPkT9GYVzYhX6" target="_blank"');

  fs.writeFileSync('index.html', content, 'utf8');

  console.log("Substituição finalizada!");
} catch (e) {
  console.error(e);
}
