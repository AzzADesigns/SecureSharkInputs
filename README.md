# SecureSharkInputs 🛡️

**Advanced Enterprise Validation Library with Multi-layer Security**

A comprehensive TypeScript library for enterprise-grade form validation with built-in protection against XSS, SQL injection, data theft, and inappropriate content. Designed to be super simple to use while providing maximum security.

## 🎯 What Does It Do?

SecureSharkInputs protects your application inputs from:

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

### Peer Dependencies (if using React components)
```bash
npm install react react-dom
```

## 🚀 Quick Start

### 🎯 **Copy & Paste Examples**

**Node.js (Backend):**
```bash
# 1. Install
npm install securesharkinputs

# 2. Copy examples/quick-example.js to your project
# 3. Run
node quick-example.js
```

**React (Frontend):**
```bash
# 1. Install
npm install securesharkinputs react react-dom

# 2. Copy examples/react-example.jsx to your project
# 3. Import and use
```

**Express (Backend):**
```bash
# 1. Install
npm install securesharkinputs express

# 2. Copy examples/backend-example.js to your project
# 3. Run
node backend-example.js
```

### Frontend Usage (React)

#### 1. Super Simple (1 line of code)

```tsx
import ValidationShark from 'securesharkinputs';

function MyForm() {
  return (
    <div>
      <input type="text" placeholder="Write something..." />
      <ValidationShark />
    </div>
  );
}
```

That's it! The component automatically:
- ✅ Finds the nearest input
- ✅ Validates in real-time
- ✅ Shows error/success messages
- ✅ Protects against XSS, SQL injection, inappropriate content, etc.

#### 2. With Specific ID

```tsx
<input id="my-input" type="text" />
<ValidationShark for="my-input" />
```

#### 3. With Configuration

```tsx
<input type="text" />
<ValidationShark 
  maxLength={500}
  onValid={() => console.log('✅ Valid')}
  onInvalid={() => console.log('❌ Invalid')}
/>
```

#### 4. Programmatic API

```tsx
import { useSharkValidation } from 'securesharkinputs';

function MyComponent() {
  const { validate, validateSync } = useSharkValidation();
  
  const handleSubmit = async () => {
    const result = await validate("text to validate");
    console.log(result.isValid); // true/false
  };
}
```

### Backend Usage (Node.js)

#### 1. Basic Validation

```javascript
const { validateInput } = require('securesharkinputs/backend');

const result = await validateInput("malicious input");
if (!result.isValid) {
  console.log("Threat detected:", result.threats);
}
```

#### 2. Express.js Middleware

```javascript
const { createBackendValidator } = require('securesharkinputs/backend');

const validator = createBackendValidator({
  enableSanitization: true,
  logThreats: true
});

app.post('/api/contact', 
  validator.createExpressMiddleware('message'),
  (req, res) => {
    // Data already validated and sanitized
    res.json({ success: true });
  }
);
```

#### 3. Fastify Middleware

```javascript
const { createBackendValidator } = require('securesharkinputs/backend');

const validator = createBackendValidator();

app.post('/api/contact', 
  validator.createFastifyMiddleware('message'),
  (req, res) => {
    res.json({ success: true });
  }
);
```

### Lightweight Version (For Small Apps)

```javascript
import { createLightweightValidator } from 'securesharkinputs';

const validator = createLightweightValidator({
  maxInputLength: 500,
  enableXSSDetection: true,
  enableSQLDetection: true,
  enableDataTheftDetection: true
});

// Weight: ~5.63 KB
// Protections: XSS, SQL, Data theft basics
```

## 🧪 Testing Your Installation

### 1. Basic Functionality Test

```bash
# In your project
node node_modules/securesharkinputs/scripts/test-client.js
```

### 2. Real Connection Verification

```bash
# Verify your inputs are actually protected
node node_modules/securesharkinputs/scripts/test-connection.js
```

### 3. Add to Your package.json

```json
{
  "scripts": {
    "test:shark": "node node_modules/securesharkinputs/scripts/test-client.js",
    "test:connection": "node node_modules/securesharkinputs/scripts/test-connection.js"
  }
}
```

Then run:
```bash
npm run test:shark
npm run test:connection
```

## 📊 Package Sizes

| Version | Size | Use Case |
|---------|------|----------|
| **Complete** | 153.57 KB | Enterprise applications |
| **Lightweight** | ~5.63 KB | Small applications |
| **React Components** | ~8 KB | Prototypes |
| **Backend Only** | ~9.63 KB | APIs |

## 🛡️ Security Features

### Multi-layer Protection
- **XSS Detection**: Script injection attempts
- **SQL Injection**: Malicious database queries
- **Data Theft**: Access to sensitive client-side data
- **Content Moderation**: Inappropriate language detection
- **Unicode Evasion**: Character bypass attempts
- **DOM Manipulation**: Malicious script injection

### Backend Integration
- **Server-side validation** that cannot be disabled
- **Automatic sanitization** of malicious input
- **Express.js & Fastify middlewares**
- **Detailed threat logging**

### Real-time Protection
- **Automatic input detection**
- **Instant validation feedback**
- **Configurable error messages**
- **Callback support for custom logic**

## 📚 Documentation

- **[🛡️ Complete Guide](COMPLETE_GUIDE.md)** – **START HERE!** Complete step-by-step guide
- **[🛡️ Backend Guide](BACKEND_GUIDE.md)** – Server-side protection
- **[🔗 Connection Verification](CONNECTION_VERIFICATION.md)** – Verify real protection
- **[🚀 Optimization Guide](OPTIMIZATION_GUIDE.md)** – Performance tips

## 🤝 Contributing

1. Fork this repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

MIT
