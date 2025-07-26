#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🛡️ SecureSharkInputs - Installing templates...');

// Get the project root (where package.json is located)
const projectRoot = process.env.INIT_CWD || process.cwd();
console.log(`📁 Project root: ${projectRoot}`);

// Check if we're in a valid npm install context
if (!process.env.npm_package_name) {
  console.log('ℹ️ Not running in npm install context, skipping template installation');
  console.log('💡 To install templates manually, run: node node_modules/securesharkinputs/scripts/install-templates.js');
  process.exit(0);
}

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
try {
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
    console.log('✅ Created src/components directory');
  } else {
    console.log('✅ src/components directory already exists');
  }
} catch (error) {
  console.error(`❌ Error creating components directory: ${error.message}`);
  console.log('💡 You can create the directory manually and run the script again');
}

// Copy templates
let installedCount = 0;
templates.forEach(template => {
  try {
    console.log(`📄 Checking template: ${template.source}`);
    
    if (fs.existsSync(template.source)) {
      // Check if destination already exists
      if (fs.existsSync(template.destination)) {
        console.log(`⚠️ Template already exists: ${template.destination}`);
        console.log('💡 Skipping to avoid overwriting existing files');
        return;
      }
      
      fs.copyFileSync(template.source, template.destination);
      console.log(`✅ Installed: ${template.description}`);
      console.log(`   Location: ${template.destination}`);
      installedCount++;
    } else {
      console.warn(`⚠️ Template not found: ${template.source}`);
      console.log(`💡 Make sure the package is properly installed`);
    }
  } catch (error) {
    console.error(`❌ Error installing template: ${error.message}`);
    console.log(`💡 You can copy the template manually from: ${template.source}`);
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
- ✅ React Hook Form Integration (included in library)

## 🎯 Customization

Modify the template at \`src/components/SecureSharkForm.tsx\` to match your needs.

## 🔧 Manual Installation

If templates weren't installed automatically, run:
\`\`\`bash
node node_modules/securesharkinputs/scripts/install-templates.js
\`\`\`
`;

try {
  const guidePath = path.join(projectRoot, 'SECURESHARK_SETUP.md');
  fs.writeFileSync(guidePath, setupGuide);
  console.log('✅ Created setup guide: SECURESHARK_SETUP.md');
} catch (error) {
  console.error(`❌ Error creating setup guide: ${error.message}`);
}

if (installedCount > 0) {
  console.log('\n🎉 SecureSharkInputs templates installed successfully!');
  console.log('📖 Check SECURESHARK_SETUP.md for usage instructions');
} else {
  console.log('\n⚠️ No templates were installed');
  console.log('💡 You can install them manually by running:');
  console.log('   node node_modules/securesharkinputs/scripts/install-templates.js');
} 