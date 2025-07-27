# SecureSharkInputs 🛡️

**Super Simple React Form Validation with Built-in Security**

A lightweight TypeScript library that makes form validation incredibly easy while providing enterprise-grade security protection. Just drop in a component and you're protected!

## 🎯 What Does It Do?

SecureSharkInputs protects your forms from:
- 🚫 **XSS Attacks** - Cross-site scripting attempts
- 🚫 **SQL Injection** - Malicious database queries  
- 🚫 **Data Theft** - Attempts to access sensitive client-side data
- 🚫 **Inappropriate Content** - Profanity and harmful language
- 🚫 **Unicode Evasion** - Characters used to bypass filters
- 🚫 **DOM Manipulation** - Malicious script injection

## 📦 Installation

```bash
npm install securesharkinputs
```

**✨ Templates will be automatically installed!**

When you install the package, it will automatically:
- ✅ Create a working React form template
- ✅ Set up the correct file structure
- ✅ Include a setup guide
- ✅ Show you exactly how to use it

## 🚀 Quick Start

### 🎯 **Super Simple Usage**

**Just one component does everything:**

```jsx
import ValidationShark from 'securesharkinputs';

// ✅ SUPER SIMPLE - Everything included!
<ValidationShark 
  name="email"
  type="email"
  label="Email"
  placeholder="Enter your email"
  required={true}
/>
```

**That's it!** The component automatically:
- ✅ Creates the input with proper styling
- ✅ Adds the label with required indicator
- ✅ Integrates with react-hook-form
- ✅ Validates security threats in real-time
- ✅ Shows error messages
- ✅ Blocks form submission if threats detected

### 📝 **Complete Example**

```jsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import ValidationShark from 'securesharkinputs';

const MyForm = () => {
  const { handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ValidationShark 
        name="name"
        type="text"
        label="Name"
        placeholder="Enter your name"
        required={true}
      />
      
      <ValidationShark 
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        required={true}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

## 🎨 **Template System**

When you install the package, you get a complete working template:

```bash
npm install securesharkinputs
# Template automatically installed to: src/components/SecureSharkForm.tsx
```

**Features of the template:**
- ✅ Complete form with all field types
- ✅ Console logging for validation events
- ✅ Security testing examples
- ✅ Ready to use immediately

## 🔧 **Component Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | ✅ | Field name for react-hook-form |
| `type` | string | ❌ | Input type (text, email, password, etc.) |
| `label` | string | ❌ | Label text |
| `placeholder` | string | ❌ | Placeholder text |
| `required` | boolean | ❌ | Whether field is required |
| `className` | string | ❌ | Additional CSS classes |
| `onValid` | function | ❌ | Callback when input is valid |
| `onInvalid` | function | ❌ | Callback when threat detected |

### 🎯 **Required Field Validation Example**

```jsx
// ✅ Simple required field
<ValidationShark 
  name="name"
  type="text"
  label="Name"
  required={true}  // ← This adds automatic validation
/>

// ✅ The component automatically:
// - Shows asterisk (*) in label
// - Prevents form submission if empty
// - Shows error message
// - Integrates with react-hook-form validation
```

## 🛡️ **Security Features**

### **Automatic Protection**
- **Real-time validation** - Checks every keystroke
- **Form blocking** - Prevents submission if threats detected
- **Visual feedback** - Shows warnings immediately
- **Console logging** - Track validation events

### **Threat Detection**
- **XSS Protection**: `<script>alert('xss')</script>`
- **SQL Injection**: `'; DROP TABLE users; --`
- **Data Theft**: `document.cookie`
- **Inappropriate Content**: Profanity and harmful language
- **Unicode Evasion**: Special characters used to bypass filters

## 📚 **Documentation**

- 📖 [Complete Guide](COMPLETE_GUIDE.md) - Detailed usage examples
- 🔗 [Connection Verification](CONNECTION_VERIFICATION.md) - Test your implementation


