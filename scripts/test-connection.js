#!/usr/bin/env node

/**
 * Script de verificación de conexión real
 * Verifica que los inputs específicos del proyecto están protegidos
 * 
 * Nuevas características incluidas:
 * - Detección de react-hook-form usage
 * - Verificación de plantillas instaladas
 * - Análisis de ValidationShark con nuevas props
 * 
 * Uso: node node_modules/securesharkinputs/scripts/test-connection.js
 */

const fs = require('fs');
const path = require('path');

console.log('🦈 SecureSharkInputs - Verificación de Conexión Real v1.4.0');
console.log('===========================================================\n');

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

// Función para buscar archivos React/JSX en el proyecto
function findReactFiles() {
  const extensions = ['.jsx', '.tsx', '.js', '.ts'];
  const reactFiles = [];
  
  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            reactFiles.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Ignorar errores de permisos
    }
  }
  
  scanDirectory(process.cwd());
  return reactFiles;
}

// Función para analizar un archivo y buscar inputs
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const findings = {
      inputs: [],
      validationSharks: [],
      unprotectedInputs: [],
      protectedInputs: [],
      reactHookFormUsage: false,
      templateUsage: false,
      imports: []
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      // Buscar imports
      if (line.includes('import') || line.includes('require')) {
        if (line.includes('react-hook-form')) {
          findings.reactHookFormUsage = true;
        }
        if (line.includes('securesharkinputs')) {
          findings.imports.push({ line: lineNumber, content: line.trim() });
        }
        if (line.includes('SecureSharkForm')) {
          findings.templateUsage = true;
        }
      }
      
      // Buscar inputs
      const inputMatches = line.match(/<input[^>]*>/gi);
      const textareaMatches = line.match(/<textarea[^>]*>/gi);
      
      if (inputMatches || textareaMatches) {
        const inputs = [...(inputMatches || []), ...(textareaMatches || [])];
        
        inputs.forEach(input => {
          const idMatch = input.match(/id=["']([^"']+)["']/i);
          const nameMatch = input.match(/name=["']([^"']+)["']/i);
          const typeMatch = input.match(/type=["']([^"']+)["']/i);
          
          findings.inputs.push({
            line: lineNumber,
            content: input.trim(),
            id: idMatch ? idMatch[1] : null,
            name: nameMatch ? nameMatch[1] : null,
            type: typeMatch ? typeMatch[1] : 'text'
          });
        });
      }
      
      // Buscar ValidationShark components
      const validationSharkMatches = line.match(/<ValidationShark[^>]*>/gi);
      if (validationSharkMatches) {
        validationSharkMatches.forEach(match => {
          const inputIdMatch = match.match(/inputId=["']([^"']+)["']/i);
          const blockFormMatch = match.match(/blockForm=["']([^"']+)["']/i);
          const showMessagesMatch = match.match(/showMessages=["']([^"']+)["']/i);
          
          findings.validationSharks.push({
            line: lineNumber,
            content: match.trim(),
            inputId: inputIdMatch ? inputIdMatch[1] : null,
            blockForm: blockFormMatch ? blockFormMatch[1] : 'true',
            showMessages: showMessagesMatch ? showMessagesMatch[1] : 'true'
          });
        });
      }
    }
    
    return findings;
  } catch (error) {
    log.error(`Error analizando archivo ${filePath}: ${error.message}`);
    return null;
  }
}

