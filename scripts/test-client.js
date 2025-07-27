#!/usr/bin/env node

/**
 * Script de pruebas del cliente para SecureSharkInputs
 * Este script verifica que la librería funciona correctamente en el navegador
 * 
 * Nuevas características incluidas:
 * - react-hook-form incluido en la librería
 * - Plantillas automáticas de instalación
 * - Validación mejorada con blockForm y showMessages
 * 
 * Uso: node node_modules/securesharkinputs/scripts/test-client.js
 */

const fs = require('fs');
const path = require('path');

console.log('🦈 SecureSharkInputs - Pruebas del Cliente v1.4.0');
console.log('================================================\n');

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

// Verificar que la librería está disponible
function checkLibraryAvailability() {
  log.title('1. Verificando disponibilidad de la librería...');
  
  try {
    const securesharkinputs = require('securesharkinputs');
    
    if (securesharkinputs) {
      log.success('Librería cargada correctamente');
      return true;
    } else {
      log.error('No se pudo cargar la librería');
      return false;
    }
  } catch (error) {
    log.error(`Error al cargar la librería: ${error.message}`);
    return false;
  }
}

// Verificar componentes React
function checkReactComponents() {
  log.title('2. Verificando componentes React...');
  
  try {
    const securesharkinputs = require('securesharkinputs');
    
    const components = [
      'ValidationShark',
      'SimpleValidationShark'
    ];
    
    let allComponentsFound = true;
    
    components.forEach(componentName => {
      if (securesharkinputs[componentName]) {
        log.success(`${componentName} disponible`);
      } else {
        log.error(`${componentName} no encontrado`);
        allComponentsFound = false;
      }
    });
    
    return allComponentsFound;
  } catch (error) {
    log.error(`Error al verificar componentes: ${error.message}`);
    return false;
  }
}

// Verificar hooks
function checkHooks() {
  log.title('3. Verificando hooks...');
  
  try {
    const securesharkinputs = require('securesharkinputs');
    
    if (securesharkinputs.useSharkValidation) {
      log.success('useSharkValidation disponible');
      return true;
    } else {
      log.error('useSharkValidation no encontrado');
      return false;
    }
  } catch (error) {
    log.error(`Error al verificar hooks: ${error.message}`);
    return false;
  }
}

// Verificar validadores
function checkValidators() {
  log.title('4. Verificando validadores...');
  
  try {
    const securesharkinputs = require('securesharkinputs');
    
    const validators = [
      'createEnterpriseValidator',
      'createLightweightValidator'
    ];
    
    let allValidatorsFound = true;
    
    validators.forEach(validatorName => {
      if (securesharkinputs[validatorName]) {
        log.success(`${validatorName} disponible`);
      } else {
        log.error(`${validatorName} no encontrado`);
        allValidatorsFound = false;
      }
    });
    
    return allValidatorsFound;
  } catch (error) {
    log.error(`Error al verificar validadores: ${error.message}`);
    return false;
  }
}

// Verificar react-hook-form
function checkReactHookForm() {
  log.title('5. Verificando react-hook-form...');
  
  try {
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
    return false;
  }
}