## 🧪 **Testing**

### **Quick Tests (No Setup Required)**

Test your implementation immediately:

```bash
# Test basic functionality
node node_modules/securesharkinputs/scripts/test-client.js

# Test integration
node node_modules/securesharkinputs/scripts/test-integration.js

# Test connection in your project
node node_modules/securesharkinputs/scripts/test-connection.js
```

### **Add to Your package.json (Recommended)**

Add these scripts to your `package.json` for easy access:

```json
{
  "scripts": {
    "test:shark": "node node_modules/securesharkinputs/scripts/test-client.js",
    "test:shark-integration": "node node_modules/securesharkinputs/scripts/test-integration.js",
    "test:shark-connection": "node node_modules/securesharkinputs/scripts/test-connection.js"
  }
}
```

Then run:
```bash
npm run test:shark
npm run test:shark-integration
npm run test:shark-connection
```

### **What Each Test Does**

| Test | Purpose | What It Checks |
|------|---------|----------------|
| **test-client** | Basic functionality | ✅ Library installation<br>✅ Component availability<br>✅ Basic validation |
| **test-integration** | Complete integration | ✅ All features working<br>✅ Template installation<br>✅ Security validation |
| **test-connection** | Real protection | ✅ Input protection in your code<br>✅ Threat detection<br>✅ Form blocking |

### **Example Test Output**

```bash
# Running test-client.js
✅ Library installed correctly
✅ ValidationShark component available
✅ Security validation working
✅ Template files present

# Running test-connection.js
🔍 Analyzing your project...
✅ Found 3 protected inputs
✅ Security validation active
📊 Protection coverage: 100%
```

### **Troubleshooting**

If tests fail:
1. **Check installation**: `npm list securesharkinputs`
2. **Verify template**: Look for `src/components/SecureSharkForm.tsx`
3. **Check console**: Open browser console (F12) for validation logs

## 🎯 **Why Choose SecureSharkInputs?**

### **Super Simple**
- One component does everything
- No complex configuration
- Automatic react-hook-form integration

### **Enterprise Security**
- Multi-layer threat detection
- Real-time validation
- Form submission blocking

### **Developer Friendly**
- TypeScript support
- Automatic template installation
- Comprehensive documentation
- Built-in testing tools

### **Production Ready**
- Lightweight (131.11 KB library code)
- Includes all dependencies (react-hook-form, react, typescript, yup)
- Battle-tested security algorithms

## 📦 **Package Info**

- **Library Size**: 131.11 KB (compiled code only)
- **Package Size**: 61.5 KB (compressed for npm)
- **Unpacked Size**: 269.3 KB (includes dependencies)
- **Dependencies**: react-hook-form, react, typescript, yup (included)
- **TypeScript**: Full support
- **React**: 18+ compatible
- **Files**: 42 total files
- **Testing Tools**: 3 built-in test scripts

### **Size Breakdown:**
- **useSchema.js**: 40.02 KB (validation engine)
- **secureSharkBackend.js**: 11.02 KB (backend protection)
- **enterpriseValidator.js**: 9.41 KB (enterprise services)
- **ValidationShark.js**: 6.96 KB (React component)
- **index.js**: 2.01 KB (entry point)

## 📚 **Documentation**

### **Complete Guides**
- **[Complete Guide](COMPLETE_GUIDE.md)** - Step-by-step tutorial for everything
- **[Connection Verification](CONNECTION_VERIFICATION.md)** - Verify your inputs are protected

### **Quick References**
- **Installation**: `npm install securesharkinputs`
- **Basic Usage**: `<ValidationShark name="email" type="email" label="Email" />`
- **Testing**: `node node_modules/securesharkinputs/scripts/test-client.js`

## 🤝 **Contributing**

We welcome contributions! Please see our [GitHub repository](https://github.com/AzzADesigns/SecureSharkInputs) for details.

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by [Azariel Moreno](https://azzadesignsweb.vercel.app/)**
