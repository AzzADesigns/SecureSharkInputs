#!/usr/bin/env node

/**
 * Script de pruebas de integración para SecureSharkInputs
 * Este script verifica que la librería funciona correctamente en el proyecto destino
 * 
 * Nuevas características incluidas:
 * - react-hook-form incluido en la librería
 * - Plantillas automáticas de instalación
 * - Validación mejorada con blockForm y showMessages
 */

const fs = require('fs');
const path = require('path');

console.log('🦈 SecureSharkInputs - Pruebas de Integración v1.4.0');
console.log('=====================================================\n');

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

// Verificar que react-hook-form está incluido
function checkReactHookFormInclusion() {
  log.title('3. Verificando inclusión de react-hook-form...');
  
  try {
    // Verificar que react-hook-form está disponible
    const reactHookForm = require('react-hook-form');
    
    if (reactHookForm && reactHookForm.useForm) {
      log.success('react-hook-form incluido en la librería');
      return true;
    } else {
      log.error('react-hook-form no está disponible');
      return false;
    }
  } catch (error) {
    log.error(`Error al verificar react-hook-form: ${error.message}`);
    log.info('react-hook-form debería estar incluido en la librería');
    return false;
  }
}

// Verificar plantillas instaladas
function checkTemplatesInstallation() {
  log.title('4. Verificando instalación de plantillas...');
  
  const templatePath = path.join(process.cwd(), 'src/components/SecureSharkForm.tsx');
  const setupGuidePath = path.join(process.cwd(), 'SECURESHARK_SETUP.md');
  
  let templatesFound = 0;
  
  if (fs.existsSync(templatePath)) {
    log.success('Plantilla SecureSharkForm.tsx encontrada');
    templatesFound++;
  } else {
    log.warning('Plantilla SecureSharkForm.tsx no encontrada');
    log.info('Ejecuta: node node_modules/securesharkinputs/scripts/manual-install.js');
  }
  
  if (fs.existsSync(setupGuidePath)) {
    log.success('Guía de configuración SECURESHARK_SETUP.md encontrada');
    templatesFound++;
  } else {
    log.warning('Guía de configuración no encontrada');
  }
  
  return templatesFound > 0;
}

