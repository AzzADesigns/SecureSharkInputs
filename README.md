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
- ⚡ [Optimization Guide](OPTIMIZATION_GUIDE.md) - Performance tips

## 🧪 **Testing**

Test your implementation:

```bash
# Test basic functionality
npm run test:client

# Test integration
npm run test:integration

# Test connection in your project
npm run test:connection
```

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
- Lightweight (67.8 kB)
- Zero dependencies (except react-hook-form)
- Battle-tested security algorithms

## 📦 **Package Info**

- **Size**: 67.8 kB (unpacked: 297.1 kB)
- **Dependencies**: react-hook-form (included)
- **TypeScript**: Full support
- **React**: 18+ compatible

## 🤝 **Contributing**

We welcome contributions! Please see our [GitHub repository](https://github.com/AzzADesigns/SecureSharkInputs) for details.

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by [Azariel Moreno](https://github.com/AzzADesigns)**
