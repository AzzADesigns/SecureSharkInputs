# 🛡️ SecureSharkInputs Backend - Guía Completa

## 🎯 ¿Por qué Backend?

**Problema**: El JavaScript del lado del cliente puede ser deshabilitado o manipulado.

```javascript
// ❌ Cliente (Puede ser deshabilitado)
<ValidationShark /> // No funciona si JS está apagado
```

```bash
# ✅ Backend (Siempre activo)
npm install securesharkinputs
```

## 🚀 Instalación

```bash
npm install securesharkinputs
```

## 📦 Importación

```javascript
// CommonJS
const { 
  createBackendValidator, 
  validateInput, 
  validateForm 
} = require('securesharkinputs');

// ES Modules
import { 
  createBackendValidator, 
  validateInput, 
  validateForm 
} from 'securesharkinputs';
```

## 🔧 Uso Básico

### Validación Individual

```javascript
const { validateInput } = require('securesharkinputs');

// Input seguro
const result1 = await validateInput('Hello world');
console.log(result1.isValid); // true

// Input malicioso
const result2 = await validateInput('<script>alert("xss")</script>');
console.log(result2.isValid); // false
console.log(result2.threats); // ['XSS attack detected']
console.log(result2.severity); // 'critical'
```

### Validación de Formulario

```javascript
const { validateForm } = require('securesharkinputs');

const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  message: '<script>alert("xss")</script>'
};

const result = await validateForm(formData);
console.log(result.isValid); // false
console.log(result.overallThreats); // ['XSS attack detected']
console.log(result.fields.message.isValid); // false
```

## 🚀 Express.js Middleware

### Middleware para Campo Específico

```javascript
const express = require('express');
const { createBackendValidator } = require('securesharkinputs');

const app = express();
app.use(express.json());

// Crear validador
const validator = createBackendValidator({
  enableSanitization: true,
  logThreats: true
});

// Middleware para validar campo específico
app.post('/api/contact', 
  validator.createExpressMiddleware('message'),
  (req, res) => {
    res.json({ 
      success: true, 
      message: 'Message received',
      sanitizedMessage: req.body.message 
    });
  }
);
```

### Middleware para Todo el Body

```javascript
app.post('/api/user', 
  validator.createExpressMiddleware(),
  (req, res) => {
    res.json({ 
      success: true, 
      user: req.body 
    });
  }
);
```

## ⚡ Fastify Middleware

```javascript
const fastify = require('fastify');
const { createBackendValidator } = require('securesharkinputs');

const server = fastify();

// Crear validador
const validator = createBackendValidator({
  enableSanitization: true,
  logThreats: true
});

// Middleware para validar campo específico
server.post('/api/contact', {
  preHandler: validator.createFastifyMiddleware('message')
}, async (request, reply) => {
  return { 
    success: true, 
    message: 'Message received',
    sanitizedMessage: request.body.message 
  };
});

// Middleware para validar todo el body
server.post('/api/user', {
  preHandler: validator.createFastifyMiddleware()
}, async (request, reply) => {
  return { 
    success: true, 
    user: request.body 
  };
});
```

## 🔧 Validación Manual en Rutas

```javascript
const { createBackendValidator } = require('securesharkinputs');

const validator = createBackendValidator({
  enableSanitization: true,
  logThreats: true,
  customSanitizers: {
    // Sanitizador personalizado para emails
    email: (value) => value.toLowerCase().trim(),
    // Sanitizador personalizado para nombres
    name: (value) => value.replace(/[^\w\s]/g, '').trim()
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    // Validar cada campo individualmente
    const nameResult = await validator.validateInput(req.body.name, 'name');
    const emailResult = await validator.validateInput(req.body.email, 'email');
    const messageResult = await validator.validateInput(req.body.message, 'message');

    // Verificar si hay amenazas
    if (!nameResult.isValid || !emailResult.isValid || !messageResult.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: {
          name: nameResult,
          email: emailResult,
          message: messageResult
        }
      });
    }

    // Usar valores sanitizados
    const sanitizedData = {
      name: nameResult.sanitizedValue,
      email: emailResult.sanitizedValue,
      message: messageResult.sanitizedValue
    };

    // Procesar datos seguros
    // ... lógica de negocio

    res.json({ success: true, data: sanitizedData });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Internal validation error' });
  }
});
```