// Verificar conexión entre inputs y ValidationShark
function verifyConnection(findings, filePath) {
  const results = {
    file: filePath,
    totalInputs: findings.inputs.length,
    totalValidationSharks: findings.validationSharks.length,
    protectedInputs: [],
    unprotectedInputs: [],
    reactHookFormDetected: findings.reactHookFormUsage,
    templateDetected: findings.templateUsage,
    recommendations: []
  };
  
  // Verificar cada input
  findings.inputs.forEach(input => {
    const isProtected = checkIfInputIsProtected(input, findings.validationSharks);
    
    if (isProtected) {
      results.protectedInputs.push(input);
    } else {
      results.unprotectedInputs.push(input);
    }
  });
  
  // Generar recomendaciones
  if (results.unprotectedInputs.length > 0) {
    results.recommendations.push(`Agregar ValidationShark para ${results.unprotectedInputs.length} inputs no protegidos`);
  }
  
  if (findings.reactHookFormUsage && results.unprotectedInputs.length > 0) {
    results.recommendations.push('Usar ValidationShark con react-hook-form para mejor integración');
  }
  
  if (!findings.templateUsage && results.unprotectedInputs.length > 0) {
    results.recommendations.push('Considerar usar la plantilla SecureSharkForm como base');
  }
  
  return results;
}

// Verificar si un input está protegido
function checkIfInputIsProtected(input, validationSharks) {
  // Si no hay ValidationShark components, no está protegido
  if (validationSharks.length === 0) {
    return false;
  }
  
  // Buscar ValidationShark que proteja este input específico
  for (const shark of validationSharks) {
    // Si tiene inputId específico, verificar que coincida
    if (shark.inputId) {
      if (input.id === shark.inputId) {
        return true;
      }
    } else {
      // Si no tiene inputId, asumir que protege el input más cercano
      // (esto es una aproximación, en la práctica depende de la estructura DOM)
      return true;
    }
  }
  
  return false;
}

// Generar reporte
function generateReport(allResults) {
  log.title('📊 REPORTE DE CONEXIÓN');
  console.log('========================\n');
  
  let totalFiles = allResults.length;
  let filesWithImports = 0;
  let filesWithReactHookForm = 0;
  let filesWithTemplates = 0;
  let totalInputs = 0;
  let totalProtected = 0;
  let totalUnprotected = 0;
  
  allResults.forEach(result => {
    if (result.imports && result.imports.length > 0) filesWithImports++;
    if (result.reactHookFormDetected) filesWithReactHookForm++;
    if (result.templateDetected) filesWithTemplates++;
    totalInputs += result.totalInputs;
    totalProtected += result.protectedInputs.length;
    totalUnprotected += result.unprotectedInputs.length;
  });
  
  // Estadísticas generales
  console.log(`${colors.bold}📈 ESTADÍSTICAS GENERALES:${colors.reset}`);
  console.log(`   Archivos analizados: ${totalFiles}`);
  console.log(`   Archivos con imports de SecureShark: ${filesWithImports}`);
  console.log(`   Archivos usando react-hook-form: ${filesWithReactHookForm}`);
  console.log(`   Archivos usando plantillas: ${filesWithTemplates}`);
  console.log(`   Total de inputs encontrados: ${totalInputs}`);
  console.log(`   Inputs protegidos: ${totalProtected}`);
  console.log(`   Inputs no protegidos: ${totalUnprotected}`);
  
  // Porcentaje de protección
  const protectionPercentage = totalInputs > 0 ? Math.round((totalProtected / totalInputs) * 100) : 0;
  console.log(`   Porcentaje de protección: ${protectionPercentage}%`);
  
  console.log('\n' + '='.repeat(60));
  
  // Detalles por archivo
  allResults.forEach(result => {
    if (result.totalInputs > 0) {
      console.log(`\n${colors.bold}📁 ${path.basename(result.file)}:${colors.reset}`);
      console.log(`   Inputs: ${result.totalInputs} | Protegidos: ${result.protectedInputs.length} | No protegidos: ${result.unprotectedInputs.length}`);
      
      if (result.unprotectedInputs.length > 0) {
        console.log(`   ${colors.red}❌ Inputs no protegidos:${colors.reset}`);
        result.unprotectedInputs.forEach(input => {
          console.log(`      Línea ${input.line}: ${input.content.substring(0, 50)}...`);
        });
      }
      
      if (result.recommendations.length > 0) {
        console.log(`   ${colors.yellow}💡 Recomendaciones:${colors.reset}`);
        result.recommendations.forEach(rec => {
          console.log(`      • ${rec}`);
        });
      }
    }
  });
  
  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bold}🎯 RESUMEN FINAL:${colors.reset}`);
  
  if (totalUnprotected === 0 && totalInputs > 0) {
    log.success('¡Excelente! Todos los inputs están protegidos');
  } else if (protectionPercentage >= 80) {
    log.success(`Buen trabajo! ${protectionPercentage}% de los inputs están protegidos`);
  } else if (protectionPercentage >= 50) {
    log.warning(`Progreso moderado: ${protectionPercentage}% de los inputs están protegidos`);
  } else {
    log.error(`Necesitas mejorar la protección: solo ${protectionPercentage}% de los inputs están protegidos`);
  }
  
  if (totalUnprotected > 0) {
    console.log(`\n${colors.yellow}🔧 PRÓXIMOS PASOS:${colors.reset}`);
    console.log('   1. Agrega <ValidationShark /> después de cada input no protegido');
    console.log('   2. Considera usar la plantilla SecureSharkForm como base');
    console.log('   3. Ejecuta: node node_modules/securesharkinputs/scripts/manual-install.js');
  }
}

// Crear test de conexión simple
function createConnectionTest() {
  const testContent = `
