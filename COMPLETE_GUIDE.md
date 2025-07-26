# 🛡️ SecureSharkInputs - Guía Completa Paso a Paso

## 📋 Índice

1. [🎯 ¿Qué es SecureSharkInputs?](#-qué-es-securesharkinputs)
2. [📦 Instalación](#-instalación)
3. [🚀 Primeros Pasos](#-primeros-pasos)
4. [⚛️ Uso con React](#️-uso-con-react)
5. [🔧 Uso con Backend](#-uso-con-backend)
6. [🧪 Testing](#-testing)
7. [🔧 Configuración Avanzada](#-configuración-avanzada)
8. [❓ Troubleshooting](#-troubleshooting)

---

## 🎯 ¿Qué es SecureSharkInputs?

SecureSharkInputs es una librería que **protege automáticamente** todos los inputs de tu aplicación contra:

- 🚫 **Ataques XSS** (Cross-site scripting)
- 🚫 **Inyección SQL** 
- 🚫 **Robo de datos** (cookies, localStorage, etc.)
- 🚫 **Contenido inapropiado**
- 🚫 **Caracteres Unicode maliciosos**
- 🚫 **Manipulación del DOM**

### 🎯 ¿Por qué necesitas esto?

**Sin protección:**
```javascript
// ❌ Vulnerable a ataques
<input type="text" />
// Usuario puede escribir: <script>alert('hack')</script>
```

**Con SecureSharkInputs:**
```javascript
// ✅ Protegido automáticamente
<input type="text" />
<ValidationShark />
// Bloquea automáticamente cualquier intento de ataque
```

---

## 📦 Instalación

### Paso 1: Instalar la librería

```bash
npm install securesharkinputs
```

### Paso 2: Instalar React (si usas componentes React)

```bash
npm install react react-dom
```

### Paso 3: Verificar la instalación

```bash
# Crear archivo de prueba
echo "console.log('SecureSharkInputs instalado correctamente')" > test-install.js
node test-install.js
```

---

## 🚀 Primeros Pasos

### Paso 1: Crear tu primer archivo de prueba

Crea un archivo llamado `mi-primer-test.js`:

```javascript
// mi-primer-test.js
const { createLightweightValidator } = require('securesharkinputs');

// Crear validador
const validator = createLightweightValidator();

// Función para probar
async function probarValidacion() {
  console.log('🔍 Probando SecureSharkInputs...\n');
  
  // Test 1: Texto normal
  const resultado1 = await validator.validate("Hola mundo");
  console.log('✅ Texto normal:', resultado1.isValid ? 'VÁLIDO' : 'INVÁLIDO');
  
  // Test 2: Ataque XSS
  const resultado2 = await validator.validate("<script>alert('xss')</script>");
  console.log('❌ Ataque XSS:', resultado2.isValid ? 'VÁLIDO' : 'INVÁLIDO');
  console.log('   Amenazas detectadas:', resultado2.threats);
  
  // Test 3: Inyección SQL
  const resultado3 = await validator.validate("SELECT * FROM users");
  console.log('❌ Inyección SQL:', resultado3.isValid ? 'VÁLIDO' : 'INVÁLIDO');
  console.log('   Amenazas detectadas:', resultado3.threats);
}

// Ejecutar prueba
probarValidacion();
```

### Paso 2: Ejecutar la prueba

```bash
node mi-primer-test.js
```

**Resultado esperado:**
```
🔍 Probando SecureSharkInputs...

✅ Texto normal: VÁLIDO
❌ Ataque XSS: INVÁLIDO
   Amenazas detectadas: ['XSS attack detected']
❌ Inyección SQL: INVÁLIDO
   Amenazas detectadas: ['SQL injection detected']
```

### ✅ ¡Felicidades! Ya tienes SecureSharkInputs funcionando

---

## ⚛️ Uso con React

### Paso 1: Crear un proyecto React (si no tienes uno)

```bash
npx create-react-app mi-app-segura
cd mi-app-segura
npm install securesharkinputs
```

### Paso 2: Crear tu primer componente protegido

Crea un archivo `MiFormulario.jsx`:

```jsx
// MiFormulario.jsx
import React, { useState } from 'react';
import ValidationShark from 'securesharkinputs';

function MiFormulario() {
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', mensaje);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Formulario Protegido</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu nombre..."
            style={{ width: '100%', padding: '8px' }}
          />
          <ValidationShark for="nombre" />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje..."
            style={{ width: '100%', padding: '8px', height: '100px' }}
          />
          <ValidationShark for="mensaje" />
        </div>

        <button 
          type="submit"
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default MiFormulario;
```

### Paso 3: Usar el componente en tu app

```jsx
// App.js
import React from 'react';
import MiFormulario from './MiFormulario';

function App() {
  return (
    <div className="App">
      <h1>Mi App Segura</h1>
      <MiFormulario />
    </div>
  );
}

export default App;
```

### Paso 4: Probar ataques

1. **Ejecuta tu app:**
```bash
npm start
```

2. **Prueba estos ataques en los inputs:**
   - `<script>alert('xss')</script>`
   - `SELECT * FROM users`
   - `document.cookie`
   - `javascript:alert('hack')`

3. **Observa cómo SecureSharkInputs bloquea automáticamente cada ataque**

### ✅ ¡Tu formulario React ya está protegido!

---

## 🔧 Uso con Backend

### Paso 1: Crear un servidor Express

Crea un archivo `servidor.js`:

```javascript
// servidor.js
const express = require('express');
const { createBackendValidator } = require('securesharkinputs');

const app = express();
app.use(express.json());

// Crear validador
const validator = createBackendValidator({
  enableSanitization: true,
  logThreats: true
});

// Ruta protegida
app.post('/api/contact', 
  validator.createExpressMiddleware('message'),
  (req, res) => {
    console.log('✅ Mensaje recibido y validado:', req.body.message);
    res.json({ 
      success: true, 
      message: 'Mensaje recibido correctamente',
      sanitizedMessage: req.body.message 
    });
  }
);

// Ruta para probar validación manual
app.post('/api/test', async (req, res) => {
  const { validateInput } = require('securesharkinputs');
  
  const input = req.body.input || '';
  const result = await validateInput(input);
  
  res.json({
    input: input,
    isValid: result.isValid,
    threats: result.threats,
    severity: result.severity
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📝 Prueba con: curl -X POST http://localhost:3001/api/test -H "Content-Type: application/json" -d "{\\"input\\":\\"<script>alert(\\"xss\\")\\</script>\\"}"');
});
```

### Paso 2: Instalar dependencias

```bash
npm install express
```

### Paso 3: Ejecutar el servidor

```bash
node servidor.js
```

### Paso 4: Probar ataques

**Abrir otra terminal y ejecutar:**

```bash
# Test 1: Input normal
curl -X POST http://localhost:3001/api/test \
  -H "Content-Type: application/json" \
  -d '{"input":"Hola mundo"}'

# Test 2: Ataque XSS
curl -X POST http://localhost:3001/api/test \
  -H "Content-Type: application/json" \
  -d '{"input":"<script>alert(\"xss\")</script>"}'

# Test 3: Inyección SQL
curl -X POST http://localhost:3001/api/test \
  -H "Content-Type: application/json" \
  -d '{"input":"SELECT * FROM users"}'
```

### ✅ ¡Tu backend ya está protegido!

---

## 🧪 Testing

### Paso 1: Test básico de instalación

```bash
# Crear archivo de test
cat > test-basico.js << 'EOF'
const { createLightweightValidator } = require('securesharkinputs');

const validator = createLightweightValidator();

async function testBasico() {
  console.log('🧪 Test básico de SecureSharkInputs...\n');
  
  const tests = [
    { input: "Hola mundo", expected: true, name: "Texto normal" },
    { input: "<script>alert('xss')</script>", expected: false, name: "XSS" },
    { input: "SELECT * FROM users", expected: false, name: "SQL Injection" },
    { input: "document.cookie", expected: false, name: "Data Theft" }
  ];
  
  for (const test of tests) {
    const result = await validator.validate(test.input);
    const status = result.isValid === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${result.isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
    if (!result.isValid) {
      console.log(`   Amenazas: ${result.threats.join(', ')}`);
    }
  }
}

testBasico();
EOF

# Ejecutar test
node test-basico.js
```

### Paso 2: Test de conexión real (React)

```bash
# Crear archivo de test de conexión
cat > test-conexion.js << 'EOF'
const fs = require('fs');
const path = require('path');

function findReactFiles(dir = '.') {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile() && /\.(jsx?|tsx?)$/.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const inputs = [];
    const validationSharks = [];
    
    // Buscar inputs
    const inputRegex = /<input[^>]*>/gi;
    let match;
    while ((match = inputRegex.exec(content)) !== null) {
      inputs.push({
        line: content.substring(0, match.index).split('\n').length,
        content: match[0]
      });
    }
    
    // Buscar ValidationShark
    const sharkRegex = /<ValidationShark[^>]*>/gi;
    while ((match = sharkRegex.exec(content)) !== null) {
      validationSharks.push({
        line: content.substring(0, match.index).split('\n').length,
        content: match[0]
      });
    }
    
    return { inputs, validationSharks };
  } catch (error) {
    return { inputs: [], validationSharks: [] };
  }
}

function generateReport() {
  console.log('🔍 Analizando conexión de ValidationShark...\n');
  
  const files = findReactFiles();
  let totalInputs = 0;
  let protectedInputs = 0;
  
  for (const file of files) {
    const analysis = analyzeFile(file);
    
    if (analysis.inputs.length > 0 || analysis.validationSharks.length > 0) {
      console.log(`📁 ${file}:`);
      console.log(`   Inputs encontrados: ${analysis.inputs.length}`);
      console.log(`   ValidationShark encontrados: ${analysis.validationSharks.length}`);
      
      totalInputs += analysis.inputs.length;
      protectedInputs += Math.min(analysis.inputs.length, analysis.validationSharks.length);
    }
  }
  
  console.log('\n📊 Resumen:');
  console.log(`   Total de inputs: ${totalInputs}`);
  console.log(`   Inputs protegidos: ${protectedInputs}`);
  console.log(`   Inputs sin protección: ${totalInputs - protectedInputs}`);
  
  if (totalInputs > 0) {
    const protectionRate = ((protectedInputs / totalInputs) * 100).toFixed(1);
    console.log(`   Tasa de protección: ${protectionRate}%`);
  }
  
  if (totalInputs - protectedInputs > 0) {
    console.log('\n⚠️  RECOMENDACIÓN:');
    console.log('   Agrega <ValidationShark /> debajo de los inputs sin protección');
  } else if (totalInputs > 0) {
    console.log('\n✅ ¡Excelente! Todos los inputs están protegidos');
  }
}

generateReport();
EOF

# Ejecutar test de conexión
node test-conexion.js
```

### ✅ ¡Ya sabes cómo testear tu instalación!

---

## 🔧 Configuración Avanzada

### Paso 1: Configuración personalizada

```javascript
// configuracion-avanzada.js
const { createEnterpriseValidator } = require('securesharkinputs');

// Validador con configuración personalizada
const validator = createEnterpriseValidator({
  // Longitud máxima
  maxInputLength: 1000,
  
  // Logging
  enableLogging: true,
  logLevel: 'warn',
  
  // Amenazas específicas
  enableXSSDetection: true,
  enableSQLDetection: true,
  enableDataTheftDetection: true,
  enableContentModeration: false, // Desactivar moderación de contenido
  
  // Dominios de email permitidos
  allowedEmailDomains: ['miempresa.com', 'gmail.com'],
  
  // Callbacks
  onThreatDetected: (threat) => {
    console.log('🚨 Amenaza detectada:', threat);
    // Aquí puedes enviar alertas, logs, etc.
  }
});

// Función para probar configuración
async function probarConfiguracion() {
  console.log('🔧 Probando configuración avanzada...\n');
  
  const tests = [
    { input: "Texto muy largo...".repeat(100), name: "Texto muy largo" },
    { input: "usuario@otrodominio.com", name: "Email dominio no permitido" },
    { input: "<script>alert('xss')</script>", name: "XSS" },
    { input: "SELECT * FROM users", name: "SQL Injection" }
  ];
  
  for (const test of tests) {
    const result = await validator.validate(test.input);
    const status = result.isValid ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${result.isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
    if (!result.isValid) {
      console.log(`   Razón: ${result.reason}`);
      console.log(`   Amenazas: ${result.threats.join(', ')}`);
    }
  }
}

probarConfiguracion();
```

### Paso 2: Ejecutar configuración avanzada

```bash
node configuracion-avanzada.js
```

### ✅ ¡Ya tienes configuración avanzada!

---

## ❓ Troubleshooting

### Problema 1: "Cannot find module 'securesharkinputs'"

**Solución:**
```bash
# Verificar instalación
npm list securesharkinputs

# Reinstalar si es necesario
npm uninstall securesharkinputs
npm install securesharkinputs
```

### Problema 2: "ValidationShark is not defined" (React)

**Solución:**
```jsx
// ❌ Incorrecto
import ValidationShark from 'securesharkinputs';

// ✅ Correcto
import { ValidationShark } from 'securesharkinputs';
```

### Problema 3: "React is not defined" (React)

**Solución:**
```bash
# Instalar React
npm install react react-dom
```

### Problema 4: Los inputs no se protegen automáticamente

**Solución:**
```jsx
// ❌ No funciona
<input type="text" />
<ValidationShark /> // Muy lejos del input

// ✅ Funciona
<input type="text" />
<ValidationShark /> // Justo debajo del input

// ✅ También funciona
<input id="mi-input" type="text" />
<ValidationShark for="mi-input" />
```

### Problema 5: Backend no valida

**Solución:**
```javascript
// ❌ Incorrecto
const { validateInput } = require('securesharkinputs');

// ✅ Correcto
const { validateInput } = require('securesharkinputs/backend');
```

---

## 🎉 ¡Felicidades!

Ya tienes SecureSharkInputs completamente configurado y funcionando. Tu aplicación está protegida contra:

- ✅ Ataques XSS
- ✅ Inyección SQL  
- ✅ Robo de datos
- ✅ Contenido inapropiado
- ✅ Caracteres Unicode maliciosos
- ✅ Manipulación del DOM

### 📞 ¿Necesitas ayuda?

- 📖 [Documentación completa](https://github.com/tu-usuario/securesharkinputs)
- 🐛 [Reportar bugs](https://github.com/tu-usuario/securesharkinputs/issues)
- 💬 [Soporte](https://github.com/tu-usuario/securesharkinputs/discussions)

**¡Tu aplicación ahora es segura!** 🛡️ 