## ⚙️ Configuración Avanzada

### Configuración Completa

```javascript
const validator = createBackendValidator({
  // Configuración básica
  maxInputLength: 1000,
  enableLogging: true,
  
  // Configuración de sanitización
  enableSanitization: true,
  logThreats: true,
  
  // Sanitizadores personalizados
  customSanitizers: {
    // Sanitizador para HTML
    html: (value) => value.replace(/<[^>]*>/g, ''),
    // Sanitizador para SQL
    sql: (value) => value.replace(/['";]/g, ''),
    // Sanitizador para URLs
    url: (value) => value.replace(/javascript:/gi, ''),
    // Sanitizador para emails
    email: (value) => value.toLowerCase().trim(),
    // Sanitizador para nombres
    name: (value) => value.replace(/[^\w\s]/g, '').trim()
  }
});
```

### Configuración por Campo

```javascript
// Validar con configuración específica por campo
const nameResult = await validator.validateInput(req.body.name, 'name');
const emailResult = await validator.validateInput(req.body.email, 'email');
const messageResult = await validator.validateInput(req.body.message, 'message');

// Cada resultado incluye:
console.log(nameResult);
// {
//   isValid: boolean,
//   threats: string[],
//   sanitizedValue?: string,
//   recommendations: string[],
//   severity: 'low' | 'medium' | 'high' | 'critical'
// }
```

## 📊 Logging y Monitoreo

### Configuración de Logging

```javascript
const validator = createBackendValidator({
  enableLogging: true,
  logThreats: true
});

// Los logs aparecerán automáticamente:
// 🚨 SECURITY THREAT DETECTED in field "message": {
//   input: '<script>alert("xss")</script>',
//   threats: ['XSS attack detected'],
//   timestamp: '2024-01-15T10:30:00.000Z'
// }
```

### Monitoreo Personalizado

```javascript
app.post('/api/contact', async (req, res) => {
  const result = await validator.validateInput(req.body.message, 'message');
  
  if (!result.isValid) {
    // Log personalizado
    console.error('🚨 AMENAZA DETECTADA:', {
      user: req.user?.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      input: req.body.message,
      threats: result.threats,
      severity: result.severity,
      timestamp: new Date().toISOString()
    });

    // Notificar a sistemas de monitoreo
    await notifySecurityTeam(result);
    
    return res.status(400).json({
      error: 'Security threat detected',
      details: result
    });
  }
  
  // Procesar input seguro
  res.json({ success: true });
});
```

## 🛡️ Tipos de Amenazas Detectadas

### XSS (Cross-Site Scripting)
```javascript
// Detecta:
'<script>alert("xss")</script>'
'<img src="x" onerror="alert(1)">'
'javascript:alert("xss")'
```

### SQL Injection
```javascript
// Detecta:
"'; DROP TABLE users; --"
"SELECT * FROM users WHERE id = 1 OR 1=1"
"UNION SELECT * FROM passwords"
```

### Data Theft Attempts
```javascript
// Detecta:
'document.cookie'
'localStorage.getItem("token")'
'sessionStorage.getItem("user")'
```

### Content Moderation
```javascript
// Detecta lenguaje inapropiado
// (configurable según necesidades)
```

### Unicode Evasion
```javascript
// Detecta caracteres Unicode similares
'Hеllо wоrld' // Con caracteres similares a ASCII
```

## 📈 Niveles de Severidad

- **🔴 Critical**: XSS, SQL Injection
- **🟠 High**: Data theft, inappropriate content
- **🟡 Medium**: Long inputs, Unicode evasion
- **🟢 Low**: Inputs seguros

## 🔧 Ejemplos Prácticos

### API REST Completa

