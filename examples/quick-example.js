/**
 * 🛡️ SecureSharkInputs - Ejemplo Súper Simple
 * 
 * Copia y pega este archivo en tu proyecto y ejecuta:
 * node quick-example.js
 */

const { createLightweightValidator } = require('securesharkinputs');

console.log('🛡️ SecureSharkInputs - Test Rápido\n');

// Crear validador
const validator = createLightweightValidator();

// Función para probar
async function testRapido() {
  const tests = [
    {
      name: "Texto normal",
      input: "Hola mundo",
      expected: true
    },
    {
      name: "Ataque XSS",
      input: "<script>alert('xss')</script>",
      expected: false
    },
    {
      name: "Inyección SQL",
      input: "SELECT * FROM users",
      expected: false
    },
    {
      name: "Robo de datos",
      input: "document.cookie",
      expected: false
    },
    {
      name: "Texto muy largo",
      input: "A".repeat(2000),
      expected: false
    }
  ];

  console.log('🧪 Ejecutando pruebas...\n');

  for (const test of tests) {
    const result = await validator.validate(test.input);
    const status = result.isValid === test.expected ? '✅' : '❌';
    
    console.log(`${status} ${test.name}:`);
    console.log(`   Input: "${test.input.substring(0, 50)}${test.input.length > 50 ? '...' : ''}"`);
    console.log(`   Resultado: ${result.isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
    
    if (!result.isValid && result.threats.length > 0) {
      console.log(`   Amenazas detectadas: ${result.threats.join(', ')}`);
    }
    console.log('');
  }

  console.log('🎉 ¡Test completado!');
  console.log('📖 Para más información, visita: https://github.com/tu-usuario/securesharkinputs');
}

// Ejecutar test
testRapido().catch(console.error); 