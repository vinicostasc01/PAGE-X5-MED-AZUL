const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // CSS Variables
  content = content.replace(/--accent: #E50914;/g, '--accent: #F5F5F5;');
  content = content.replace(/--accent-hover: #B20710;/g, '--accent-hover: #B0B0B0;');
  
  // All rgba colors using the red signature (e.g. glows, grid lines, box-shadows)
  // We use replace with regex to catch all spaces
  content = content.replace(/229,\s*9,\s*20/g, '255, 255, 255');
  
  // Explicit hex in CSS or SVGs
  content = content.replace(/#E50914/gi, '#F5F5F5');
  content = content.replace(/#B20710/gi, '#B0B0B0');

  // Three.js colors (Point lights, Rim lights, Particles, Lines)
  content = content.replace(/0xE50914/gi, '0xFFFFFF');
  
  // Three.js Material Colors (Red metallic -> Silver metallic)
  content = content.replace(/0xCC0811/gi, '0xDFDFDF');
  
  fs.writeFileSync('index-silver.html', content, 'utf8');
  console.log('index-silver.html was cloned and translated to silver successfully.');
} catch (err) {
  console.error('Error:', err);
}
