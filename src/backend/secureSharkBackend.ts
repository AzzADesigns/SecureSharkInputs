/**
 * SecureSharkInputs Backend
 * Protección de inputs en el servidor
 * 
 * Uso:
 * const { validateInput, validateForm, createBackendValidator } = require('securesharkinputs/backend');
 */

import { createEnterpriseValidator, EnterpriseValidationConfig } from '../services/enterpriseValidator';

// Tipos para el backend
export interface BackendValidationResult {
  isValid: boolean;
  threats: string[];
  sanitizedValue?: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface BackendFormValidationResult {
  isValid: boolean;
  fields: Record<string, BackendValidationResult>;
  overallThreats: string[];
  recommendations: string[];
}

export interface BackendValidatorConfig extends Partial<EnterpriseValidationConfig> {
  enableSanitization?: boolean;
  logThreats?: boolean;
  customSanitizers?: Record<string, (value: string) => string>;
}

// Clase principal para validación backend
export class SecureSharkBackend {
  private validator: any;
  private config: BackendValidatorConfig;

  constructor(config: BackendValidatorConfig = {}) {
    this.config = {
      maxInputLength: 1000,
      enableLogging: true,
      enableSanitization: true,
      logThreats: true,
      ...config
    };

    this.validator = createEnterpriseValidator(this.config);
  }

  /**
   * Valida un input individual
   */
  async validateInput(input: string, fieldName?: string): Promise<BackendValidationResult> {
    try {
      // Validación básica
      if (typeof input !== 'string') {
        return {
          isValid: false,
          threats: ['Invalid input type'],
          recommendations: ['Provide a valid string input'],
          severity: 'high'
        };
      }

      // Input vacío es válido
      if (!input || input.trim() === '') {
        return {
          isValid: true,
          threats: [],
          recommendations: [],
          severity: 'low'
        };
      }

      // Validación de longitud
      if (input.length > (this.config.maxInputLength || 1000)) {
        return {
          isValid: false,
          threats: ['Input too long'],
          recommendations: [`Input must be ${this.config.maxInputLength} characters or less`],
          severity: 'medium'
        };
      }

      // Validación de seguridad usando el validador existente
      const validationResult = await this.validator.validate(input);
      
      // Detectar amenazas específicas
      const threats: string[] = [];
      
      // XSS Detection
      if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(input) || 
          /javascript:/gi.test(input) || 
          /on\w+\s*=/gi.test(input)) {
        threats.push('XSS attack detected');
      }
      
      // SQL Injection Detection
      if (/('|"|;|--|DROP|DELETE|INSERT|UPDATE|SELECT|UNION|EXEC|EXECUTE)/gi.test(input)) {
        threats.push('SQL injection detected');
      }
      
      // Data Theft Detection
      if (/document\.(cookie|localStorage|sessionStorage)/gi.test(input) || 
          /window\.(location|history)/gi.test(input)) {
        threats.push('Data theft attempt detected');
      }
      
      if (!validationResult.isValid || threats.length > 0) {
        // Log de amenazas si está habilitado
        if (this.config.logThreats) {
          console.warn(`🚨 SECURITY THREAT DETECTED in field "${fieldName || 'unknown'}":`, {
            input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
            threats: threats,
            timestamp: new Date().toISOString()
          });
        }

        return {
          isValid: false,
          threats: threats,
          recommendations: this.generateRecommendations(threats),
          severity: this.calculateSeverity(threats)
        };
      }

      // Sanitización si está habilitada
      let sanitizedValue = input;
      if (this.config.enableSanitization) {
        sanitizedValue = this.sanitizeInput(input, fieldName);
      }

      return {
        isValid: true,
        threats: [],
        sanitizedValue,
        recommendations: [],
        severity: 'low'
      };

    } catch (error) {
      console.error('SecureShark Backend Validation Error:', error);
      return {
        isValid: false,
        threats: ['Validation error'],
        recommendations: ['Contact system administrator'],
        severity: 'critical'
      };
    }
  }

  /**
   * Valida un formulario completo
   */
  async validateForm(formData: Record<string, any>): Promise<BackendFormValidationResult> {
    const results: Record<string, BackendValidationResult> = {};
    const allThreats: string[] = [];
    const allRecommendations: string[] = [];

    for (const [fieldName, value] of Object.entries(formData)) {
      const result = await this.validateInput(String(value), fieldName);
      results[fieldName] = result;

      if (!result.isValid) {
        allThreats.push(...result.threats);
        allRecommendations.push(...result.recommendations);
      }
    }

    const isValid = Object.values(results).every(result => result.isValid);

    return {
      isValid,
      fields: results,
      overallThreats: [...new Set(allThreats)], // Eliminar duplicados
      recommendations: [...new Set(allRecommendations)]
    };
  }

