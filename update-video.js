const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Replace the Three.js container with the Video Container
  const pawnContainerStr = `<div id="pawn-container">
        <canvas id="pawn-canvas"></canvas>
      </div>`;
  const videoContainerStr = `<div class="hero-video-container">
        <video id="chess-video" src="assets/chess-video.mp4" muted playsinline preload="metadata"></video>
      </div>`;
  content = content.replace(pawnContainerStr, videoContainerStr);

  // 2. Remove the Three.js importmap and ThreeJS libraries import from head
  const importmapRegex = /<script type="importmap">[\s\S]*?<\/script>/;
  content = content.replace(importmapRegex, '');
  content = content.replace(/import \* as THREE from 'three';/, '');
  content = content.replace(/import \{ GLTFLoader \} from 'three\/addons\/loaders\/GLTFLoader\.js';/, '');
  content = content.replace(/<script type="module">/, '<script>');

  // 3. Remove the entire THREE.JS 3D CHESS PAWN logic
  // The block starts with "// ── THREE.JS 3D CHESS PAWN (GLB)" and ends before "</script>"
  const threeLogicRegex = /\/\/ ── THREE\.JS 3D CHESS PAWN[\s\S]*?\}\)\(\);/g;
  content = content.replace(threeLogicRegex, '');

  // 4. Inject Video Scroll Scrube Logic
  const videoLogic = `
    // ── VIDEO SCROLL SCRUB (Scroll = Framerate) ──
    (function initVideoScrub() {
      const video = document.getElementById('chess-video');
      if (!video) return;

      // Ensure video is totally loaded before scrubbing
      video.addEventListener('loadedmetadata', () => {
        let isScrolling = false;

        function scrubVideo() {
          // Calculate scroll progress (0 to 1) based on current scroll position relative to total page height
          const scrollY = window.scrollY || window.pageYOffset;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const scrollProgress = maxScroll > 0 ? (scrollY / maxScroll) : 0;

          // Multiply by the video duration
          const targetTime = scrollProgress * video.duration;

          // Request animation frame is not strictly needed for direct scroll matching, but helps smooth out native rendering
          if (!isNaN(targetTime) && isFinite(targetTime)) {
            // Smoothly lerp towards target frame to prevent stuttering
            video.currentTime += (targetTime - video.currentTime) * 0.1;
          }

          if (isScrolling) {
            requestAnimationFrame(scrubVideo);
          }
        }

        window.addEventListener('scroll', () => {
          if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(scrubVideo);
          }
          
          // Debounce to stop requestAnimationFrame loop when scroll stops
          clearTimeout(video.scrollTimeout);
          video.scrollTimeout = setTimeout(() => {
            isScrolling = false;
          }, 100);
        });
        
        // Initial scrub call to set frame on load
        video.currentTime = 0;
      });
    })();
  `;
  content = content.replace('</script>', videoLogic + '\n  </script>');

  // 5. Update CTA buttons URLs
  // Find <a ... class="cta-btn" ...> and replace href
  content = content.replace(/href="#fechamento"/g, 'href="https://forms.gle/EZNucPkT9GYVzYhX6" target="_blank"');
  content = content.replace(/href="[^"]*"/g, (match) => {
    if (match.includes('forms.gle')) return match;
    if (match.includes('index-silver')) return match; // skip internal links maybe? actually the user wants all CTAs
    // Lets be specific: replace href="..." if it comes before class="cta-btn" or id="hero-cta" etc.
    return match;
  });

  // More reliable way to replace button links (Acesso à live, Garantir meu acesso)
  content = content.replace(/<a href="[^"]*"\s*class="([^"]*)"\s*id="hero-cta">/g, '<a href="https://forms.gle/EZNucPkT9GYVzYhX6" target="_blank" class="$1" id="hero-cta">');
  content = content.replace(/<a href="[^"]*"\s*class="glow-btn">/g, '<a href="https://forms.gle/EZNucPkT9GYVzYhX6" target="_blank" class="glow-btn">');
  content = content.replace(/<a href="[^"]*"\s*class="nav-cta">/g, '<a href="https://forms.gle/EZNucPkT9GYVzYhX6" target="_blank" class="nav-cta">');
  content = content.replace(/<a href="[^"]*"\s*class="cta-btn">/g, '<a href="https://forms.gle/EZNucPkT9GYVzYhX6" target="_blank" class="cta-btn">');

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Substituição do 3D por Vídeo MP4 concluída com sucesso.");
} catch (e) {
  console.error("Erro:", e);
}
