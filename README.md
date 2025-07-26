# SecureSharkInputs

🔒 **Advanced enterprise validation library with multi-layer security protection for SecureShark**

A comprehensive TypeScript library for enterprise-grade form validation with built-in protection against XSS, SQL injection, data theft, and inappropriate content. Designed specifically for SecureShark applications.

## 📚 Documentación

- **[🚀 Quick Start](QUICK_START.md)** - Guía rápida de uso
- **[📖 Getting Started](GETTING_STARTED.md)** - Guía paso a paso completa
- **[📦 Publish Guide](PUBLISH.md)** - Cómo publicar el paquete
- **[📋 Summary](SUMMARY.md)** - Resumen del proyecto
- **[🎯 Final Guide](FINAL_GUIDE.md)** - Guía final completa

## ✨ Features

- 🛡️ **Multi-layer Security**: Protection against XSS, SQL injection, data theft
- 🔍 **Content Moderation**: Advanced inappropriate content detection
- 📊 **Enterprise Logging**: Comprehensive threat monitoring and logging
- ⚡ **High Performance**: Optimized with Set-based lookups and memoization
- 🎯 **Flexible Configuration**: Customizable validation rules and thresholds
- 🔧 **TypeScript First**: Full TypeScript support with type safety
- 📱 **Framework Agnostic**: Works with any JavaScript/TypeScript project

## 🚀 Quick Start

### 1. Installation

```bash
npm install securesharkinputs
npm install yup  # Si no lo tienes ya
```

### 2. Basic Usage

#### Validación Simple
```typescript
import { createEnterpriseValidator } from 'securesharkinputs';

// Crear validador
const validator = createEnterpriseValidator();

// Validar texto normal
const result = await validator.validate("Hola mundo");
console.log(result.isValid); // true

// Validar texto malicioso
const maliciousResult = await validator.validate("<script>alert('xss')</script>");
console.log(result.isValid); // false
console.log(result.reason); // "inappropriate_content"
```

#### Validación de Formularios
```typescript
import { entryFormSchema } from 'securesharkinputs';

const formData = {
  email: "usuario@empresa.com",
  firstName: "Juan",
  lastName: "Pérez",
  age: 25,
  phone: "+1234567890",
  country: "México",
  role: "Desarrollador",
  linkedin: "https://linkedin.com/in/juanperez",
  expectations: "Quiero contribuir a proyectos innovadores."
};

try {
  const validatedData = await entryFormSchema.validate(formData);
  console.log("✅ Formulario válido:", validatedData);
} catch (error) {
  console.error("❌ Error:", error.message);
}
```

### 3. Ver Logs de Amenazas

```typescript
import { ValidationLogger } from 'securesharkinputs';

const logger = ValidationLogger.getInstance();
const logs = logger.getLogs();

logs.forEach(log => {
  console.log(`[${log.level}] ${log.message}`);
  if (log.detectedThreats) {
    console.log('Amenazas:', log.detectedThreats);
  }
});
```

## 📖 Installation

```bash
npm install securesharkinputs
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { createEnterpriseValidator, entryFormSchema } from 'securesharkinputs';

// Create validator with custom configuration
const validator = createEnterpriseValidator({
  enableExternalValidation: false,
  enableLogging: true,
  maxInputLength: 1000,
  allowedEmailDomains: ['company.com']
});

// Validate text input
const result = await validator.validate("user input");
console.log(result.isValid); // true/false
```

### Form Validation with Yup

```typescript
import { entryFormSchema } from 'securesharkinputs';

// Validate form data
const formData = {
  email: "user@company.com",
  firstName: "John",
  lastName: "Doe",
  age: 25,
  phone: "+1234567890",
  country: "United States",
  role: "Developer",
  linkedin: "https://linkedin.com/in/johndoe",
  expectations: "I want to contribute to innovative projects..."
};

try {
  const validatedData = await entryFormSchema.validate(formData);
  console.log("Validation passed:", validatedData);
} catch (error) {
  console.error("Validation failed:", error.message);
}
```

## 🔧 Configuration

### Enterprise Validation Config

