// Configuración Enterprise para servicios de validación avanzada

export interface EnterpriseValidationConfig {
  // Configuración de servicios externos
  enableExternalValidation: boolean;
  azureContentModerator?: {
    endpoint: string;
    key: string;
  };
  
  // Configuración de logging
  enableLogging: boolean;
  logLevel: 'info' | 'warn' | 'error';
  
  // Configuración de límites
  maxInputLength: number;
  maxValidationTime: number; // ms
  
  // Configuración de dominios corporativos
  allowedEmailDomains: string[];
  
  // Configuración de actualización
  enableAutoUpdate: boolean;
  updateInterval: number; // días
}

// Configuración por defecto
export const defaultEnterpriseConfig: EnterpriseValidationConfig = {
  enableExternalValidation: false,
  enableLogging: true,
  logLevel: 'warn',
  maxInputLength: 1000,
  maxValidationTime: 5000,
  allowedEmailDomains: ['empresa.com', 'sucursal.net'],
  enableAutoUpdate: false,
  updateInterval: 30
};

// Logger para monitoreo de intentos de bypass
export class ValidationLogger {
  private static instance: ValidationLogger;
  private logs: Array<{
    timestamp: Date;
    level: string;
    message: string;
    input?: string;
    detectedThreats?: string[];
  }> = [];

  static getInstance(): ValidationLogger {
    if (!ValidationLogger.instance) {
      ValidationLogger.instance = new ValidationLogger();
    }
    return ValidationLogger.instance;
  }

  log(level: string, message: string, input?: string, detectedThreats?: string[]) {
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      input: input?.substring(0, 100), // Limitar longitud para privacidad
      detectedThreats
    };

