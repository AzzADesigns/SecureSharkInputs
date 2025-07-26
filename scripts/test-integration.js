#!/usr/bin/env node

/**
 * Script de pruebas de integración para SecureSharkInputs
 * Este script verifica que la librería funciona correctamente en el proyecto destino
 */

const fs = require('fs');
const path = require('path');

console.log('🦈 SecureSharkInputs - Pruebas de Integración');
console.log('==============================================\n');

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

// Verificar que la librería está instalada
function checkLibraryInstallation() {
  log.title('1. Verificando instalación de la librería...');
  
  try {
    // Intentar importar la librería
    const securesharkinputs = require('securesharkinputs');
    
    if (securesharkinputs) {
      log.success('Librería encontrada y cargada correctamente');
      return true;
    } else {
      log.error('Librería no se pudo cargar');
      return false;
    }
  } catch (error) {
    log.error(`Error al cargar la librería: ${error.message}`);
    log.info('Asegúrate de haber instalado la librería con: npm install securesharkinputs');
    return false;
  }
}

// Verificar que los componentes principales están disponibles
function checkMainComponents() {
  log.title('2. Verificando componentes principales...');
  
  try {
    const securesharkinputs = require('securesharkinputs');
    
    const requiredExports = [
      'ValidationShark',
      'SimpleValidationShark', 
      'useSharkValidation',
      'createEnterpriseValidator'
    ];
    
    let allComponentsFound = true;
    
    requiredExports.forEach(exportName => {
      if (securesharkinputs[exportName]) {
        log.success(`${exportName} disponible`);
      } else {
        log.error(`${exportName} no encontrado`);
        allComponentsFound = false;
      }
    });
    
    return allComponentsFound;
  } catch (error) {
    log.error(`Error al verificar componentes: ${error.message}`);
    return false;
  }
}

// Probar validación básica
function testBasicValidation() {
  log.title('3. Probando validación básica...');
  
  try {
    const { createEnterpriseValidator } = require('securesharkinputs');
    
    const validator = createEnterpriseValidator({
      enableExternalValidation: false,
      enableLogging: false,
      maxInputLength: 1000
    });
    
    // Test 1: Input seguro
    const safeResult = validator.validate('Hello world');
    if (safeResult && typeof safeResult.then === 'function') {
      log.success('Validación asíncrona funcionando');
    } else {
      log.error('Validación no es asíncrona como se esperaba');
      return false;
    }
    
    return true;
  } catch (error) {
    log.error(`Error en validación básica: ${error.message}`);
    return false;
  }
}

// Probar detección de amenazas
async function testThreatDetection() {
  log.title('4. Probando detección de amenazas...');
  
  try {
    const { createEnterpriseValidator } = require('securesharkinputs');
    
    const validator = createEnterpriseValidator({
      enableExternalValidation: false,
      enableLogging: false
    });
    
    const testCases = [
      {
        input: '<script>alert("xss")</script>',
        name: 'XSS Attack',
        shouldBeBlocked: true
      },
      {
        input: 'SELECT * FROM users',
        name: 'SQL Injection',
        shouldBeBlocked: true
      },
      {
        input: 'document.cookie',
        name: 'Data Theft',
        shouldBeBlocked: true
      },
      {
        input: 'puta',
        name: 'Inappropriate Content',
        shouldBeBlocked: true
      },
      {
        input: 'Hello world',
        name: 'Safe Input',
        shouldBeBlocked: false
      }
    ];
    
    let allTestsPassed = true;
    
    for (const testCase of testCases) {
      try {
        const result = await validator.validate(testCase.input);
        
        if (result.isValid === !testCase.shouldBeBlocked) {
          log.success(`${testCase.name}: ${result.isValid ? 'Permitido' : 'Bloqueado'}`);
        } else {
          log.error(`${testCase.name}: Esperado ${testCase.shouldBeBlocked ? 'bloqueado' : 'permitido'}, pero fue ${result.isValid ? 'permitido' : 'bloqueado'}`);
          allTestsPassed = false;
        }
      } catch (error) {
        log.error(`${testCase.name}: Error - ${error.message}`);
        allTestsPassed = false;
      }
    }
    
    return allTestsPassed;
  } catch (error) {
    log.error(`Error en detección de amenazas: ${error.message}`);
    return false;
  }
}

// Verificar configuración de TypeScript
function checkTypeScriptSupport() {
  log.title('5. Verificando soporte de TypeScript...');
  
  try {
    // Verificar si hay archivos de definición de tipos
    const packageJson = require('securesharkinputs/package.json');
    
    if (packageJson.types || packageJson.typings) {
      log.success('Archivos de tipos TypeScript disponibles');
      return true;
    } else {
      log.warning('No se encontraron archivos de tipos TypeScript');
      return false;
    }
  } catch (error) {
    log.error(`Error al verificar TypeScript: ${error.message}`);
    return false;
  }
}

// Verificar que React está disponible (si es necesario)
function checkReactSupport() {
  log.title('6. Verificando soporte de React...');
  
  try {
    // Intentar cargar React
    const React = require('react');
    
    if (React) {
      log.success('React disponible para componentes');
      return true;
    } else {
      log.warning('React no está disponible');
      return false;
    }
  } catch (error) {
    log.warning('React no está instalado (solo necesario para componentes)');
    return false;
  }
}

// Función principal
async function runIntegrationTests() {
  console.log('🚀 Iniciando pruebas de integración...\n');
  
  const results = {
    installation: checkLibraryInstallation(),
    components: checkMainComponents(),
    basicValidation: testBasicValidation(),
    threatDetection: await testThreatDetection(),
    typescript: checkTypeScriptSupport(),
    react: checkReactSupport()
  };
  
  // Resumen de resultados
  log.title('📊 Resumen de Pruebas');
  console.log('========================');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASÓ' : '❌ FALLÓ';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} ${testName}`);
  });
  
  console.log(`\n${colors.bold}Resultado: ${passed}/${total} pruebas pasaron${colors.reset}`);
  
  if (passed === total) {
    log.success('¡Todas las pruebas pasaron! La librería está funcionando correctamente.');
    process.exit(0);
  } else {
    log.error('Algunas pruebas fallaron. Revisa los errores arriba.');
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runIntegrationTests().catch(error => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  runIntegrationTests,
  checkLibraryInstallation,
  checkMainComponents,
  testBasicValidation,
  testThreatDetection,
  checkTypeScriptSupport,
  checkReactSupport
}; 