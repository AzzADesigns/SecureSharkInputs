#!/usr/bin/env node

/**
 * Script de verificación de conexión real
 * Verifica que los inputs específicos del proyecto están protegidos
 * 
 * Uso: node node_modules/securesharkinputs/scripts/test-connection.js
 */

const fs = require('fs');
const path = require('path');

console.log('🦈 SecureSharkInputs - Verificación de Conexión Real');
console.log('====================================================\n');

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
      protectedInputs: []
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
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
      
      // Buscar ValidationShark
      if (line.includes('ValidationShark') || line.includes('SimpleValidationShark')) {
        findings.validationSharks.push({
          line: lineNumber,
          content: line.trim()
        });
      }
    }
    
    return findings;
  } catch (error) {
    return { inputs: [], validationSharks: [], unprotectedInputs: [], protectedInputs: [] };
  }
}

// Función para verificar conexión entre inputs y ValidationShark
function verifyConnection(findings, filePath) {
  const results = {
    file: path.basename(filePath),
    totalInputs: findings.inputs.length,
    totalValidationSharks: findings.validationSharks.length,
    protectedInputs: [],
    unprotectedInputs: [],
    recommendations: []
  };
  
  // Analizar cada input
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
    results.recommendations.push(
      `Agregar <ValidationShark /> después de los inputs no protegidos`
    );
  }
  
  if (results.validationSharks.length > results.inputs.length) {
    results.recommendations.push(
      `Hay más ValidationShark que inputs - verificar configuración`
    );
  }
  
  return results;
}

// Función para verificar si un input está protegido
function checkIfInputIsProtected(input, validationSharks) {
  // Buscar ValidationShark en las líneas cercanas al input
  const inputLine = input.line;
  
  // Buscar ValidationShark en un rango de 10 líneas
  const nearbyValidationSharks = validationSharks.filter(vs => 
    Math.abs(vs.line - inputLine) <= 10
  );
  
  if (nearbyValidationSharks.length > 0) {
    return true;
  }
  
  // Verificar si hay ValidationShark con ID específico
  if (input.id) {
    const specificValidationShark = validationSharks.find(vs => 
      vs.content.includes(`for="${input.id}"`) || 
      vs.content.includes(`inputId="${input.id}"`)
    );
    
    if (specificValidationShark) {
      return true;
    }
  }
  
  return false;
}

// Función para generar reporte
function generateReport(allResults) {
  log.title('📊 Reporte de Protección de Inputs');
  console.log('==================================\n');
  
  let totalInputs = 0;
  let totalProtected = 0;
  let totalUnprotected = 0;
  let filesWithIssues = 0;
  
  allResults.forEach(result => {
    totalInputs += result.totalInputs;
    totalProtected += result.protectedInputs.length;
    totalUnprotected += result.unprotectedInputs.length;
    
    if (result.unprotectedInputs.length > 0) {
      filesWithIssues++;
    }
    
    console.log(`📁 ${result.file}`);
    console.log(`   Inputs totales: ${result.totalInputs}`);
    console.log(`   Inputs protegidos: ${result.protectedInputs.length}`);
    console.log(`   Inputs no protegidos: ${result.unprotectedInputs.length}`);
    
    if (result.unprotectedInputs.length > 0) {
      console.log(`   🚨 Inputs no protegidos:`);
      result.unprotectedInputs.forEach(input => {
        console.log(`      Línea ${input.line}: ${input.content}`);
      });
    }
    
    if (result.recommendations.length > 0) {
      console.log(`   💡 Recomendaciones:`);
      result.recommendations.forEach(rec => {
        console.log(`      - ${rec}`);
      });
    }
    
    console.log('');
  });
  
  // Resumen general
  log.title('📈 Resumen General');
  console.log('==================');
  console.log(`Total de archivos analizados: ${allResults.length}`);
  console.log(`Total de inputs encontrados: ${totalInputs}`);
  console.log(`Inputs protegidos: ${totalProtected}`);
  console.log(`Inputs no protegidos: ${totalUnprotected}`);
  console.log(`Archivos con problemas: ${filesWithIssues}`);
  
  const protectionRate = totalInputs > 0 ? (totalProtected / totalInputs * 100).toFixed(1) : 0;
  console.log(`Tasa de protección: ${protectionRate}%`);
  
  if (totalUnprotected > 0) {
    log.error(`¡Se encontraron ${totalUnprotected} inputs no protegidos!`);
    console.log('\n🔧 Para proteger los inputs no protegidos:');
    console.log('   1. Agrega <ValidationShark /> después de cada input');
    console.log('   2. O usa <ValidationShark for="input-id" /> para inputs específicos');
    console.log('   3. O usa useSharkValidation() para validación programática');
  } else if (totalInputs > 0) {
    log.success(`¡Todos los ${totalInputs} inputs están protegidos!`);
  } else {
    log.warning('No se encontraron inputs para analizar');
  }
}

