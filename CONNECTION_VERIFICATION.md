# 🔗 Connection Verification Guide

## 🎯 ¿Qué es la Verificación de Conexión?

La verificación de conexión te permite **confirmar que SecureSharkInputs está realmente protegiendo** los inputs de tu aplicación. No solo verifica que esté instalado, sino que **funcione en la práctica**.

---

## 🚀 Verificación Rápida

### Paso 1: Ejecutar el Test de Conexión

```bash
node node_modules/securesharkinputs/scripts/test-connection.js
```

### Paso 2: Revisar el Reporte

El script generará un reporte como este:

```bash
🔍 SECURESHARKINPUTS CONNECTION VERIFICATION v1.6.4
====================================================

📊 ANALYSIS RESULTS:
✅ Library installed correctly
✅ ValidationShark component found
✅ Template files present
✅ Security validation active

📁 PROJECT ANALYSIS:
Total files scanned: 15
Files with SecureShark imports: 3
React Hook Form usage: ✅ Found
Template usage: ✅ Found
Protection coverage: 100%

📋 DETAILED BREAKDOWN:
✅ src/components/SecureSharkForm.tsx - Template found
✅ src/pages/ContactForm.tsx - ValidationShark used
✅ src/components/LoginForm.tsx - ValidationShark used

🎯 RECOMMENDATIONS:
✅ All inputs are properly protected
✅ Security validation is active
✅ Form blocking is configured
```

---

## 🧪 Testing Manual

### Paso 1: Abrir tu Aplicación

1. Inicia tu aplicación: `npm run dev`
2. Abre el navegador
3. Ve a la página con el formulario

### Paso 2: Abrir Consola del Navegador

1. Presiona `F12` o `Ctrl+Shift+I`
2. Ve a la pestaña "Console"

### Paso 3: Probar Validación

#### Test 1: Contenido Normal
```
Escribe en un input: "Hola mundo"
✅ Deberías ver: "✅ Input is valid: 'Hola mundo'"
```

#### Test 2: Ataque XSS
```
Escribe en un input: <script>alert('xss')</script>
❌ Deberías ver: "❌ Input contains malicious content"
❌ Deberías ver: "🚨 Form submission will be blocked!"
```

#### Test 3: Inyección SQL
```
Escribe en un input: '; DROP TABLE users; --
❌ Deberías ver: "❌ Input contains malicious content"
```

### Paso 4: Verificar Bloqueo de Formulario

1. Escribe contenido malicioso en un input
2. Intenta enviar el formulario
3. **El formulario NO debe enviarse**
4. Deberías ver un mensaje de error

---

## 🔧 Configuración Avanzada

### Agregar Scripts al package.json

```json
{
  "scripts": {
    "verify:shark": "node node_modules/securesharkinputs/scripts/test-connection.js",
    "test:shark": "node node_modules/securesharkinputs/scripts/test-client.js",
    "test:shark-integration": "node node_modules/securesharkinputs/scripts/test-integration.js"
  }
}
```

### Ejecutar Tests

```bash
# Verificación de conexión
npm run verify:shark

# Test básico
npm run test:shark

# Test de integración
npm run test:shark-integration
```

---

## 🚨 Troubleshooting

### Problema: "Library not found"

**Solución:**
```bash
# Reinstalar la librería
npm uninstall securesharkinputs
npm install securesharkinputs

# Verificar instalación
npm list securesharkinputs
```

### Problema: "No ValidationShark components found"

**Solución:**
1. Verificar que estés usando el componente correcto:
```jsx
// ✅ CORRECTO
import ValidationShark from 'securesharkinputs';

<ValidationShark 
  name="email"
  type="email"
  label="Email"
/>
```

2. Verificar que el archivo esté guardado
3. Reiniciar el servidor de desarrollo

### Problema: "No protection detected"

**Solución:**
1. Verificar que el componente esté dentro de un formulario:
```jsx
// ✅ CORRECTO
<form onSubmit={handleSubmit(onSubmit)}>
  <ValidationShark name="email" />
  <button type="submit">Submit</button>
</form>
```

2. Verificar que react-hook-form esté configurado:
```jsx
// ✅ CORRECTO
import { useForm } from 'react-hook-form';

const { handleSubmit } = useForm();
```

### Problema: "Template not found"

**Solución:**
```bash
# Instalación manual del template
node node_modules/securesharkinputs/scripts/manual-install.js
```

---

## 📊 Interpretación de Resultados

### ✅ Todo Bien
```
✅ Library installed correctly
✅ ValidationShark component found
✅ Security validation active
Protection coverage: 100%
```
**Significado:** Tu aplicación está completamente protegida.

### ⚠️ Parcialmente Protegido
```
✅ Library installed correctly
⚠️ Found 2 unprotected inputs
Protection coverage: 67%
```
**Significado:** Algunos inputs no están protegidos. Revisa los inputs sin `ValidationShark`.

### ❌ No Protegido
```
✅ Library installed correctly
❌ No ValidationShark components found
Protection coverage: 0%
```
**Significado:** La librería está instalada pero no se está usando. Agrega componentes `ValidationShark`.

---

## 🎯 Mejores Prácticas

### ✅ Uso Correcto

```jsx
// ✅ Formulario completo protegido
import { useForm } from 'react-hook-form';
import ValidationShark from 'securesharkinputs';

const MyForm = () => {
  const { handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ValidationShark 
        name="name"
        type="text"
        label="Name"
        required={true}
      />
      
      <ValidationShark 
        name="email"
        type="email"
        label="Email"
        required={true}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

### ❌ Uso Incorrecto

```jsx
// ❌ Sin ValidationShark
<input type="text" name="name" />

// ❌ ValidationShark fuera del formulario
<ValidationShark name="email" />
<form>...</form>

// ❌ Sin react-hook-form
<form onSubmit={onSubmit}>
  <ValidationShark name="email" />
</form>
```

---

## 🔄 Verificación Continua

### Para CI/CD

Agrega a tu pipeline:

```yaml
# .github/workflows/security-check.yml
- name: Verify SecureShark Protection
  run: node node_modules/securesharkinputs/scripts/test-connection.js
```

### Para Pre-commit

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "node node_modules/securesharkinputs/scripts/test-connection.js"
    }
  }
}
```

---

## 📞 Soporte

Si tienes problemas:

1. **Ejecuta el test de conexión** y comparte el output
2. **Revisa la consola del navegador** para errores
3. **Verifica la instalación**: `npm list securesharkinputs`
4. **Consulta la documentación**: [README.md](README.md)

---

**¡Tu aplicación está segura! 🛡️** 