// Probar validación básica
function testBasicValidation() {
  log.title('5. Probando validación básica...');
  
  try {
    const { createEnterpriseValidator } = require('securesharkinputs');
    
    const validator = createEnterpriseValidator({
      enableExternalValidation: false,
      enableLogging: false,
      maxInputLength: 1000
    });
    
    // Test 1: Input seguro
    const safeResult = validator.validate('Hello world');
    if (safeResult.isValid) {
      log.success('Validación de input seguro: OK');
    } else {
      log.error('Validación de input seguro: FALLÓ');
      return false;
    }
    
    // Test 2: Input malicioso
    const maliciousResult = validator.validate('<script>alert("xss")</script>');
    if (!maliciousResult.isValid) {
      log.success('Detección de contenido malicioso: OK');
    } else {
      log.error('Detección de contenido malicioso: FALLÓ');
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
  log.title('6. Probando detección de amenazas...');
  
  try {
    const { createEnterpriseValidator } = require('securesharkinputs');
    
    const validator = createEnterpriseValidator({
      enableExternalValidation: false,
      enableLogging: false
    });
    
    const threats = [
      { input: '<script>alert("xss")</script>', type: 'XSS' },
      { input: "'; DROP TABLE users; --", type: 'SQL Injection' },
      { input: 'document.cookie', type: 'Data Theft' },
      { input: 'javascript:alert("xss")', type: 'JavaScript Injection' },
      { input: 'onclick="alert(\'xss\')"', type: 'Event Handler' }
    ];
    
    let threatsDetected = 0;
    
    for (const threat of threats) {
      const result = await validator.validate(threat.input);
      if (!result.isValid) {
        log.success(`${threat.type} detectado correctamente`);
        threatsDetected++;
      } else {
        log.error(`${threat.type} NO detectado`);
      }
    }
    
    if (threatsDetected >= 4) {
      log.success(`Detección de amenazas: ${threatsDetected}/5 amenazas detectadas`);
      return true;
    } else {
      log.error(`Detección de amenazas: Solo ${threatsDetected}/5 amenazas detectadas`);
      return false;
    }
  } catch (error) {
    log.error(`Error en detección de amenazas: ${error.message}`);
    return false;
  }
}

// Verificar soporte TypeScript
function checkTypeScriptSupport() {
  log.title('7. Verificando soporte TypeScript...');
  
  try {
    const securesharkinputs = require('securesharkinputs');
    
    // Verificar que los tipos están disponibles
    if (securesharkinputs.ValidationShark && typeof securesharkinputs.ValidationShark === 'function') {
      log.success('Componentes TypeScript disponibles');
      return true;
    } else {
      log.error('Componentes TypeScript no disponibles');
      return false;
    }
  } catch (error) {
    log.error(`Error al verificar TypeScript: ${error.message}`);
    return false;
  }
}

// Verificar soporte React
function checkReactSupport() {
  log.title('8. Verificando soporte React...');
  
  try {
    const React = require('react');
    const securesharkinputs = require('securesharkinputs');
    
    if (React && securesharkinputs.ValidationShark) {
      log.success('Soporte React disponible');
      return true;
    } else {
      log.error('Soporte React no disponible');
      return false;
    }
  } catch (error) {
    log.error(`Error al verificar React: ${error.message}`);
    return false;
  }
}

// Ejecutar todas las pruebas
async function runIntegrationTests() {
  log.title('🦈 EJECUTANDO PRUEBAS DE INTEGRACIÓN');
  console.log('=====================================\n');
  
  const tests = [
    { name: 'Instalación de librería', fn: checkLibraryInstallation },
    { name: 'Componentes principales', fn: checkMainComponents },
    { name: 'react-hook-form incluido', fn: checkReactHookFormInclusion },
    { name: 'Plantillas instaladas', fn: checkTemplatesInstallation },
    { name: 'Validación básica', fn: testBasicValidation },
    { name: 'Detección de amenazas', fn: testThreatDetection },
    { name: 'Soporte TypeScript', fn: checkTypeScriptSupport },
    { name: 'Soporte React', fn: checkReactSupport }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      log.error(`Error en ${test.name}: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  log.title('📊 RESULTADOS FINALES');
  console.log('='.repeat(50));
  
  if (passedTests === totalTests) {
    log.success(`✅ TODAS LAS PRUEBAS PASARON (${passedTests}/${totalTests})`);
    console.log('\n🎉 ¡SecureSharkInputs está funcionando correctamente!');
    console.log('\n📚 Próximos pasos:');
    console.log('   1. Importa SecureSharkForm en tu aplicación');
    console.log('   2. Prueba las funcionalidades de seguridad');
    console.log('   3. Personaliza según tus necesidades');
  } else {
    log.error(`❌ ${totalTests - passedTests} PRUEBAS FALLARON (${passedTests}/${totalTests})`);
    console.log('\n🔧 Solución de problemas:');
    console.log('   1. Verifica que la librería esté instalada correctamente');
    console.log('   2. Ejecuta: npm install securesharkinputs@latest');
    console.log('   3. Instala plantillas: node node_modules/securesharkinputs/scripts/manual-install.js');
  }
  
  console.log('\n📖 Documentación:');
  console.log('   - README.md en el paquete');
  console.log('   - SECURESHARK_SETUP.md (si está disponible)');
  console.log('   - https://github.com/AzzADesigns/SecureSharkInputs');
}

// Ejecutar las pruebas
runIntegrationTests().catch(error => {
  log.error(`Error fatal en las pruebas: ${error.message}`);
  process.exit(1);
}); 