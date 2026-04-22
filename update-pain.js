const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Add Flaticons CDN in head if not present
  if (!content.includes('uicons-solid-straight.css')) {
    const flaticonCDN = `<link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.1.0/css/uicons-solid-straight.css'>\n`;
    content = content.replace('<link rel="icon"', flaticonCDN + '  <link rel="icon"');
  }

  // 2. Adjust 3D Object Size and Material
  content = content.replace('const scale = 3.0 / maxDim;', 'const scale = 4.2 / maxDim;'); // Increased from 3.0 to 4.2
  content = content.replace('metalness: 0.9,', 'metalness: 1.0,');
  content = content.replace('roughness: 0.15,', 'roughness: 0.1,');

  // 3. Replace pain icons with the rocket <i> tag
  content = content.replace(/<div class="pain-icon">[\s\S]*?<\/div>/g, '<div class="pain-icon" style="font-size: 20px; line-height: 1;"><i class="fi fi-ss-rocket-lunch"></i></div>');

  // 4. Add the CSS for .pain-item.highlighted
  if (!content.includes('.pain-item.highlight-active')) {
    const cssInject = `
    .pain-item.highlight-active {
      background: rgba(0, 212, 255, 0.15) !important;
      border: 1px solid rgba(0, 212, 255, 0.4) !important;
      transform: translateX(10px);
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
    }
    .pain-item {
      border: 1px solid transparent;
      transition: all 0.4s ease;
    }
    `;
    content = content.replace('</style>', cssInject + '\n  </style>');
  }

  // 5. Add the JS loop logic
  if (!content.includes('// 5. PAIN ITEMS SEQUENTIAL HIGHLIGHT')) {
    const jsInject = `
    // 5. PAIN ITEMS SEQUENTIAL HIGHLIGHT
    const painItems = document.querySelectorAll('.pain-item');
    if (painItems.length > 0) {
      let currentIndex = 0;
      setInterval(() => {
        // Remove from all
        painItems.forEach(item => item.classList.remove('highlight-active'));
        // Add to current
        painItems[currentIndex].classList.add('highlight-active');
        
        // Move to next
        currentIndex = (currentIndex + 1) % painItems.length;
      }, 2000);
      
      // Highlight the first one immediately
      painItems[0].classList.add('highlight-active');
    }
    `;
    content = content.replace('// ── SCROLL REVEAL ──', jsInject + '\n    // ── SCROLL REVEAL ──');
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Atualizações do script concluídas com sucesso.");
} catch (e) {
  console.error("Erro:", e);
}