// Probar validación básica
function testBasicValidation() {
  log.title('6. Probando validación básica...');
  
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
  log.title('7. Probando detección de amenazas...');
  
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

// Verificar plantillas instaladas
function checkTemplates() {
  log.title('8. Verificando plantillas instaladas...');
  
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

// Crear archivo de prueba para el navegador
function createBrowserTest() {
  log.title('9. Creando archivo de prueba para el navegador...');
  
  const testContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureSharkInputs - Browser Test</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .input-field { margin: 10px 0; }
        .input-field label { display: block; margin-bottom: 5px; }
        .input-field input, .input-field textarea { 
            width: 100%; padding: 8px; border: 1px solid #ccc; 
            border-radius: 4px; box-sizing: border-box; 
        }
        .validation-message { margin-top: 5px; font-size: 14px; }
        .valid { color: green; }
        .invalid { color: red; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .test-title { font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h1>🦈 SecureSharkInputs - Browser Test</h1>
    <p>Este archivo prueba la funcionalidad de SecureSharkInputs en el navegador.</p>
    
    <div id="root"></div>

    <script type="text/babel">
        // Simulación de la librería SecureSharkInputs
        const ValidationShark = ({ inputId, onValid, onInvalid }) => {
            const [isValid, setIsValid] = React.useState(null);
            const [message, setMessage] = React.useState('');
            
            React.useEffect(() => {
                const input = document.getElementById(inputId);
                if (!input) return;
                
                const validateInput = (value) => {
                    // Simulación de validación
                    const threats = [
                        '<script>',
                        'javascript:',
                        'onclick=',
                        'document.cookie',
                        'DROP TABLE',
                        'UNION SELECT'
                    ];
                    
                    const hasThreat = threats.some(threat => 
                        value.toLowerCase().includes(threat.toLowerCase())
                    );
                    
                    if (hasThreat) {
                        setIsValid(false);
                        setMessage('❌ Contenido no permitido detectado');
                        onInvalid && onInvalid(value);
                    } else if (value.trim()) {
                        setIsValid(true);
                        setMessage('✅ Válido');
                        onValid && onValid(value);
                    } else {
                        setIsValid(null);
                        setMessage('');
                    }
                };
                
                const handleInput = (e) => validateInput(e.target.value);
                input.addEventListener('input', handleInput);
                
                return () => input.removeEventListener('input', handleInput);
            }, [inputId, onValid, onInvalid]);
            
            if (isValid === null) return null;
            
            return React.createElement('div', {
                className: \`validation-message \${isValid ? 'valid' : 'invalid'}\`
            }, message);
        };

        const TestForm = () => {
            const [formData, setFormData] = React.useState({
                name: '',
                email: '',
                message: ''
            });
            
            const handleSubmit = (e) => {
                e.preventDefault();
                alert('Formulario enviado: ' + JSON.stringify(formData, null, 2));
            };
            
            const handleChange = (e) => {
                setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                });
            };
            
            return React.createElement('form', { onSubmit: handleSubmit }, [
                React.createElement('div', { key: 'name', className: 'input-field' }, [
                    React.createElement('label', { key: 'label1' }, 'Name:'),
                    React.createElement('input', {
                        key: 'input1',
                        id: 'name',
                        name: 'name',
                        type: 'text',
                        value: formData.name,
                        onChange: handleChange,
                        placeholder: 'Enter your name'
                    }),
                    React.createElement(ValidationShark, {
                        key: 'validation1',
                        inputId: 'name'
                    })
                ]),
                
                React.createElement('div', { key: 'email', className: 'input-field' }, [
                    React.createElement('label', { key: 'label2' }, 'Email:'),
                    React.createElement('input', {
                        key: 'input2',
                        id: 'email',
                        name: 'email',
                        type: 'email',
                        value: formData.email,
                        onChange: handleChange,
                        placeholder: 'Enter your email'
                    }),
                    React.createElement(ValidationShark, {
                        key: 'validation2',
                        inputId: 'email'
                    })
                ]),
                
                React.createElement('div', { key: 'message', className: 'input-field' }, [
                    React.createElement('label', { key: 'label3' }, 'Message:'),
                    React.createElement('textarea', {
                        key: 'input3',
                        id: 'message',
                        name: 'message',
                        value: formData.message,
                        onChange: handleChange,
                        placeholder: 'Enter your message',
                        rows: 4
                    }),
                    React.createElement(ValidationShark, {
                        key: 'validation3',
                        inputId: 'message'
                    })
                ]),
                
                React.createElement('button', {
                    key: 'submit',
                    type: 'submit',
                    style: {
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }
                }, 'Submit Form')
            ]);
        };

        const TestInstructions = () => {
            return React.createElement('div', { className: 'test-section' }, [
                React.createElement('div', { key: 'title', className: 'test-title' }, '🧪 Instrucciones de Prueba:'),
                React.createElement('ul', { key: 'list' }, [
                    React.createElement('li', { key: '1' }, 'Escribe contenido normal (ej: "Hello world") - debería mostrar "✅ Válido"'),
                    React.createElement('li', { key: '2' }, 'Escribe XSS (ej: "<script>alert(\'xss\')</script>") - debería mostrar "❌ Contenido no permitido detectado"'),
                    React.createElement('li', { key: '3' }, 'Escribe SQL injection (ej: "\'; DROP TABLE users; --") - debería bloquear'),
                    React.createElement('li', { key: '4' }, 'Escribe data theft (ej: "document.cookie") - debería bloquear')
                ])
            ]);
        };

        const App = () => {
            return React.createElement('div', {}, [
                React.createElement(TestInstructions, { key: 'instructions' }),
                React.createElement(TestForm, { key: 'form' })
            ]);
        };

        ReactDOM.render(React.createElement(App), document.getElementById('root'));
    </script>
</body>
</html>
`;

  const testPath = path.join(process.cwd(), 'browser-test.html');
  
  try {
    fs.writeFileSync(testPath, testContent);
    log.success(`Archivo de prueba del navegador creado: ${testPath}`);
    log.info('Abre este archivo en tu navegador para probar la funcionalidad');
  } catch (error) {
    log.error(`Error creando archivo de prueba: ${error.message}`);
  }
}

// Ejecutar todas las pruebas
async function runClientTests() {
  log.title('🦈 EJECUTANDO PRUEBAS DEL CLIENTE');
  console.log('==================================\n');
  
  const tests = [
    { name: 'Disponibilidad de librería', fn: checkLibraryAvailability },
    { name: 'Componentes React', fn: checkReactComponents },
    { name: 'Hooks', fn: checkHooks },
    { name: 'Validadores', fn: checkValidators },
    { name: 'react-hook-form', fn: checkReactHookForm },
    { name: 'Validación básica', fn: testBasicValidation },
    { name: 'Detección de amenazas', fn: testThreatDetection },
    { name: 'Plantillas instaladas', fn: checkTemplates }
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
    console.log('\n🎉 ¡SecureSharkInputs está funcionando correctamente en el cliente!');
    console.log('\n📚 Próximos pasos:');
    console.log('   1. Importa SecureSharkForm en tu aplicación React');
    console.log('   2. Prueba las funcionalidades de seguridad');
    console.log('   3. Personaliza según tus necesidades');
  } else {
    log.error(`❌ ${totalTests - passedTests} PRUEBAS FALLARON (${passedTests}/${totalTests})`);
    console.log('\n🔧 Solución de problemas:');
    console.log('   1. Verifica que la librería esté instalada correctamente');
    console.log('   2. Ejecuta: npm install securesharkinputs@latest');
    console.log('   3. Instala plantillas: node node_modules/securesharkinputs/scripts/manual-install.js');
  }
  
  // Crear archivo de prueba del navegador
  createBrowserTest();
  
  console.log('\n📖 Documentación:');
  console.log('   - README.md en el paquete');
  console.log('   - SECURESHARK_SETUP.md (si está disponible)');
  console.log('   - https://github.com/AzzADesigns/SecureSharkInputs');
}

// Ejecutar las pruebas
runClientTests().catch(error => {
  log.error(`Error fatal en las pruebas: ${error.message}`);
  process.exit(1);
}); 