const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Replace the CTA Links
  content = content.replace(/href="#fechamento"/g, 'href="https://forms.gle/EZNucPkT9GYVzYhX6" target="_blank"');

  // 2. Replace 3D Pawn Container with Video Container
  const oldContainer = `      <!-- 3D PAWN CONTAINER -->
      <div id="pawn-container">
        <canvas id="pawn-canvas"></canvas>
        <!-- Text hint below the pawn -->
        <div class="pawn-hint">Gire Livremente</div>
      </div>`;
  const newContainer = `      <!-- VIDEO CONTAINER -->
      <div class="hero-video-container">
        <video autoplay loop muted playsinline class="hero-video">
          <source src="assets/hero-video.mp4" type="video/mp4">
        </video>
      </div>`;
      
  // Use a regex to be flexible with whitespace
  content = content.replace(/<!-- 3D PAWN CONTAINER -->[\s\S]*?<\/div>\s*<\/div>/, newContainer + '\n    ');
  // Wait, the regex `<\/div>\s*<\/div>` might eat too much. 
  // Let's use string split and join:
  const splitPoint1 = '<!-- 3D PAWN CONTAINER -->';
  const splitPoint2 = '<div class="hero-people-area">'; // This comes after it usually
  if(content.includes(splitPoint1) && content.includes(splitPoint2)) {
    const start = content.split(splitPoint1)[0];
    const end = content.split(splitPoint2);
    // Remove the first part of "end" arrays which is the pawn-container part
    content = start + newContainer + '\n\n    ' + splitPoint2 + end.slice(1).join(splitPoint2);
  } else {
    // Fallback if structured differently (search for #pawn-container block instead)
    content = content.replace(/<!-- 3D PAWN CONTAINER -->[\s\S]*?<div id="pawn-container">[\s\S]*?<canvas id="pawn-canvas"><\/canvas>[\s\S]*?<\/div>[\s\S]*?<\/div>/, newContainer);
  }

  // 3. Inject CSS
  const cssInject = `
    /* ── HERO VIDEO CONTAINER ── */
    .hero-video-container {
      position: absolute;
      right: 5%;
      top: 50%;
      transform: translateY(-50%);
      width: 720px;
      height: 720px;
      z-index: 2;
      pointer-events: none;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .hero-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      mix-blend-mode: screen;
      opacity: 0.95;
    }
    @media (max-width: 1200px) {
      .hero-video-container {
        width: 500px;
        height: 500px;
        right: -5%;
      }
    }
    @media (max-width: 900px) {
      .hero-video-container {
        position: relative;
        top: 0;
        right: 0;
        transform: translateY(0);
        width: 350px;
        height: 350px;
        margin: 40px auto 0 auto;
      }
    }
    `;
    
  if (!content.includes('.hero-video-container')) {
    content = content.replace('</style>', cssInject + '\n  </style>');
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("HTML successfully updated with video elements.");
} catch(e) {
  console.log("Error:", e);
}
