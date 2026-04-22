const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Remove Importmap
  content = content.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');

  // 2. Remove pawn canvas and inject Video
  const videoHTML = `<video id="chess-video" src="assets/chess-video.mp4" muted playsinline preload="auto"></video>`;
  content = content.replace('<canvas id="pawn-canvas"></canvas>', videoHTML);
  // Also remove pawn-glow since we don't need it with the video potentially
  content = content.replace('<div class="pawn-glow"></div>', '');

  // 3. Inject CSS for video
  const videoCSS = `
    /* ── SCROLL SCRUB VIDEO ── */
    #chess-video {
      width: 720px;
      height: 720px;
      object-fit: cover;
      mix-blend-mode: screen;
      pointer-events: none;
      display: block;
      margin: 0 auto;
    }
    @media (max-width: 900px) {
      #chess-video {
        width: 100%;
        height: auto;
        max-height: 400px;
      }
    }
  `;
  if (!content.includes('#chess-video')) {
    content = content.replace('</style>', videoCSS + '\n  </style>');
  }

  // 4. Remove WebGL Script Logic for pawn (Lines 1910 to 2036 approx)
  content = content.replace(/\/\/ ── THREE\.JS 3D CHESS PAWN \(GLB\) — SCROLL-DRIVEN ROTATION ──[\s\S]*?\)\(\);/, '');

  // 5. Inject Scroll Scrub JS Logic
  const scrubJS = `
    // ── SCROLL SCRUB VIDEO LOGIC ──
    const chessVideo = document.getElementById('chess-video');
    if (chessVideo) {
      // Pause video to take manual control
      chessVideo.pause();

      // Ensure video data is loaded before reading duration
      chessVideo.addEventListener('loadedmetadata', () => {
        let isScrubbing = false;

        window.addEventListener('scroll', () => {
          if (!isScrubbing) {
            window.requestAnimationFrame(() => {
              // Calculate scroll percentage (0 to 1) based on document height
              const docHeight = document.body.scrollHeight - window.innerHeight;
              const scrollPercent = window.scrollY / docHeight;
              
              // Map percentage to video duration
              const maxTime = Math.max(0, chessVideo.duration - 0.1); 
              let targetTime = scrollPercent * maxTime;
              
              // Scrub bounds
              if (targetTime < 0) targetTime = 0;
              if (targetTime > maxTime) targetTime = maxTime;

              // Apply the time
              chessVideo.currentTime = targetTime;
              isScrubbing = false;
            });
            isScrubbing = true;
          }
        });
      });
    }
  `;
  content = content.replace('</script>\n</body>', scrubJS + '\n  </script>\n</body>');

  // 6. Update CTAs Links
  // Replacing 'href="#fechamento"' or anywhere there's a CTA to the form link explicitly
  // We already see some have 'https://forms.gle/' but let's blanket cover the classes
  content = content.replace(/href="#fechamento"/g, 'href="https://forms.gle/EZNucPkT9GYVzYhX6" target="_blank"');

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Substituição finalizada. Arquivo index.html atualizado com sucesso!");
} catch (e) {
  console.error("Erro na atualização:", e);
}
