const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // Restore importmap in <head>
  const importmapStr = `
  <!-- Three.js via importmap -->
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
    }
  }
  </script>
  <style>`;
  if (!content.includes('type="importmap"')) {
    content = content.replace('<style>', importmapStr);
  }

  // Restore <script type="module"> and import THREE
  if (!content.includes("import * as THREE from 'three';")) {
    const moduleStr = `<script type="module">
    import * as THREE from 'three';
`;
    content = content.replace('<script>', moduleStr);
  }

  // Also verify that the video container class was applied correctly globally.
  // The user wanted the video inside <div class="hero-video-container">. But my JS logic earlier didn't replace it properly because they had `<div class="pawn-wrapper">...`.
  // Let's replace the pawn-wrapper completely with what they asked.
  const oldPawnWrapper = /<div class="pawn-wrapper">[\s\S]*?<\/div>\s*<\/div>/;
  const newVideoHTML = `
          <div class="hero-video-container">
            <video id="chess-video" src="assets/chess-video.mp4" muted playsinline preload="auto"></video>
          </div>
  `;
  if (content.includes('class="pawn-wrapper"')) {
    content = content.replace(oldPawnWrapper, newVideoHTML);
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Correções aplicadas com sucesso.");
} catch (e) {
  console.error("Erro:", e);
}