```typescript
import { EnterpriseValidationConfig } from 'securesharkinputs';

const config: EnterpriseValidationConfig = {
  enableExternalValidation: false,    // Enable external services (Azure, etc.)
  enableLogging: true,               // Enable threat logging
  logLevel: 'warn',                  // 'info' | 'warn' | 'error'
  maxInputLength: 1000,              // Maximum input length
  maxValidationTime: 5000,           // Max validation time in ms
  allowedEmailDomains: ['company.com'], // Allowed email domains
  enableAutoUpdate: false,           // Auto-update blacklists
  updateInterval: 30                 // Update interval in days
};
```

### Custom Schema Validation

```typescript
import * as yup from 'yup';
import { createEnterpriseValidator } from 'securesharkinputs';

const validator = createEnterpriseValidator();

const customSchema = yup.object({
  username: yup
    .string()
    .required()
    .test('enterprise-validation', 'Security validation failed', async value => {
      if (!value) return true;
      const result = await validator.validate(value);
      return result.isValid;
    })
});
```

## 🛡️ Security Features

### Protection Against:

- **XSS (Cross-Site Scripting)**: Blocks malicious HTML/JavaScript
- **SQL Injection**: Detects and blocks SQL injection attempts
- **Data Theft**: Prevents access to cookies/localStorage
- **Inappropriate Content**: Advanced content moderation
- **Character Evasion**: Detects Unicode homoglyphs and zero-width characters
- **CSRF Attacks**: Cross-site request forgery protection

### Threat Detection Examples

```typescript
// These inputs would be blocked:
"<script>alert('xss')</script>"           // XSS attempt
"SELECT * FROM users"                      // SQL injection
"document.cookie"                          // Data theft attempt
"javascript:alert('xss')"                  // XSS via protocol
"<img src=x onerror=alert(1)>"            // XSS via event handler
```

## 📊 Logging and Monitoring

### Access Logs

```typescript
import { ValidationLogger } from 'securesharkinputs';

const logger = ValidationLogger.getInstance();
const logs = logger.getLogs();

logs.forEach(log => {
  console.log(`[${log.level}] ${log.message}`, {
    timestamp: log.timestamp,
    input: log.input,
    threats: log.detectedThreats
  });
});
```

### Log Structure

```typescript
interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  input?: string;           // Truncated for privacy
  detectedThreats?: string[];
}
```

## 🎯 API Reference

### Core Functions

#### `createEnterpriseValidator(config?)`
Creates a new enterprise validator instance.

```typescript
const validator = createEnterpriseValidator({
  enableExternalValidation: true,
  maxInputLength: 2000
});
```

#### `validator.validate(text: string)`
Validates text input and returns validation result.

```typescript
const result = await validator.validate("user input");
// Returns: { isValid: boolean, reason?: string }
```

#### `validator.getLogs()`
Returns all validation logs.

```typescript
const logs = validator.getLogs();
```

#### `validator.updateBlacklist()`
Updates the blacklist from external sources.

```typescript
await validator.updateBlacklist();
```

### Schemas

#### `entryFormSchema`
Pre-configured Yup schema for common form fields with enterprise validation.

```typescript
import { entryFormSchema } from 'securesharkinputs';

const validatedData = await entryFormSchema.validate(formData);
```

## 🔍 Advanced Usage

### Custom Validation Rules

```typescript
import * as yup from 'yup';
import { createEnterpriseValidator } from 'securesharkinputs';

const validator = createEnterpriseValidator();

const customValidation = yup.object({
  content: yup
    .string()
    .required()
    .test('enterprise-security', 'Security validation failed', async value => {
      if (!value) return true;
      
      const result = await validator.validate(value);
      if (!result.isValid) {
        throw new Error(`Security validation failed: ${result.reason}`);
      }
      return true;
    })
});
```

### External Service Integration

```typescript
const validator = createEnterpriseValidator({
  enableExternalValidation: true,
  azureContentModerator: {
    endpoint: "https://your-region.api.cognitive.microsoft.com",
    key: "your-api-key"
  }
});
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Build

```bash
# Build for production
npm run build

# Development build with watch
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: walter.azariel.moreno@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/AzzADesigns/securesharkinputs/issues)
- 📖 Documentation: [GitHub Wiki](https://github.com/AzzADesigns/securesharkinputs/wiki)
- 👨‍💻 GitHub: [@AzzADesigns](https://github.com/AzzADesigns)

## 🙏 Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- Powered by [Yup](https://github.com/jquense/yup)
- Inspired by enterprise security best practices
- Designed for SecureShark applications

---

**Made with ❤️ for secure enterprise applications** #   S e c u r e S h a r k I n p u t s  
 