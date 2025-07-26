#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🛡️ SecureSharkInputs - Installing templates...');

// Get the project root (where package.json is located)
const projectRoot = process.env.INIT_CWD || process.cwd();

// Define template source and destination paths
const templates = [
  {
    source: path.join(__dirname, '../templates/react-form-template.tsx'),
    destination: path.join(projectRoot, 'src/components/SecureSharkForm.tsx'),
    description: 'React form template with ValidationShark'
  }
];

// Create src/components directory if it doesn't exist
const componentsDir = path.join(projectRoot, 'src/components');
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
  console.log('✅ Created src/components directory');
}

// Copy templates
templates.forEach(template => {
  try {
    if (fs.existsSync(template.source)) {
      fs.copyFileSync(template.source, template.destination);
      console.log(`✅ Installed: ${template.description}`);
      console.log(`   Location: ${template.destination}`);
    } else {
      console.warn(`⚠️ Template not found: ${template.source}`);
    }
  } catch (error) {
    console.error(`❌ Error installing template: ${error.message}`);
  }
});

// Create a setup guide
const setupGuide = `# SecureSharkInputs Setup Guide

## 🚀 Quick Start

1. **Import the template in your component:**
   \`\`\`tsx
   import SecureSharkForm from './components/SecureSharkForm';
   \`\`\`

2. **Use it in your app:**
   \`\`\`tsx
   function App() {
     return (
       <div>
         <SecureSharkForm />
       </div>
     );
   }
   \`\`\`

3. **Test security features:**
   - Try XSS: \`<script>alert('xss')</script>\`
   - Try SQL Injection: \`'; DROP TABLE users; --\`
   - Try Data Theft: \`document.cookie\`

## 📚 Documentation

- **NPM Package:** https://www.npmjs.com/package/securesharkinputs
- **GitHub:** https://github.com/AzzADesigns/SecureSharkInputs
- **Full Documentation:** See README.md in the package

## 🛡️ Features

- ✅ XSS Protection
- ✅ SQL Injection Protection  
- ✅ Data Theft Protection
- ✅ Form Blocking
- ✅ Real-time Validation
- ✅ React Hook Form Integration

## 🎯 Customization

Modify the template at \`src/components/SecureSharkForm.tsx\` to match your needs.
`;

const guidePath = path.join(projectRoot, 'SECURESHARK_SETUP.md');
fs.writeFileSync(guidePath, setupGuide);
console.log('✅ Created setup guide: SECURESHARK_SETUP.md');

console.log('\n🎉 SecureSharkInputs templates installed successfully!');
console.log('📖 Check SECURESHARK_SETUP.md for usage instructions'); 