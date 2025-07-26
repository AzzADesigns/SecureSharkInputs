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

**✨ Templates will be automatically installed!**

When you install the package, it will automatically:
- ✅ Create a working React form template
- ✅ Set up the correct file structure
- ✅ Include a setup guide
- ✅ Show you exactly how to use it

### Peer Dependencies (if using React components)
```bash
npm install react react-dom
```

## 🚀 Quick Start

### 🎯 **Copy & Paste Examples**

**Frontend (React) - Uso Correcto:**
```jsx
import ValidationShark from 'securesharkinputs';

// ✅ FORMA CORRECTA - Con contenedor
<div className="input-field">
  <input id="name" type="text" placeholder="Tu nombre" />
  <ValidationShark />  {/* ✅ Debe estar DENTRO del contenedor */}
</div>

// ✅ Con react-hook-form
<div className="input-field">
  <input id="email" type="email" {...register('email')} />
  <ValidationShark />
</div>

// ✅ Con textarea
<div className="input-field">
  <textarea id="description" placeholder="Descripción" />
  <ValidationShark />
</div>
```

**Backend (Node.js):**
```javascript
import { validateInput } from 'securesharkinputs/backend';

const result = await validateInput(userInput);
if (!result.isValid) {
  console.log('Threats detected:', result.threats);
}
```

### Frontend Usage (React)

#### 🚀 **AUTOMATIC TEMPLATES (RECOMMENDED)**

When you install the package, templates are automatically created:

```bash
npm install securesharkinputs
# ✅ Templates installed automatically!
```

Then simply import and use:

```tsx
import SecureSharkForm from './components/SecureSharkForm';

function App() {
  return <SecureSharkForm />;
}
```

**Check `SECURESHARK_SETUP.md` for detailed instructions!**

#### 🔧 **MANUAL TEMPLATE INSTALLATION**

If templates weren't installed automatically, run:

```bash
# Method 1: Using the manual install script
node node_modules/securesharkinputs/scripts/manual-install.js

# Method 2: Using npm script (add to your package.json)
npm run install-shark-templates
```

Add this to your `package.json` scripts:
```json
{
  "scripts": {
    "install-shark-templates": "node node_modules/securesharkinputs/scripts/manual-install.js"
  }
}
```

#### 🎯 **MANUAL SETUP - Uso Correcto**

**Paso 1: Instalar**
```bash
npm install securesharkinputs@1.2.4
```

**Paso 2: Importar**
```tsx
import ValidationShark from 'securesharkinputs';
```

**Paso 3: Usar CORRECTAMENTE**

```tsx
// ✅ FORMA CORRECTA - Con InputField o contenedor
function MyForm() {
  return (
    <form>
      <div className="input-container">
        <input id="name" type="text" placeholder="Tu nombre" />
        <ValidationShark />  {/* ✅ Debe estar DENTRO del contenedor */}
      </div>
      
      <div className="input-container">
        <textarea id="description" placeholder="Descripción" />
        <ValidationShark />
      </div>
    </form>
  );
}
```



**Paso 4: Con react-hook-form (RECOMENDADO)**

```tsx
import { useForm } from 'react-hook-form';
import ValidationShark from 'securesharkinputs';

function MyForm() {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-field">
        <label>Nombre *</label>
        <input 
          id="firstName" 
          type="text" 
          {...register('firstName')} 
          placeholder="Tu nombre" 
        />
        <ValidationShark />  {/* ✅ Funciona automáticamente */}
      </div>
      
      <div className="input-field">
        <label>Email *</label>
        <input 
          id="email" 
          type="email" 
          {...register('email')} 
          placeholder="tu@email.com" 
        />
        <ValidationShark />
      </div>
      
      <button type="submit">Enviar</button>
    </form>
  );
}
```

**💡 Nota:** `react-hook-form` ya viene incluido en la librería, ¡no necesitas instalarlo por separado!

#### 🚨 **IMPORTANTE - Estructura Requerida:**

```tsx
// ✅ CORRECTO - ValidationShark dentro del contenedor del input
<div className="input-container">
  <input id="name" type="text" />
  <ValidationShark />
</div>

// ❌ INCORRECTO - ValidationShark fuera del contenedor
<input id="name" type="text" />
<ValidationShark />  {/* No encontrará el input */}
```

#### 🧪 **Cómo Probar que Funciona:**

1. **Escribe contenido normal:**
   ```
   Hola mundo
   ```
   ✅ Debería mostrar "✅ Válido"

2. **Escribe contenido malicioso:**
   ```
   <script>alert('xss')</script>
   ```
   ❌ Debería mostrar "❌ Contenido no permitido detectado"
   ❌ El botón "Enviar" debería deshabilitarse

3. **Escribe SQL injection:**
   ```
   '; DROP TABLE users; --
   ```
   ❌ Debería bloquear el formulario

#### 🔧 **Configuración Avanzada (Opcional):**

```tsx
<ValidationShark 
  inputId="specific-input"  // ID específico del input
  blockForm={true}          // Bloquear formulario (default: true)
  showMessages={true}       // Mostrar mensajes (default: true)
  onValid={() => console.log('✅ Válido')}
  onInvalid={() => console.log('❌ Inválido')}
/>
```

#### 🚨 **TROUBLESHOOTING - Si no funciona:**

**Problema 1: No detecta el input**
```tsx
// ❌ INCORRECTO
<input id="name" type="text" />
<ValidationShark />  {/* No encontrará el input */}

// ✅ CORRECTO
<div className="input-container">
  <input id="name" type="text" />
  <ValidationShark />  {/* Dentro del contenedor */}
</div>
```

**Problema 2: No muestra mensajes**
```tsx
// ✅ Asegúrate de que el input tenga un ID
<input id="name" type="text" />
<ValidationShark />
```

**Problema 3: No bloquea el formulario**
```tsx
// ✅ Asegúrate de que el botón tenga type="submit"
<button type="submit">Enviar</button>
```

**Problema 4: Con react-hook-form**
```tsx
// ✅ Usa el componente InputField o un contenedor
<InputField label="Nombre">
  <input id="name" {...register('name')} />
  <ValidationShark />
</InputField>
```

#### 📋 **Ejemplo Completo Funcionando:**

```tsx
import ValidationShark from 'securesharkinputs';

const InputField = ({ label, children }) => (
  <div className="input-field">
    <label>{label}</label>
    {children}
  </div>
);

function MyForm() {
  return (
    <form>
      <InputField label="Nombre">
        <input id="name" type="text" />
        <ValidationShark />  {/* ✅ Funciona */}
      </InputField>
    </form>
  );
}
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
