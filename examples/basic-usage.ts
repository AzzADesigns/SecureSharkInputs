// 📝 Ejemplo Básico de Uso - SecureSharkInputs
// Este archivo muestra cómo usar la librería paso a paso

import { createEnterpriseValidator, entryFormSchema, ValidationLogger } from 'securesharkinputs';

// ============================================================================
// 1. VALIDACIÓN SIMPLE
// ============================================================================

console.log('🔍 1. VALIDACIÓN SIMPLE');
console.log('========================');

// Crear validador básico
const validator = createEnterpriseValidator();

// Ejemplo 1: Texto normal (debería pasar)
async function validateNormalText() {
  const result = await validator.validate("Hola, ¿cómo estás?");
  console.log('✅ Texto normal:', result.isValid ? 'VÁLIDO' : 'INVÁLIDO');
  return result;
}

// Ejemplo 2: XSS attempt (debería fallar)
async function validateXSSAttempt() {
  const result = await validator.validate("<script>alert('xss')</script>");
  console.log('❌ XSS attempt:', result.isValid ? 'VÁLIDO' : 'INVÁLIDO');
  console.log('   Razón:', result.reason);
  return result;
}

// Ejemplo 3: SQL injection (debería fallar)
async function validateSQLInjection() {
  const result = await validator.validate("SELECT * FROM users");
  console.log('❌ SQL injection:', result.isValid ? 'VÁLIDO' : 'INVÁLIDO');
  console.log('   Razón:', result.reason);
  return result;
}

// Ejemplo 4: Contenido inapropiado (debería fallar)
async function validateInappropriateContent() {
  const result = await validator.validate("Este texto contiene puta");
  console.log('❌ Contenido inapropiado:', result.isValid ? 'VÁLIDO' : 'INVÁLIDO');
  console.log('   Razón:', result.reason);
  return result;
}

// ============================================================================
// 2. VALIDACIÓN DE FORMULARIOS
// ============================================================================

console.log('\n📋 2. VALIDACIÓN DE FORMULARIOS');
console.log('================================');

// Datos de formulario válidos
const validFormData = {
  email: "usuario@empresa.com",
  firstName: "Juan",
  lastName: "Pérez",
  age: 25,
  phone: "+1234567890",
  country: "México",
  role: "Desarrollador",
  linkedin: "https://linkedin.com/in/juanperez",
  expectations: "Quiero contribuir a proyectos innovadores y aprender nuevas tecnologías."
};

// Datos de formulario inválidos (con contenido malicioso)
const invalidFormData = {
  email: "usuario@empresa.com",
  firstName: "Juan",
  lastName: "Pérez",
  age: 25,
  phone: "+1234567890",
  country: "México",
  role: "Desarrollador",
  linkedin: "https://linkedin.com/in/juanperez",
  expectations: "Quiero contribuir a proyectos innovadores. <script>alert('xss')</script>"
};

async function validateForm(formData: any, description: string) {
  try {
    console.log(`\n📝 ${description}:`);
    const validatedData = await entryFormSchema.validate(formData);
    console.log('   ✅ Formulario VÁLIDO');
    console.log('   📊 Datos validados:', validatedData);
    return { success: true, data: validatedData };
  } catch (error: any) {
    console.log('   ❌ Formulario INVÁLIDO');
    console.log('   🚨 Error:', error.message);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// 3. CONFIGURACIÓN AVANZADA
// ============================================================================

console.log('\n⚙️ 3. CONFIGURACIÓN AVANZADA');
console.log('=============================');

// Validador con configuración personalizada
const advancedValidator = createEnterpriseValidator({
  enableLogging: true,
  maxInputLength: 500,
  logLevel: 'info',
  allowedEmailDomains: ['empresa.com']
});

async function validateWithAdvancedConfig() {
  console.log('\n🔧 Validación con configuración avanzada:');
  
  // Texto muy largo (debería fallar)
  const longText = "A".repeat(600);
  const result1 = await advancedValidator.validate(longText);
  console.log('   📏 Texto largo:', result1.isValid ? 'VÁLIDO' : 'INVÁLIDO');
  console.log('   Razón:', result1.reason);
  
  // Texto normal (debería pasar)
  const normalText = "Texto normal";
  const result2 = await advancedValidator.validate(normalText);
  console.log('   ✅ Texto normal:', result2.isValid ? 'VÁLIDO' : 'INVÁLIDO');
}

// ============================================================================
// 4. LOGGING DE AMENAZAS
// ============================================================================

console.log('\n📊 4. LOGGING DE AMENAZAS');
console.log('==========================');

async function demonstrateLogging() {
  console.log('\n🔍 Ejecutando validaciones para generar logs...');
  
  // Ejecutar algunas validaciones
  await validator.validate("Texto normal");
  await validator.validate("<script>alert('xss')</script>");
  await validator.validate("SELECT * FROM users");
  await validator.validate("Este texto tiene puta");
  
  // Obtener logs
  const logger = ValidationLogger.getInstance();
  const logs = logger.getLogs();
  
  console.log('\n📋 Logs de amenazas detectadas:');
  logs.forEach((log, index) => {
    console.log(`   ${index + 1}. [${log.level.toUpperCase()}] ${log.message}`);
    if (log.detectedThreats && log.detectedThreats.length > 0) {
      console.log(`      Amenazas: ${log.detectedThreats.join(', ')}`);
    }
  });
  
  // Limpiar logs
  logger.clearLogs();
  console.log('\n🧹 Logs limpiados');
}

// ============================================================================
// 5. FUNCIÓN PRINCIPAL
// ============================================================================

async function main() {
  console.log('🚀 SECURESHARKINPUTS - EJEMPLO BÁSICO');
  console.log('=======================================\n');
  
  try {
    // 1. Validación simple
    await validateNormalText();
    await validateXSSAttempt();
    await validateSQLInjection();
    await validateInappropriateContent();
    
    // 2. Validación de formularios
    await validateForm(validFormData, "Formulario Válido");
    await validateForm(invalidFormData, "Formulario con XSS");
    
    // 3. Configuración avanzada
    await validateWithAdvancedConfig();
    
    // 4. Logging
    await demonstrateLogging();
    
    console.log('\n🎉 ¡Ejemplo completado exitosamente!');
    console.log('📚 Revisa la documentación para más ejemplos.');
    
  } catch (error) {
    console.error('❌ Error en el ejemplo:', error);
  }
}

// Ejecutar el ejemplo
if (require.main === module) {
  main();
}

export {
  validateNormalText,
  validateXSSAttempt,
  validateSQLInjection,
  validateInappropriateContent,
  validateForm,
  validateWithAdvancedConfig,
  demonstrateLogging,
  main
}; 