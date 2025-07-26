/**
 * 🛡️ SecureSharkInputs - Ejemplo Backend Súper Simple
 * 
 * Copia y pega este archivo y ejecuta:
 * node backend-example.js
 * 
 * Luego prueba con curl:
 * curl -X POST http://localhost:3001/api/test -H "Content-Type: application/json" -d '{"input":"<script>alert(\"xss\")</script>"}'
 */

const express = require('express');
const { createBackendValidator } = require('securesharkinputs');

const app = express();
app.use(express.json());

// Crear validador
const validator = createBackendValidator({
  enableSanitization: true,
  logThreats: true
});

// Ruta de prueba
app.post('/api/test', async (req, res) => {
  const { validateInput } = require('securesharkinputs/backend');
  
  const input = req.body.input || '';
  const result = await validateInput(input);
  
  console.log(`🔍 Validando: "${input}"`);
  console.log(`   Resultado: ${result.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  if (!result.isValid) {
    console.log(`   Amenazas: ${result.threats.join(', ')}`);
    console.log(`   Severidad: ${result.severity}`);
  }
  console.log('');
  
  res.json({
    input: input,
    isValid: result.isValid,
    threats: result.threats,
    severity: result.severity,
    message: result.isValid ? 'Input seguro' : 'Amenaza detectada'
  });
});

// Ruta protegida con middleware
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

// Ruta de información
app.get('/', (req, res) => {
  res.json({
    message: '🛡️ SecureSharkInputs Backend Example',
    endpoints: {
      '/api/test': 'POST - Probar validación manual',
      '/api/contact': 'POST - Formulario protegido con middleware'
    },
    examples: {
      'Input normal': 'curl -X POST http://localhost:3001/api/test -H "Content-Type: application/json" -d \'{"input":"Hola mundo"}\'',
      'Ataque XSS': 'curl -X POST http://localhost:3001/api/test -H "Content-Type: application/json" -d \'{"input":"<script>alert(\\"xss\\")</script>"}\'',
      'Inyección SQL': 'curl -X POST http://localhost:3001/api/test -H "Content-Type: application/json" -d \'{"input":"SELECT * FROM users"}\''
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('🛡️ SecureSharkInputs Backend Example');
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('');
  console.log('📝 Pruebas rápidas:');
  console.log('');
  console.log('# Input normal:');
  console.log('curl -X POST http://localhost:3001/api/test \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"input":"Hola mundo"}\'');
  console.log('');
  console.log('# Ataque XSS:');
  console.log('curl -X POST http://localhost:3001/api/test \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"input":"<script>alert(\\"xss\\")</script>"}\'');
  console.log('');
  console.log('# Inyección SQL:');
  console.log('curl -X POST http://localhost:3001/api/test \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"input":"SELECT * FROM users"}\'');
  console.log('');
  console.log('📖 Para más información: https://github.com/tu-usuario/securesharkinputs');
}); 