// Función para crear un test de conexión real
function createConnectionTest() {
  log.title('🧪 Creando Test de Conexión Real');
  
  const testCode = `
// Test de conexión real para SecureSharkInputs
// Este archivo se genera automáticamente

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ValidationShark from 'securesharkinputs';

// Componente de prueba que simula inputs reales
const TestForm = () => {
  const [values, setValues] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <form>
      <div>
        <label>Nombre:</label>
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          data-testid="name-input"
        />
        <ValidationShark />
      </div>
      
      <div>
        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          data-testid="email-input"
        />
        <ValidationShark />
      </div>
      
      <div>
        <label>Mensaje:</label>
        <textarea
          name="message"
          value={values.message}
          onChange={handleChange}
          data-testid="message-input"
        />
        <ValidationShark />
      </div>
    </form>
  );
};

describe('Conexión Real de ValidationShark', () => {
  it('should connect to inputs and validate in real-time', async () => {
    render(<TestForm />);
    
    // Test input seguro
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    // Verificar que ValidationShark responde
    await screen.findByText('✅ Válido');
    
    // Test input malicioso
    fireEvent.change(nameInput, { target: { value: '<script>alert("xss")</script>' } });
    
    // Verificar que ValidationShark bloquea
    await screen.findByText('❌ No permitido');
  });
});
`;

  const testPath = path.join(process.cwd(), 'src/__tests__/connection.test.tsx');
  
  try {
    fs.writeFileSync(testPath, testCode);
    log.success(`Test de conexión creado en: ${testPath}`);
    log.info('Ejecuta: npm test connection.test.tsx');
  } catch (error) {
    log.error(`Error al crear test: ${error.message}`);
  }
}

// Función principal
function runConnectionAnalysis() {
  log.title('🔍 Analizando Conexión de Inputs');
  
  // Buscar archivos React
  const reactFiles = findReactFiles();
  
  if (reactFiles.length === 0) {
    log.warning('No se encontraron archivos React/JSX para analizar');
    log.info('Asegúrate de estar en el directorio raíz de tu proyecto React');
    return;
  }
  
  log.info(`Encontrados ${reactFiles.length} archivos React/JSX`);
  
  // Analizar cada archivo
  const allResults = [];
  
  reactFiles.forEach(filePath => {
    const findings = analyzeFile(filePath);
    const results = verifyConnection(findings, filePath);
    
    if (results.totalInputs > 0 || results.totalValidationSharks > 0) {
      allResults.push(results);
    }
  });
  
  if (allResults.length === 0) {
    log.warning('No se encontraron inputs o ValidationShark en los archivos');
    log.info('Asegúrate de que tu proyecto use inputs y ValidationShark');
    return;
  }
  
  // Generar reporte
  generateReport(allResults);
  
  // Crear test de conexión real
  createConnectionTest();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runConnectionAnalysis();
}

module.exports = {
  runConnectionAnalysis,
  findReactFiles,
  analyzeFile,
  verifyConnection,
  generateReport,
  createConnectionTest
}; 