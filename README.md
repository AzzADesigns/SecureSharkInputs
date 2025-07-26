# SecureSharkInputs

🔒 **Advanced Enterprise Validation Library with Multi-layer Security for SecureShark**

A comprehensive TypeScript library for enterprise-grade form validation with built-in protection against XSS, SQL injection, data theft, and inappropriate content. Specifically designed for SecureShark applications.

## 📚 Documentation

- **[🚀 Quick Start](QUICK_START.md)** – Fast usage guide  
- **[📖 Getting Started](GETTING_STARTED.md)** – Full step-by-step setup  
- **[📦 Publish Guide](PUBLISH.md)** – How to publish the package  
- **[📋 Summary](SUMMARY.md)** – Project overview  
- **[🎯 Final Guide](FINAL_GUIDE.md)** – Final production setup

## ✨ Features

- 🛡️ **Multi-layer Security**: Protection against XSS, SQL injection, and data theft  
- 🔍 **Content Moderation**: Detects and blocks inappropriate content  
- 📊 **Enterprise Logging**: Logs threats with detailed context  
- ⚡ **High Performance**: Fast validation with optimized Set-based checks  
- 🎯 **Flexible Configuration**: Fully customizable options  
- 🔧 **TypeScript First**: Strong typing and developer ergonomics  
- 📱 **Framework Agnostic**: Usable in any JS/TS project  

## 🚀 Quick Start

### 1. Installation

```bash
npm install securesharkinputs
npm install yup # If not already installed
```

### 2. Basic Usage

#### Text Validation

```ts
import { createEnterpriseValidator } from 'securesharkinputs';

const validator = createEnterpriseValidator();

const result = validator.validateText('Hello world!');
console.log(result.valid); // true or false
```

#### With Configuration

```ts
const validator = createEnterpriseValidator({
  enableExternalValidation: false,
  enableLogging: true,
  maxInputLength: 1000
});

const result = validator.validateText('<script>alert("xss")</script>');
if (!result.valid) {
  console.warn(result.reason);
}
```

### 3. Schema Integration with Yup

```ts
import * as yup from 'yup';
import { createEnterpriseValidator } from 'securesharkinputs';

const validator = createEnterpriseValidator();

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required()
    .test('secure', 'Invalid input', value => validator.validateText(value || '').valid),
  comment: yup
    .string()
    .max(500)
    .required()
    .test('secure', 'Blocked input', value => validator.validateText(value || '').valid)
});
```

## 🧪 Running Tests

```bash
npm run test
```

## 🛠️ Build & Compile

```bash
npm run build
```

## 📦 Publish (Private Registry or NPM)

```bash
npm publish --access public
```

## 🤝 Contributing

1. Fork this repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

MIT
