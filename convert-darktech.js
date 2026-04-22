const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // CSS Variables
  content = content.replace(/--bg-primary:\s*#[A-Fa-f0-9]{3,6};/g, '--bg-primary: #060A14;');
  content = content.replace(/--bg-secondary:\s*#[A-Fa-f0-9]{3,6};/g, '--bg-secondary: #0D1525;');
  content = content.replace(/--bg-tertiary:\s*#[A-Fa-f0-9]{3,6};/g, '--bg-tertiary: #111C32;');
  content = content.replace(/--accent:\s*#[A-Fa-f0-9]{3,6};/g, '--accent: #00D4FF;');
  content = content.replace(/--accent-hover:\s*#[A-Fa-f0-9]{3,6};/g, '--accent-hover: #00A8CC;');
  content = content.replace(/--accent-glow:\s*rgba\([\d,\s.]+\);/g, '--accent-glow: rgba(0, 212, 255, 0.3);');
  content = content.replace(/--text-secondary:\s*#[A-Fa-f0-9]{3,6};/g, '--text-secondary: #C8D6E5;');

  // All rgba colors using the red signature (e.g. glows, grid lines, box-shadows)
  content = content.replace(/229,\s*9,\s*20/g, '0, 212, 255');
  
  // Re-adjust cta-btn background from solid var(--accent) to the requested gradient
  content = content.replace(/background:\s*var\(--accent\);(\s*)color:\s*#fff;/g, 'background: linear-gradient(90deg, #00D4FF, #0099CC);$1color: #060A14;');
  // Also catch the newly replaced dark color just in case
  content = content.replace(/background:\s*var\(--accent\);(\s*)color:\s*#000;/g, 'background: linear-gradient(90deg, #00D4FF, #0099CC);$1color: #060A14;');

  // Navbar scrolled background
  content = content.replace(/background:\s*rgba\(0, 0, 0, 0\.7\);/g, 'background: rgba(10, 22, 40, 0.85);');

  // Three.js colors (Point lights, Rim lights)
  // Initially rimLight was 0xE50914 (red). We change ANY 0xE50914 to 0x00D4FF
  content = content.replace(/0xE50914/gi, '0x00D4FF');
  
  // Bottom Light
  // We want the bottom light specifically to be deep blue #003366, let's find it.
  content = content.replace(/const bottomLight = new THREE\.PointLight\(0x[A-Fa-f0-9]{6},/g, 'const bottomLight = new THREE.PointLight(0x003366,');

  // Three.js Material Colors (Red metallic -> Dark Cyan/Navy metallic)
  // Originally it was 0xCC0811
  content = content.replace(/0xCC0811/gi, '0x050C1A'); // Very dark navy body
  content = content.replace(/emissive:\s*0x[A-Fa-f0-9]{6},/gi, 'emissive: 0x001A33,'); // Subtle blue emissive
  content = content.replace(/metalness:\s*0\.6,/gi, 'metalness: 0.9,'); // More metallic
  
  // Bloom effect - intense deep blue bloom
  // Original UnrealBloomPass might have different threshold.
  content = content.replace(/UnrealBloomPass\([\s\S]*?\);/, `UnrealBloomPass(
        new THREE.Vector2(w, h),
        1.5,   // strength
        1.2,   // radius
        0.5    // threshold
      );`);

  fs.writeFileSync('index.html', content, 'utf8');
  console.log('index.html was translated to Dark Tech successfully.');
} catch (err) {
  console.error('Error:', err);
}