  /**
   * Middleware para Express.js
   */
  createExpressMiddleware(fieldName?: string) {
    return async (req: any, res: any, next: any) => {
      try {
        const input = fieldName ? req.body[fieldName] : req.body;
        
        if (typeof input === 'string') {
          const result = await this.validateInput(input, fieldName);
          
          if (!result.isValid) {
            return res.status(400).json({
              error: 'Validation failed',
              details: result
            });
          }
          
          // Reemplazar con valor sanitizado si existe
          if (result.sanitizedValue) {
            if (fieldName) {
              req.body[fieldName] = result.sanitizedValue;
            } else {
              req.body = result.sanitizedValue;
            }
          }
        }
        
        next();
      } catch (error) {
        console.error('SecureShark Middleware Error:', error);
        res.status(500).json({
          error: 'Internal validation error'
        });
      }
    };
  }

  /**
   * Middleware para Fastify
   */
  createFastifyMiddleware(fieldName?: string) {
    return async (request: any, reply: any) => {
      try {
        const input = fieldName ? request.body[fieldName] : request.body;
        
        if (typeof input === 'string') {
          const result = await this.validateInput(input, fieldName);
          
          if (!result.isValid) {
            return reply.status(400).send({
              error: 'Validation failed',
              details: result
            });
          }
          
          // Reemplazar con valor sanitizado si existe
          if (result.sanitizedValue) {
            if (fieldName) {
              request.body[fieldName] = result.sanitizedValue;
            } else {
              request.body = result.sanitizedValue;
            }
          }
        }
      } catch (error) {
        console.error('SecureShark Fastify Middleware Error:', error);
        reply.status(500).send({
          error: 'Internal validation error'
        });
      }
    };
  }

  /**
   * Sanitiza el input
   */
  private sanitizeInput(input: string, fieldName?: string): string {
    let sanitized = input;

    // Aplicar sanitizadores personalizados específicos del campo
    if (this.config.customSanitizers && fieldName) {
      const fieldSanitizer = this.config.customSanitizers[fieldName];
      if (fieldSanitizer) {
        sanitized = fieldSanitizer(sanitized);
      }
    }

    // Sanitización básica
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();

    return sanitized;
  }

  /**
   * Genera recomendaciones basadas en las amenazas
   */
  private generateRecommendations(threats: string[]): string[] {
    const recommendations: string[] = [];

    // Verificar que threats existe y es un array
    if (!threats || !Array.isArray(threats)) {
      return ['Contact system administrator for assistance'];
    }

    threats.forEach(threat => {
      if (threat.includes('XSS')) {
        recommendations.push('Avoid using script tags and special characters');
      } else if (threat.includes('SQL')) {
        recommendations.push('Avoid using SQL keywords and special characters');
      } else if (threat.includes('inappropriate')) {
        recommendations.push('Use appropriate language');
      } else if (threat.includes('Unicode')) {
        recommendations.push('Use standard characters only');
      }
    });

    return recommendations;
  }

  /**
   * Calcula la severidad basada en las amenazas
   */
  private calculateSeverity(threats: string[]): 'low' | 'medium' | 'high' | 'critical' {
    // Verificar que threats existe y es un array
    if (!threats || !Array.isArray(threats)) {
      return 'low';
    }

    // Buscar amenazas críticas
    if (threats.some(threat => 
      threat.toLowerCase().includes('xss') || 
      threat.toLowerCase().includes('sql') ||
      threat.toLowerCase().includes('script')
    )) {
      return 'critical';
    }

    // Buscar amenazas altas
    if (threats.some(threat => 
      threat.toLowerCase().includes('data theft') ||
      threat.toLowerCase().includes('inappropriate')
    )) {
      return 'high';
    }

    // Buscar amenazas medias
    if (threats.some(threat => 
      threat.toLowerCase().includes('unicode') ||
      threat.toLowerCase().includes('homoglyph')
    )) {
      return 'medium';
    }

    return 'low';
  }
}

// Funciones de conveniencia
export const createBackendValidator = (config?: BackendValidatorConfig) => {
  return new SecureSharkBackend(config);
};

export const validateInput = async (input: string, config?: BackendValidatorConfig): Promise<BackendValidationResult> => {
  const validator = new SecureSharkBackend(config);
  return validator.validateInput(input);
};

export const validateForm = async (formData: Record<string, any>, config?: BackendValidatorConfig): Promise<BackendFormValidationResult> => {
  const validator = new SecureSharkBackend(config);
  return validator.validateForm(formData);
};

// Exportar todo
export default SecureSharkBackend; 