import React from 'react';
import { useForm } from 'react-hook-form';
import ValidationShark from 'securesharkinputs';

function TestForm() {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-field">
        <label>Name</label>
        <input 
          id="name" 
          type="text" 
          {...register('name')} 
          placeholder="Your name" 
        />
        <ValidationShark inputId="name" />
      </div>
      
      <div className="input-field">
        <label>Email</label>
        <input 
          id="email" 
          type="email" 
          {...register('email')} 
          placeholder="your@email.com" 
        />
        <ValidationShark inputId="email" />
      </div>
      
      <div className="input-field">
        <label>Message</label>
        <textarea 
          id="message" 
          {...register('message')} 
          placeholder="Your message" 
        />
        <ValidationShark inputId="message" />
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}

export default TestForm;
`;

  const testPath = path.join(process.cwd(), 'test-connection-example.tsx');
  
  try {
    fs.writeFileSync(testPath, testContent);
    log.success(`Test de conexión creado: ${testPath}`);
    log.info('Puedes usar este archivo como referencia para proteger tus inputs');
  } catch (error) {
    log.error(`Error creando test de conexión: ${error.message}`);
  }
}

// Función principal
function runConnectionAnalysis() {
  log.title('🔍 ANALIZANDO CONEXIONES EN EL PROYECTO');
  console.log('=======================================\n');
  
  // Buscar archivos React
  const reactFiles = findReactFiles();
  
  if (reactFiles.length === 0) {
    log.warning('No se encontraron archivos React/JSX en el proyecto');
    log.info('Asegúrate de estar en el directorio raíz de tu proyecto React');
    return;
  }
  
  log.info(`Encontrados ${reactFiles.length} archivos React/JSX para analizar`);
  
  // Analizar cada archivo
  const allResults = [];
  
  reactFiles.forEach(file => {
    const findings = analyzeFile(file);
    if (findings) {
      const result = verifyConnection(findings, file);
      allResults.push(result);
    }
  });
  
  // Generar reporte
  generateReport(allResults);
  
  // Crear test de conexión si hay inputs no protegidos
  const totalUnprotected = allResults.reduce((sum, result) => sum + result.unprotectedInputs.length, 0);
  
  if (totalUnprotected > 0) {
    console.log('\n' + '='.repeat(60));
    log.info('Creando ejemplo de test de conexión...');
    createConnectionTest();
  }
  
  console.log('\n📖 Para más información:');
  console.log('   - README.md en el paquete');
  console.log('   - SECURESHARK_SETUP.md (si está disponible)');
  console.log('   - https://github.com/AzzADesigns/SecureSharkInputs');
}

// Ejecutar análisis
runConnectionAnalysis(); 