```javascript
const express = require('express');
const { createBackendValidator } = require('securesharkinputs');

const app = express();
app.use(express.json());

const validator = createBackendValidator({
  enableSanitization: true,
  logThreats: true
});

// POST /api/users
app.post('/api/users', 
  validator.createExpressMiddleware(),
  async (req, res) => {
    try {
      // Los datos ya están validados y sanitizados
      const user = await createUser(req.body);
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /api/comments
app.post('/api/comments', 
  validator.createExpressMiddleware('content'),
  async (req, res) => {
    try {
      // Solo el campo 'content' está validado
      const comment = await createComment({
        ...req.body,
        content: req.body.content // Ya sanitizado
      });
      res.json({ success: true, comment });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/search
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    const result = await validator.validateInput(query, 'search');
    
    if (!result.isValid) {
      return res.status(400).json({
        error: 'Invalid search query',
        details: result
      });
    }
    
    const searchResults = await performSearch(result.sanitizedValue);
    res.json({ success: true, results: searchResults });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### GraphQL Resolver

```javascript
const { createBackendValidator } = require('securesharkinputs');

const validator = createBackendValidator({
  enableSanitization: true,
  logThreats: true
});

const resolvers = {
  Mutation: {
    createPost: async (_, { input }, context) => {
      // Validar input antes de procesar
      const validationResult = await validator.validateForm(input);
      
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.overallThreats.join(', ')}`);
      }
      
      // Usar datos sanitizados
      const sanitizedInput = {};
      for (const [field, result] of Object.entries(validationResult.fields)) {
        sanitizedInput[field] = result.sanitizedValue;
      }
      
      // Crear post con datos seguros
      const post = await createPost(sanitizedInput);
      return post;
    }
  }
};
```

## 🧪 Testing

### Tests Unitarios

```javascript
const { validateInput, validateForm } = require('securesharkinputs');

describe('Backend Validation', () => {
  it('should validate safe input', async () => {
    const result = await validateInput('Hello world');
    expect(result.isValid).toBe(true);
    expect(result.threats).toEqual([]);
  });

  it('should detect XSS attacks', async () => {
    const result = await validateInput('<script>alert("xss")</script>');
    expect(result.isValid).toBe(false);
    expect(result.threats).toContain('XSS attack detected');
    expect(result.severity).toBe('critical');
  });

  it('should validate form data', async () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: '<script>alert("xss")</script>'
    };

    const result = await validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.overallThreats).toContain('XSS attack detected');
  });
});
```

## 🚨 Mejores Prácticas

### 1. Siempre Validar en el Backend
```javascript
// ❌ Solo validación en cliente
// ✅ Validación en cliente + backend
app.post('/api/data', validator.createExpressMiddleware(), handler);
```

### 2. Usar Sanitización
```javascript
// ✅ Habilitar sanitización
const validator = createBackendValidator({
  enableSanitization: true
});
```

### 3. Logging de Amenazas
```javascript
// ✅ Habilitar logging
const validator = createBackendValidator({
  logThreats: true
});
```

### 4. Configuración por Entorno
```javascript
const config = {
  enableSanitization: process.env.NODE_ENV === 'production',
  logThreats: process.env.NODE_ENV === 'production',
  maxInputLength: process.env.NODE_ENV === 'production' ? 500 : 1000
};

const validator = createBackendValidator(config);
```

### 5. Manejo de Errores
```javascript
app.use((error, req, res, next) => {
  if (error.message.includes('Validation failed')) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.message
    });
  }
  next(error);
});
```

## 📚 Recursos Adicionales

- [Guía de API Simple](SIMPLE_API.md)
- [Guía de Testing](TESTING.md)
- [Verificación de Conexión](CONNECTION_VERIFICATION.md)
- [Ejemplos de Backend](examples/backend-usage.js)

## 🎉 ¡Protección Completa!

Con SecureSharkInputs Backend tienes:

- ✅ **Protección en el servidor** (no puede ser deshabilitada)
- ✅ **Sanitización automática** de inputs
- ✅ **Logging de amenazas** para monitoreo
- ✅ **Middlewares** para Express y Fastify
- ✅ **Validación manual** para casos específicos
- ✅ **Configuración flexible** según necesidades

**¡Tu aplicación está protegida tanto en el cliente como en el servidor!** 🛡️ 