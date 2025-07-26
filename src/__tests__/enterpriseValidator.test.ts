import { 
  createEnterpriseValidator, 
  ValidationLogger,
  EnterpriseValidationService,
  type EnterpriseValidationConfig 
} from '../services/enterpriseValidator';

describe('Enterprise Validator', () => {
  let validator: ReturnType<typeof createEnterpriseValidator>;
  let logger: ValidationLogger;

  beforeEach(() => {
    validator = createEnterpriseValidator({
      enableExternalValidation: false,
      enableLogging: true,
      maxInputLength: 1000
    });
    logger = ValidationLogger.getInstance();
    logger.clearLogs();
  });

  describe('createEnterpriseValidator', () => {
    it('should create validator with default config', () => {
      const defaultValidator = createEnterpriseValidator();
      expect(defaultValidator).toBeDefined();
      expect(typeof defaultValidator.validate).toBe('function');
    });

    it('should create validator with custom config', () => {
      const customConfig: Partial<EnterpriseValidationConfig> = {
        maxInputLength: 2000,
        enableLogging: false
      };
      const customValidator = createEnterpriseValidator(customConfig);
      expect(customValidator).toBeDefined();
    });
  });

  describe('validator.validate', () => {
    it('should validate safe input', async () => {
      const result = await validator.validate('Hello world');
      expect(result.isValid).toBe(true);
    });

    it('should reject input that is too long', async () => {
      const longInput = 'a'.repeat(1001);
      const result = await validator.validate(longInput);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('input_too_long');
    });

    it('should reject XSS attempts', async () => {
      const xssInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src=x onerror=alert(1)>',
        '&#x3c;script&#x3e;alert("xss")&#x3c;/script&#x3e;'
      ];

      for (const input of xssInputs) {
        const result = await validator.validate(input);
        expect(result.isValid).toBe(false);
      }
    });

    it('should reject SQL injection attempts', async () => {
      const sqlInputs = [
        'SELECT * FROM users',
        'DROP TABLE users',
        '1=1 OR 1=1',
        'UNION SELECT * FROM users'
      ];

      for (const input of sqlInputs) {
        const result = await validator.validate(input);
        expect(result.isValid).toBe(false);
      }
    });

    it('should reject data theft attempts', async () => {
      const theftInputs = [
        'document.cookie',
        'localStorage.getItem',
        'sessionStorage.getItem',
        'window.localStorage'
      ];

      for (const input of theftInputs) {
        const result = await validator.validate(input);
        expect(result.isValid).toBe(false);
      }
    });

    it('should reject inappropriate content', async () => {
      const inappropriateInputs = [
        'puta',
        'mierda',
        'fuck',
        'shit'
      ];

      for (const input of inappropriateInputs) {
        const result = await validator.validate(input);
        expect(result.isValid).toBe(false);
      }
    });
  });

  describe('validator.getLogs', () => {
    it('should return logs after validation', async () => {
      await validator.validate('test input');
      const logs = validator.getLogs();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeGreaterThan(0);
    });
  });

  describe('validator.updateBlacklist', () => {
    it('should update blacklist when enabled', async () => {
      const validatorWithUpdate = createEnterpriseValidator({
        enableAutoUpdate: true
      });
      
      await expect(validatorWithUpdate.updateBlacklist()).resolves.not.toThrow();
    });

    it('should not update blacklist when disabled', async () => {
      const validatorWithoutUpdate = createEnterpriseValidator({
        enableAutoUpdate: false
      });
      
      await expect(validatorWithoutUpdate.updateBlacklist()).resolves.not.toThrow();
    });
  });

  describe('ValidationLogger', () => {
    it('should log messages correctly', () => {
      const testMessage = 'Test log message';
      const testInput = 'test input';
      const testThreats = ['xss', 'sql'];

      logger.log('info', testMessage, testInput, testThreats);
      
      const logs = logger.getLogs();
      const lastLog = logs[logs.length - 1];
      
      expect(lastLog.message).toBe(testMessage);
      expect(lastLog.input).toBe(testInput);
      expect(lastLog.detectedThreats).toEqual(testThreats);
      expect(lastLog.level).toBe('info');
    });

    it('should clear logs', () => {
      logger.log('info', 'test message');
      expect(logger.getLogs().length).toBeGreaterThan(0);
      
      logger.clearLogs();
      expect(logger.getLogs().length).toBe(0);
    });

    it('should truncate long input for privacy', () => {
      const longInput = 'a'.repeat(200);
      logger.log('info', 'test', longInput);
      
      const logs = logger.getLogs();
      const lastLog = logs[logs.length - 1];
      
      expect(lastLog.input!.length).toBeLessThanOrEqual(100);
    });
  });

  describe('EnterpriseValidationService', () => {
    it('should validate with external service when enabled', async () => {
      const service = new EnterpriseValidationService({
        enableExternalValidation: true,
        enableLogging: true,
        logLevel: 'warn',
        maxInputLength: 1000,
        maxValidationTime: 5000,
        allowedEmailDomains: ['company.com'],
        enableAutoUpdate: false,
        updateInterval: 30
      });
      
      const result = await service.validateWithExternalService('test input');
      expect(result).toHaveProperty('isSafe');
      expect(result).toHaveProperty('threatLevel');
      expect(result).toHaveProperty('detectedThreats');
    });

    it('should skip external validation when disabled', async () => {
      const service = new EnterpriseValidationService({
        enableExternalValidation: false,
        enableLogging: true,
        logLevel: 'warn',
        maxInputLength: 1000,
        maxValidationTime: 5000,
        allowedEmailDomains: ['company.com'],
        enableAutoUpdate: false,
        updateInterval: 30
      });
      
      const result = await service.validateWithExternalService('test input');
      expect(result.isSafe).toBe(true);
      expect(result.threatLevel).toBe(0);
      expect(result.detectedThreats).toEqual([]);
    });
  });
}); 