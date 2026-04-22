const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // Insert CSS
  if (!content.includes('.rotating-badge')) {
    const cssToInsert = `
    /* ── ROTATING GLASS BADGE ── */
    .rotating-badge {
      position: absolute;
      top: 35%;
      right: 5%;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
      pointer-events: none;
      background: rgba(0, 212, 255, 0.05); /* very light cyan tint */
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 212, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 212, 255, 0.1);
    }
    @media (max-width: 900px) {
      .rotating-badge { display: none; }
    }
    .badge-logo-container {
      position: absolute;
    }
    .badge-logo-container img {
      width: 45px;
      opacity: 0.9;
    }
    .badge-text-svg {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
    }
    .badge-text-svg text {
      font-family: var(--font);
      font-size: 11.5px;
      font-weight: 600;
      fill: var(--text-secondary);
      letter-spacing: 1.5px;
    }
`;
    content = content.replace('</style>', cssToInsert + '\n  </style>');
  }

  // Insert Badge HTML
  if (!content.includes('<div class="rotating-badge">')) {
    const badgeHTML = `
    <!-- ── ROTATING GLASS BADGE ── -->
    <div class="rotating-badge">
      <div class="badge-logo-container">
        <img src="assets/x5-logo-branca.png" alt="X5" />
      </div>
      <svg class="badge-text-svg" viewBox="0 0 100 100">
        <path id="badgePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
        <text>
          <textPath href="#badgePath" startOffset="0%" textLength="219.9">LIVES SEMANAIS AS 20H BRT • LIVES SEMANAIS AS 20H BRT • </textPath>
        </text>
      </svg>
    </div>
    `;
    // r=35 -> circumference = 219.91
    content = content.replace('<div class="hero-text-area">', badgeHTML + '\n    <div class="hero-text-area">');
  }

  // Add JS logic inside the <script type="module">
  if (!content.includes('// ── ADVANCED INTERACTIVE EFFECTS ──')) {
    const jsToInsert = `
    // ── ADVANCED INTERACTIVE EFFECTS ──
    // 1. ROTATING BADGE
    const badgeSvg = document.querySelector('.badge-text-svg');
    if (badgeSvg) {
      window.addEventListener('scroll', () => {
        badgeSvg.style.transform = \`rotate(\${window.scrollY * 0.25}deg)\`;
      });
    }

    // 2. MOUSE LIGHT FOLLOWER 
    const mouseLight = document.createElement('div');
    mouseLight.style.position = 'fixed';
    mouseLight.style.top = '0';
    mouseLight.style.left = '0';
    mouseLight.style.width = '600px';
    mouseLight.style.height = '600px';
    mouseLight.style.borderRadius = '50%';
    mouseLight.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 60%)';
    mouseLight.style.pointerEvents = 'none';
    mouseLight.style.transform = 'translate(-50%, -50%)';
    mouseLight.style.zIndex = '0';
    mouseLight.style.opacity = '0';
    mouseLight.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(mouseLight);

    document.addEventListener('mousemove', (e) => {
      mouseLight.style.opacity = '1';
      mouseLight.style.left = e.clientX + 'px';
      mouseLight.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => {
      mouseLight.style.opacity = '0';
    });

    // 3. TILT EFFECT ON CARDS
    const tiltCards = document.querySelectorAll('.pillar-card, .pain-item, .transform-col');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calibrated subtle tilt
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) translateY(-5px)\`;
        card.style.transition = 'none';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.5s ease';
      });
    });

    // 4. GRID PARALLAX
    const bgGrid = document.querySelector('.page-bg-grid');
    if (bgGrid) {
      window.addEventListener('scroll', () => {
        bgGrid.style.transform = \`translateY(\${window.scrollY * 0.15}px)\`;
      });
    }
    `;
    
    content = content.replace('// ── SCROLL REVEAL ──', jsToInsert + '\n    // ── SCROLL REVEAL ──');
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Integração concluída com sucesso.");
} catch (e) {
  console.error("Erro:", e);
}