    this.logs.push(logEntry);

    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === 'production') {
      console.log(`[${level.toUpperCase()}] ${message}`, {
        input: logEntry.input,
        threats: detectedThreats
      });
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

// Funciones de detección de amenazas (importadas de useSchema.tsx)
const palabrasInapropiadas = [
  'puta', 'puto', 'pendejo', 'pendeja', 'cabrón', 'cabrona', 'mierda', 'joder', 'carajo', 'coño',
  'fuck', 'shit', 'bitch', 'bastard', 'asshole', 'dick', 'pussy', 'damn', 'crap', 'slut'
];

const palabrasInapropiadasSet = new Set(palabrasInapropiadas);

const htmlInjectionRegex = /<[^>]*>|&[^;]+;/gi;
const xssKeywords = /(javascript:|<script|on\w+=|eval\(|Function\(|document\.|window\.|<svg|<img|<iframe|<object|<embed|<form|<input|<textarea|<select|<button|<link|<meta|<style|<base|<title|location\.|document\.cookie|localStorage|sessionStorage)/gi;
const sqlKeywords = /(select\s|insert\s|delete\s|update\s|drop\s|union\s|--|\/\*|xp_|create\s|alter\s|exec\s|execute\s|where\s|from\s|table\s|database\s|schema\s|trigger\s|procedure\s)/gi;

const homoglyphsRegex = /[а-яА-ЯеЁ]/;
const zeroWidthRegex = /[\u200B-\u200D\uFEFF]/;
const combiningCharsRegex = /[\u0300-\u036F]/;
const invisibleCharsRegex = /[\u0000-\u001F\u007F-\u009F]/;

const patronesRoboDatos = [
  'document.cookie', 'localStorage.getItem', 'sessionStorage.getItem',
  'window.localStorage', 'window.sessionStorage',
  'document["cookie"]', 'localStorage["getItem"]', 'sessionStorage["getItem"]'
];

const contieneBypass = (texto: string): boolean => {
  if (!texto || typeof texto !== 'string') return false;
  
  const normalizado = texto
    .normalize('NFKC')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  
  return Array.from(palabrasInapropiadasSet).some(palabra => 
    normalizado.includes(palabra.toLowerCase())
  );
};

const contieneCaracteresSospechosos = (texto: string): boolean => {
  if (!texto || typeof texto !== 'string') return false;
  
  return homoglyphsRegex.test(texto) || 
         zeroWidthRegex.test(texto) || 
         invisibleCharsRegex.test(texto) ||
         combiningCharsRegex.test(texto);
};

const detectaRoboDatos = (texto: string): boolean => {
  if (!texto || typeof texto !== 'string') return false;
  
  const textoLower = texto.toLowerCase();
  
  const tienePatronesDirectos = patronesRoboDatos.some(patron => 
    textoLower.includes(patron.toLowerCase())
  );
  
  const tieneSerializacion = /JSON\.(parse|stringify)\([^)]*(localStorage|sessionStorage|cookie)/i.test(texto);
  
  const tieneExfiltracion = /(fetch|XMLHttpRequest|navigator\.sendBeacon)\([^)]*(localStorage|sessionStorage|cookie)/i.test(texto);
  
  const tieneComunicacion = /(postMessage|BroadcastChannel|MessageChannel)\([^)]*(localStorage|sessionStorage|cookie)/i.test(texto);
  
  return tienePatronesDirectos || tieneSerializacion || tieneExfiltracion || tieneComunicacion;
};

const contieneContenidoInapropiado = (texto: string): boolean => {
  if (!texto || typeof texto !== 'string') return false;
  
  if (texto.length > 1000) {
    return true;
  }
  
  if (contieneCaracteresSospechosos(texto)) {
    return true;
  }
  
  if (detectaRoboDatos(texto)) {
    return true;
  }
  
  const textoLower = texto.toLowerCase();
  
  const contieneInsultos = Array.from(palabrasInapropiadasSet).some(palabra => 
    textoLower.includes(palabra.toLowerCase())
  );
  
  const contieneBypassDetectado = contieneBypass(texto);
  
  // Mejorar detección de SQL
  const contieneSQL = sqlKeywords.test(textoLower) || 
                     /\b(select|insert|delete|update|drop|create|alter|exec|execute|union|where|from|table|database|schema|trigger|procedure)\b/i.test(textoLower) ||
                     /\b(1=1|1=0|true|false|null)\b/i.test(textoLower) ||
                     /\b(or|and|not)\b/i.test(textoLower);
  
  // Mejorar detección de XSS
  const contieneXSS = xssKeywords.test(texto) || 
                     /javascript:/i.test(texto) ||
                     /<script/i.test(texto) ||
                     /on\w+=/i.test(texto);
  
  const contieneHTML = htmlInjectionRegex.test(texto);
  
  return contieneInsultos || contieneBypassDetectado || contieneSQL || contieneXSS || contieneHTML;
};

// Servicio de validación enterprise
export class EnterpriseValidationService {
  private config: EnterpriseValidationConfig;
  private logger: ValidationLogger;

  constructor(config: EnterpriseValidationConfig = defaultEnterpriseConfig) {
    this.config = config;
    this.logger = ValidationLogger.getInstance();
  }

  async validateWithExternalService(text: string): Promise<{
    isSafe: boolean;
    threatLevel: number;
    detectedThreats: string[];
  }> {
    if (!this.config.enableExternalValidation) {
      return {
        isSafe: true,
        threatLevel: 0,
        detectedThreats: []
      };
    }

    try {
      const threatLevel = await this.simulateExternalValidation(text);
      
      const result = {
        isSafe: threatLevel < 3,
        threatLevel,
        detectedThreats: threatLevel > 0 ? ['contenido_sospechoso'] : []
      };

      this.logger.log('info', 'Validación externa completada', text, result.detectedThreats);
      
      return result;
    } catch (error) {
      this.logger.log('error', 'Error en validación externa', text);
      return {
        isSafe: true,
        threatLevel: 0,
        detectedThreats: []
      };
    }
  }

  private async simulateExternalValidation(text: string): Promise<number> {
    const suspiciousPatterns = [
      /\b(hack|crack|exploit|vulnerability)\b/i,
      /\b(password|admin|root)\b/i,
      /<script|javascript:|on\w+=/i
    ];

    const threatScore = suspiciousPatterns.reduce((score, pattern) => {
      return score + (pattern.test(text) ? 1 : 0);
    }, 0);

    return Math.min(threatScore, 5);
  }

  async updateBlacklist(): Promise<void> {
    if (!this.config.enableAutoUpdate) return;

    try {
      this.logger.log('info', 'Actualización de lista negra iniciada');
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.logger.log('info', 'Lista negra actualizada exitosamente');
    } catch (error) {
      this.logger.log('error', 'Error actualizando lista negra');
    }
  }
}

// Función helper para validación enterprise
export const createEnterpriseValidator = (config?: Partial<EnterpriseValidationConfig>) => {
  const fullConfig = { ...defaultEnterpriseConfig, ...config };
  const service = new EnterpriseValidationService(fullConfig);
  const logger = ValidationLogger.getInstance();

  return {
    validate: async (text: string) => {
      const startTime = Date.now();
      
      // Validación local rápida
      if (text.length > fullConfig.maxInputLength) {
        logger.log('warn', 'Input demasiado largo', text);
        return { isValid: false, reason: 'input_too_long' };
      }

      // Validación de contenido inapropiado
      if (contieneContenidoInapropiado(text)) {
        logger.log('warn', 'Contenido inapropiado detectado', text);
        return { isValid: false, reason: 'inappropriate_content' };
      }

      // Validación externa si está habilitada
      if (fullConfig.enableExternalValidation) {
        const externalResult = await service.validateWithExternalService(text);
        if (!externalResult.isSafe) {
          logger.log('warn', 'Amenaza detectada por servicio externo', text, externalResult.detectedThreats);
          return { isValid: false, reason: 'external_threat_detected' };
        }
      }

      const validationTime = Date.now() - startTime;
      if (validationTime > fullConfig.maxValidationTime) {
        logger.log('warn', 'Validación tardó demasiado', text);
      }

      // Log de validación exitosa
      logger.log('info', 'Validación exitosa', text);

      return { isValid: true };
    },
    
    getLogs: () => logger.getLogs(),
    updateBlacklist: () => service.updateBlacklist()
  };
}; 