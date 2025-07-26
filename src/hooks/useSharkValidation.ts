import { createEnterpriseValidator } from '../services/enterpriseValidator';

interface UseSharkValidationOptions {
  maxLength?: number;
  enableLogging?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  threats: string[];
  reason?: string;
}

interface FormValidationResult {
  isValid: boolean;
  fields: Record<string, ValidationResult>;
  overallThreats: string[];
}

export const useSharkValidation = (options: UseSharkValidationOptions = {}) => {
  const validator = createEnterpriseValidator({
    maxInputLength: options.maxLength || 1000,
    enableLogging: options.enableLogging || false
  });

  // Validación asíncrona completa
  const validate = async (input: string): Promise<ValidationResult> => {
    try {
      const result = await validator.validate(input);
      return {
        isValid: result.isValid,
        threats: (result as any).threats || [],
        reason: result.reason
      };
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        threats: ['Validation error'],
        reason: 'validation_error'
      };
    }
  };

  // Validación síncrona básica (para feedback inmediato)
  const validateSync = (input: string): ValidationResult => {
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        threats: ['Invalid input type'],
        reason: 'invalid_type'
      };
    }

    if (input.length > (options.maxLength || 1000)) {
      return {
        isValid: false,
        threats: ['Input too long'],
        reason: 'input_too_long'
      };
    }

    // Validación básica síncrona
    const basicThreats: string[] = [];
    
    // XSS básico
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(input)) {
      basicThreats.push('XSS attack detected');
    }
    
    // SQL injection básico
    if (/['";]|SELECT|INSERT|UPDATE|DELETE|DROP|UNION/gi.test(input)) {
      basicThreats.push('SQL injection detected');
    }
    
    // Data theft básico
    if (/document\.cookie|localStorage|sessionStorage/gi.test(input)) {
      basicThreats.push('Data theft attempt detected');
    }

    return {
      isValid: basicThreats.length === 0,
      threats: basicThreats,
      reason: basicThreats.length > 0 ? 'security_threat' : undefined
    };
  };

  // Validación de formulario completo
  const validateForm = async (formData: Record<string, any>): Promise<FormValidationResult> => {
    const results: Record<string, ValidationResult> = {};
    const allThreats: string[] = [];

    for (const [fieldName, value] of Object.entries(formData)) {
      const result = await validate(String(value));
      results[fieldName] = result;

      if (!result.isValid) {
        allThreats.push(...result.threats);
      }
    }

    const isValid = Object.values(results).every(result => result.isValid);

    return {
      isValid,
      fields: results,
      overallThreats: [...new Set(allThreats)] // Eliminar duplicados
    };
  };

  return {
    validate,
    validateSync,
    validateForm
  };
}; 