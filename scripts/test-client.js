#!/usr/bin/env node

/**
 * Script de pruebas para el cliente (proyecto destino)
 * Este script se puede ejecutar en cualquier proyecto que use SecureSharkInputs
 * 
 * Uso: node node_modules/securesharkinputs/scripts/test-client.js
 */

console.log('🦈 SecureSharkInputs - Pruebas del Cliente');
console.log('===========================================\n');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bold}${msg}${colors.reset}`)
};

// Función para probar la API básica
async function testBasicAPI() {
  log.title('1. Probando API Básica');
  
  try {
    const { createEnterpriseValidator } = require('securesharkinputs');
    
    const validator = createEnterpriseValidator({
      enableExternalValidation: false,
      enableLogging: false
    });
    
    // Test input seguro
    const safeResult = await validator.validate('Hello world');
    if (safeResult.isValid) {
      log.success('Input seguro validado correctamente');
    } else {
      log.error('Input seguro fue rechazado incorrectamente');
      return false;
    }
    
    // Test input malicioso
    const maliciousResult = await validator.validate('<script>alert("xss")</script>');
    if (!maliciousResult.isValid) {
      log.success('Input malicioso bloqueado correctamente');
    } else {
      log.error('Input malicioso fue permitido incorrectamente');
      return false;
    }
    
    return true;
  } catch (error) {
    log.error(`Error en API básica: ${error.message}`);
    return false;
  }
}

// Función para probar el hook
async function testHook() {
  log.title('2. Probando Hook useSharkValidation');
  
  try {
    const { useSharkValidation } = require('securesharkinputs');
    
    // Simular el hook (sin React)
    const { validate, validateSync, validateForm } = useSharkValidation();
    
    // Test validación asíncrona
    const asyncResult = await validate('Hello world');
    if (asyncResult.isValid) {
      log.success('Hook validate funcionando');
    } else {
      log.error('Hook validate falló');
      return false;
    }
    
    // Test validación síncrona
    const syncResult = validateSync('Hello world');
    if (syncResult.isValid) {
      log.success('Hook validateSync funcionando');
    } else {
      log.error('Hook validateSync falló');
      return false;
    }
    
    // Test validación de formulario
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello world'
    };
    
    const formResult = await validateForm(formData);
    if (formResult.isValid) {
      log.success('Hook validateForm funcionando');
    } else {
      log.error('Hook validateForm falló');
      return false;
    }
    
    return true;
  } catch (error) {
    log.error(`Error en hook: ${error.message}`);
    return false;
  }
}

// Función para probar detección de amenazas
async function testThreatDetection() {
  log.title('3. Probando Detección de Amenazas');
  
  try {
    const { createEnterpriseValidator } = require('securesharkinputs');
    
    const validator = createEnterpriseValidator({
      enableExternalValidation: false,
      enableLogging: false
    });
    
    const threats = [
      { input: '<script>alert("xss")</script>', name: 'XSS' },
      { input: 'SELECT * FROM users', name: 'SQL Injection' },
      { input: 'document.cookie', name: 'Data Theft' },
      { input: 'puta', name: 'Inappropriate Content' },
      { input: 'javascript:alert("xss")', name: 'JavaScript Protocol' },
      { input: '1=1 OR 1=1', name: 'SQL Logic' },
      { input: 'localStorage.getItem', name: 'LocalStorage Access' }
    ];
    
    let allThreatsBlocked = true;
    
    for (const threat of threats) {
      const result = await validator.validate(threat.input);
      
      if (!result.isValid) {
        log.success(`${threat.name}: Bloqueado correctamente`);
      } else {
        log.error(`${threat.name}: No fue bloqueado`);
        allThreatsBlocked = false;
      }
    }
    
    return allThreatsBlocked;
  } catch (error) {
    log.error(`Error en detección de amenazas: ${error.message}`);
    return false;
  }
}

// Función para probar configuración personalizada
async function testCustomConfig() {
  log.title('4. Probando Configuración Personalizada');
  
  try {
    const { createEnterpriseValidator } = require('securesharkinputs');
    
    // Test con límite de longitud personalizado
    const validator = createEnterpriseValidator({
      maxInputLength: 10,
      enableLogging: false
    });
    
    const longInput = 'This is a very long input that should be rejected';
    const result = await validator.validate(longInput);
    
    if (!result.isValid && result.reason === 'input_too_long') {
      log.success('Configuración de longitud máxima funcionando');
    } else {
      log.error('Configuración de longitud máxima no funcionó');
      return false;
    }
    
    return true;
  } catch (error) {
    log.error(`Error en configuración personalizada: ${error.message}`);
    return false;
  }
}

// Función para verificar tipos de TypeScript
function checkTypeScriptSupport() {
  log.title('5. Verificando Soporte de TypeScript');
  
  try {
    // Intentar importar con tipos
    const securesharkinputs = require('securesharkinputs');
    
    // Verificar que las funciones tienen los tipos correctos
    if (typeof securesharkinputs.createEnterpriseValidator === 'function') {
      log.success('createEnterpriseValidator disponible');
    } else {
      log.error('createEnterpriseValidator no disponible');
      return false;
    }
    
    if (typeof securesharkinputs.useSharkValidation === 'function') {
      log.success('useSharkValidation disponible');
    } else {
      log.error('useSharkValidation no disponible');
      return false;
    }
    
    return true;
  } catch (error) {
    log.error(`Error al verificar TypeScript: ${error.message}`);
    return false;
  }
}

// Función principal
async function runClientTests() {
  console.log('🚀 Iniciando pruebas del cliente...\n');
  
  const results = {
    basicAPI: await testBasicAPI(),
    hook: await testHook(),
    threatDetection: await testThreatDetection(),
    customConfig: await testCustomConfig(),
    typescript: checkTypeScriptSupport()
  };
  
  // Resumen de resultados
  log.title('📊 Resumen de Pruebas del Cliente');
  console.log('==================================');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASÓ' : '❌ FALLÓ';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} ${testName}`);
  });
  
  console.log(`\n${colors.bold}Resultado: ${passed}/${total} pruebas pasaron${colors.reset}`);
  
  if (passed === total) {
    log.success('¡Todas las pruebas pasaron! SecureSharkInputs está funcionando correctamente en tu proyecto.');
    console.log('\n🎉 Puedes usar la librería con confianza:');
    console.log('   - <ValidationShark /> para componentes React');
    console.log('   - useSharkValidation() para validación programática');
    console.log('   - createEnterpriseValidator() para configuración avanzada');
    process.exit(0);
  } else {
    log.error('Algunas pruebas fallaron. Revisa los errores arriba.');
    console.log('\n💡 Sugerencias:');
    console.log('   - Asegúrate de que la librería esté instalada correctamente');
    console.log('   - Verifica que no haya conflictos de versiones');
    console.log('   - Revisa la documentación en: https://github.com/AzzADesigns/SecureSharkInputs');
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runClientTests().catch(error => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  runClientTests,
  testBasicAPI,
  testHook,
  testThreatDetection,
  testCustomConfig,
  checkTypeScriptSupport
}; 