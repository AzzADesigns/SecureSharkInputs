# 🛡️ SecureSharkInputs - Guía Completa Paso a Paso

## 📋 Índice

1. [🎯 ¿Qué es SecureSharkInputs?](#-qué-es-securesharkinputs)
2. [📦 Instalación](#-instalación)
3. [🚀 Primeros Pasos](#-primeros-pasos)
4. [⚛️ Uso con React](#️-uso-con-react)
5. [🧪 Testing](#-testing)
6. [🔧 Configuración Avanzada](#-configuración-avanzada)
7. [❓ Troubleshooting](#-troubleshooting)

---

## 🎯 ¿Qué es SecureSharkInputs?

SecureSharkInputs es una librería **súper simple** que protege automáticamente todos los inputs de tu aplicación contra:

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
<ValidationShark 
  name="email"
  type="email"
  label="Email"
  required={true}
/>
// Bloquea automáticamente cualquier intento de ataque
```

---

## 📦 Instalación

### Paso 1: Instalar la librería

```bash
npm install securesharkinputs
```

**✨ ¡Templates se instalan automáticamente!**

### Paso 2: Verificar la instalación

```bash
# Test básico
node node_modules/securesharkinputs/scripts/test-client.js
```

---

## 🚀 Primeros Pasos

### Paso 1: Usar el template automático

Cuando instalas la librería, se crea automáticamente un template en:
```
src/components/SecureSharkForm.tsx
```

### Paso 2: Importar y usar

```jsx
import SecureSharkForm from './components/SecureSharkForm';

function App() {
  return <SecureSharkForm />;
}
```

### Paso 3: Personalizar

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

---

## ⚛️ Uso con React

### 🎯 Componente ValidationShark

El componente `ValidationShark` es **todo en uno**:

```jsx
<ValidationShark 
  name="email"           // ✅ Nombre del campo (requerido)
  type="email"           // ✅ Tipo de input
  label="Email"          // ✅ Etiqueta
  placeholder="Email"     // ✅ Placeholder
  required={true}        // ✅ Campo obligatorio
  onValid={() => {}}     // ✅ Callback cuando es válido
  onInvalid={() => {}}   // ✅ Callback cuando detecta amenazas
/>
```

### 🎯 Props Disponibles

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `name` | string | ✅ | Nombre del campo para react-hook-form |
| `type` | string | ❌ | Tipo de input (text, email, password, etc.) |
| `label` | string | ❌ | Texto de la etiqueta |
| `placeholder` | string | ❌ | Texto del placeholder |
| `required` | boolean | ❌ | Si el campo es obligatorio |
| `className` | string | ❌ | Clases CSS adicionales |
| `onValid` | function | ❌ | Callback cuando input es válido |
| `onInvalid` | function | ❌ | Callback cuando detecta amenazas |

### 🎯 Ejemplos de Uso

#### Campo de texto básico:
```jsx
<ValidationShark 
  name="name"
  type="text"
  label="Name"
  placeholder="Enter your name"
/>
```

#### Campo de email obligatorio:
```jsx
<ValidationShark 
  name="email"
  type="email"
  label="Email"
  placeholder="Enter your email"
  required={true}
/>
```

#### Campo con callbacks:
```jsx
<ValidationShark 
  name="message"
  type="text"
  label="Message"
  placeholder="Enter your message"
  onValid={() => console.log('✅ Input válido')}
  onInvalid={() => console.log('❌ Amenaza detectada')}
/>
```

---

## 🧪 Testing

### 🎯 Tests Incluidos

La librería incluye 3 herramientas de testing:

#### 1. Test Básico
```bash
node node_modules/securesharkinputs/scripts/test-client.js
```
**Verifica:**
- ✅ Instalación correcta
- ✅ Componentes disponibles
- ✅ Validación básica

#### 2. Test de Integración
```bash
node node_modules/securesharkinputs/scripts/test-integration.js
```
**Verifica:**
- ✅ Todas las funcionalidades
- ✅ Instalación de templates
- ✅ Validación de seguridad

#### 3. Test de Conexión
```bash
node node_modules/securesharkinputs/scripts/test-connection.js
```
**Verifica:**
- ✅ Protección real de inputs
- ✅ Detección de amenazas
- ✅ Bloqueo de formularios

### 🎯 Agregar Scripts al package.json

```json
{
  "scripts": {
    "test:shark": "node node_modules/securesharkinputs/scripts/test-client.js",
    "test:shark-integration": "node node_modules/securesharkinputs/scripts/test-integration.js",
    "test:shark-connection": "node node_modules/securesharkinputs/scripts/test-connection.js"
  }
}
```

### 🎯 Ejemplo de Output

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

---

## 🔧 Configuración Avanzada

### 🎯 Callbacks Personalizados

```jsx
const handleValidInput = (inputId) => {
  console.log(`✅ Input "${inputId}" es válido`);
};

const handleInvalidInput = (inputId) => {
  console.log(`❌ Input "${inputId}" contiene amenazas`);
};

<ValidationShark 
  name="email"
  onValid={() => handleValidInput('email')}
  onInvalid={() => handleInvalidInput('email')}
/>
```

### 🎯 Estilos Personalizados

```jsx
<ValidationShark 
  name="email"
  className="custom-input-class"
  style={{ borderColor: 'red' }}
/>
```

### 🎯 Validación de Campos Obligatorios

```jsx
<ValidationShark 
  name="name"
  label="Name"
  required={true}  // ← Agrega validación automática
/>
```

**El componente automáticamente:**
- ✅ Muestra asterisco (*) en el label
- ✅ Previene envío si está vacío
- ✅ Muestra mensaje de error
- ✅ Integra con react-hook-form

---

## ❓ Troubleshooting

### 🚨 Problema: No se instala el template

**Solución:**
```bash
# Instalación manual
node node_modules/securesharkinputs/scripts/manual-install.js
```

### 🚨 Problema: Componente no funciona

**Verificar:**
1. ✅ React instalado: `npm list react`
2. ✅ react-hook-form instalado: `npm list react-hook-form`
3. ✅ Import correcto: `import ValidationShark from 'securesharkinputs'`

### 🚨 Problema: No detecta amenazas

**Verificar:**
1. ✅ Abrir consola del navegador (F12)
2. ✅ Buscar logs de validación
3. ✅ Probar con contenido malicioso:
   - `<script>alert('xss')</script>`
   - `'; DROP TABLE users; --`

### 🚨 Problema: Formulario no se bloquea

**Verificar:**
1. ✅ Botón con `type="submit"`
2. ✅ Formulario con `onSubmit={handleSubmit(onSubmit)}`
3. ✅ ValidationShark dentro del formulario

### 🚨 Problema: Errores de TypeScript

**Solución:**
```bash
# Reinstalar dependencias
npm install
npm run build
```

---

## 📦 Información del Paquete

- **Library Size**: 131.11 KB (código compilado)
- **Package Size**: 61.5 KB (comprimido para npm)
- **Unpacked Size**: 269.3 KB (incluye dependencias)
- **Dependencies**: react-hook-form, react, typescript, yup (incluidas)
- **TypeScript**: Soporte completo
- **React**: 18+ compatible

### **Desglose de Tamaño:**
- **useSchema.js**: 40.02 KB (motor de validación)
- **secureSharkBackend.js**: 11.02 KB (protección backend)
- **enterpriseValidator.js**: 9.41 KB (servicios enterprise)
- **ValidationShark.js**: 6.96 KB (componente React)
- **index.js**: 2.01 KB (punto de entrada)

---

## 🎯 ¿Por qué Elegir SecureSharkInputs?

### **Súper Simple**
- Un componente hace todo
- Sin configuración compleja
- Integración automática con react-hook-form

### **Seguridad Enterprise**
- Detección multi-capa de amenazas
- Validación en tiempo real
- Bloqueo automático de formularios

### **Developer Friendly**
- Soporte TypeScript
- Instalación automática de templates
- Documentación completa
- Herramientas de testing incluidas

### **Production Ready**
- Ligera (131.11 KB código de librería)
- Incluye todas las dependencias
- Algoritmos de seguridad probados

---

**¡Listo para usar! 🚀** 