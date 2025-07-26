/**
 * Ejemplos de uso de SecureSharkInputs Backend
 * Protección de inputs en el servidor
 */

// Importar la versión backend
const { 
  createBackendValidator, 
  validateInput, 
  validateForm 
} = require('../dist/backend/secureSharkBackend');

// ============================================================================
// EJEMPLO 1: Uso Básico
// ============================================================================

async function basicUsage() {
  console.log('🦈 SecureSharkInputs Backend - Uso Básico');
  console.log('==========================================\n');

  // Validar un input individual
  const result1 = await validateInput('Hello world');
  console.log('✅ Input seguro:', result1.isValid);

  const result2 = await validateInput('<script>alert("xss")</script>');
  console.log('❌ Input malicioso:', result2.isValid);
  console.log('Amenazas detectadas:', result2.threats);

  // Validar un formulario completo
  const formData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: '<script>alert("xss")</script>'
  };

  const formResult = await validateForm(formData);
  console.log('\n📋 Validación de formulario:');
  console.log('Formulario válido:', formResult.isValid);
  console.log('Amenazas generales:', formResult.overallThreats);
}

// ============================================================================
// EJEMPLO 2: Express.js Middleware
// ============================================================================

const express = require('express');
const app = express();

function expressExample() {
  console.log('\n🚀 Express.js Middleware Example');
  console.log('================================\n');

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

  // Middleware para validar todo el body
  app.post('/api/user', 
    validator.createExpressMiddleware(),
    (req, res) => {
      res.json({ 
        success: true, 
        user: req.body 
      });
    }
  );

  console.log('✅ Express middleware configurado');
  console.log('POST /api/contact - Valida campo "message"');
  console.log('POST /api/user - Valida todo el body');
}

// ============================================================================
// EJEMPLO 3: Fastify Middleware
// ============================================================================

const fastify = require('fastify');

async function fastifyExample() {
  console.log('\n⚡ Fastify Middleware Example');
  console.log('=============================\n');

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

  console.log('✅ Fastify middleware configurado');
  console.log('POST /api/contact - Valida campo "message"');
  console.log('POST /api/user - Valida todo el body');
}

// ============================================================================
// EJEMPLO 4: Validación Manual en Rutas
// ============================================================================

async function manualValidationExample() {
  console.log('\n🔧 Validación Manual en Rutas');
  console.log('=============================\n');

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

  // Simular request de Express
  const mockRequest = {
    body: {
      name: 'John<script>alert("xss")</script>',
      email: 'JOHN@EXAMPLE.COM',
      message: '<script>alert("xss")</script>Hello world'
    }
  };

  console.log('📥 Request original:', mockRequest.body);

  // Validar cada campo individualmente
  for (const [fieldName, value] of Object.entries(mockRequest.body)) {
    const result = await validator.validateInput(value, fieldName);
    
    console.log(`\n🔍 Validando campo "${fieldName}":`);
    console.log('Valor original:', value);
    console.log('Es válido:', result.isValid);
    console.log('Amenazas:', result.threats);
    console.log('Severidad:', result.severity);
    
    if (result.sanitizedValue) {
      console.log('Valor sanitizado:', result.sanitizedValue);
      mockRequest.body[fieldName] = result.sanitizedValue;
    }
  }

  console.log('\n📤 Request después de sanitización:', mockRequest.body);
}

// ============================================================================
// EJEMPLO 5: Configuración Avanzada
// ============================================================================

async function advancedConfigurationExample() {
  console.log('\n⚙️ Configuración Avanzada');
  console.log('==========================\n');

  // Validador con configuración personalizada
  const validator = createBackendValidator({
    maxInputLength: 500,
    enableLogging: true,
    enableSanitization: true,
    logThreats: true,
    customSanitizers: {
      // Sanitizador para HTML
      html: (value) => value.replace(/<[^>]*>/g, ''),
      // Sanitizador para SQL
      sql: (value) => value.replace(/['";]/g, ''),
      // Sanitizador para URLs
      url: (value) => value.replace(/javascript:/gi, '')
    }
  });

  // Test con diferentes tipos de amenazas
  const testCases = [
    {
      name: 'XSS Attack',
      input: '<script>alert("xss")</script>Hello',
      field: 'comment'
    },
    {
      name: 'SQL Injection',
      input: "'; DROP TABLE users; --",
      field: 'search'
    },
    {
      name: 'Data Theft Attempt',
      input: 'document.cookie; localStorage.getItem("token")',
      field: 'message'
    },
    {
      name: 'Unicode Evasion',
      input: 'Hеllо wоrld', // Con caracteres Unicode similares
      field: 'name'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Test: ${testCase.name}`);
    console.log('Input:', testCase.input);
    
    const result = await validator.validateInput(testCase.input, testCase.field);
    
    console.log('Resultado:', {
      isValid: result.isValid,
      threats: result.threats,
      severity: result.severity,
      sanitizedValue: result.sanitizedValue
    });
  }
}

// ============================================================================
// EJEMPLO 6: Logging y Monitoreo
// ============================================================================

async function loggingExample() {
  console.log('\n📊 Logging y Monitoreo');
  console.log('=======================\n');

  // Validador con logging detallado
  const validator = createBackendValidator({
    enableLogging: true,
    logThreats: true,
    enableSanitization: true
  });

  // Simular múltiples requests
  const requests = [
    { user: 'user1', input: 'Hello world' },
    { user: 'user2', input: '<script>alert("xss")</script>' },
    { user: 'user3', input: 'SELECT * FROM users' },
    { user: 'user4', input: 'document.cookie' }
  ];

  for (const request of requests) {
    console.log(`\n👤 Usuario: ${request.user}`);
    console.log('Input:', request.input);
    
    const result = await validator.validateInput(request.input, 'message');
    
    if (!result.isValid) {
      console.log('🚨 AMENAZA DETECTADA:');
      console.log('  - Usuario:', request.user);
      console.log('  - Input:', request.input);
      console.log('  - Amenazas:', result.threats);
      console.log('  - Severidad:', result.severity);
      console.log('  - Timestamp:', new Date().toISOString());
    } else {
      console.log('✅ Input válido');
    }
  }
}

// ============================================================================
// EJECUTAR EJEMPLOS
// ============================================================================

async function runExamples() {
  try {
    await basicUsage();
    expressExample();
    await fastifyExample();
    await manualValidationExample();
    await advancedConfigurationExample();
    await loggingExample();
    
    console.log('\n🎉 ¡Todos los ejemplos ejecutados correctamente!');
    console.log('\n📚 Para usar en tu proyecto:');
    console.log('1. npm install securesharkinputs');
    console.log('2. Importa la versión backend');
    console.log('3. Usa los middlewares o validación manual');
    console.log('4. ¡Protege tus inputs en el servidor!');
    
  } catch (error) {
    console.error('❌ Error ejecutando ejemplos:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runExamples();
}

module.exports = {
  basicUsage,
  expressExample,
  fastifyExample,
  manualValidationExample,
  advancedConfigurationExample,
  loggingExample,
  runExamples
}; 