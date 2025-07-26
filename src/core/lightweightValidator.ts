/**
 * SecureSharkInputs Lightweight
 * Versión optimizada para aplicaciones pequeñas
 * 
 * Uso:
 * import { createLightweightValidator } from 'securesharkinputs/core';
 */

export interface LightweightValidationResult {
  isValid: boolean;
  threats: string[];
  reason?: string;
}

export interface LightweightValidatorConfig {
  maxInputLength?: number;
  enableBasicThreats?: boolean;
  enableXSSDetection?: boolean;
  enableSQLDetection?: boolean;
  enableDataTheftDetection?: boolean;
}

// Patrones básicos de amenazas (sin listas pesadas)
const BASIC_THREATS = {
  // XSS básico
  xss: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ],
  
  // SQL injection básico
  sql: [
    /['";]/g,
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b/gi,
    /--/g,
    /\/\*/g,
    /\*\//g
  ],
  
  // Data theft básico
  dataTheft: [
    /document\.cookie/gi,
    /localStorage/gi,
    /sessionStorage/gi,
    /window\./gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi
  ]
};

export class LightweightValidator {
  private config: LightweightValidatorConfig;

  constructor(config: LightweightValidatorConfig = {}) {
    this.config = {
      maxInputLength: 1000,
      enableBasicThreats: true,
      enableXSSDetection: true,
      enableSQLDetection: true,
      enableDataTheftDetection: true,
      ...config
    };
  }

  /**
   * Valida un input usando solo patrones básicos
   */
  async validate(input: string): Promise<LightweightValidationResult> {
    try {
      // Validación básica
      if (!input || typeof input !== 'string') {
        return {
          isValid: false,
          threats: ['Invalid input type'],
          reason: 'invalid_type'
        };
      }

      // Validación de longitud
      if (input.length > (this.config.maxInputLength || 1000)) {
        return {
          isValid: false,
          threats: ['Input too long'],
          reason: 'input_too_long'
        };
      }

      const threats: string[] = [];

      // Detección de XSS
      if (this.config.enableXSSDetection) {
        for (const pattern of BASIC_THREATS.xss) {
          if (pattern.test(input)) {
            threats.push('XSS attack detected');
            break;
          }
        }
      }

      // Detección de SQL injection
      if (this.config.enableSQLDetection) {
        for (const pattern of BASIC_THREATS.sql) {
          if (pattern.test(input)) {
            threats.push('SQL injection detected');
            break;
          }
        }
      }

      // Detección de data theft
      if (this.config.enableDataTheftDetection) {
        for (const pattern of BASIC_THREATS.dataTheft) {
          if (pattern.test(input)) {
            threats.push('Data theft attempt detected');
            break;
          }
        }
      }

      return {
        isValid: threats.length === 0,
        threats,
        reason: threats.length > 0 ? 'security_threat' : undefined
      };

    } catch (error) {
      console.error('Lightweight validation error:', error);
      return {
        isValid: false,
        threats: ['Validation error'],
        reason: 'validation_error'
      };
    }
  }

  /**
   * Validación síncrona para feedback inmediato
   */
  validateSync(input: string): LightweightValidationResult {
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        threats: ['Invalid input type'],
        reason: 'invalid_type'
      };
    }

    if (input.length > (this.config.maxInputLength || 1000)) {
      return {
        isValid: false,
        threats: ['Input too long'],
        reason: 'input_too_long'
      };
    }

    const threats: string[] = [];

    // Detección básica síncrona
    if (this.config.enableXSSDetection) {
      if (/<script|javascript:|on\w+\s*=/gi.test(input)) {
        threats.push('XSS attack detected');
      }
    }

    if (this.config.enableSQLDetection) {
      if (/['";]|SELECT|INSERT|UPDATE|DELETE|DROP|UNION/gi.test(input)) {
        threats.push('SQL injection detected');
      }
    }

    if (this.config.enableDataTheftDetection) {
      if (/document\.cookie|localStorage|sessionStorage/gi.test(input)) {
        threats.push('Data theft attempt detected');
      }
    }

    return {
      isValid: threats.length === 0,
      threats,
      reason: threats.length > 0 ? 'security_threat' : undefined
    };
  }
}

// Función de conveniencia
export const createLightweightValidator = (config?: LightweightValidatorConfig) => {
  return new LightweightValidator(config);
};

// Validación directa
export const validateInput = async (input: string, config?: LightweightValidatorConfig): Promise<LightweightValidationResult> => {
  const validator = new LightweightValidator(config);
  return validator.validate(input);
};

// Validación síncrona directa
export const validateInputSync = (input: string, config?: LightweightValidatorConfig): LightweightValidationResult => {
  const validator = new LightweightValidator(config);
  return validator.validateSync(input);
};

export default LightweightValidator; 