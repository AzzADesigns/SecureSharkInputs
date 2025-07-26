import { 
  SecureSharkBackend, 
  createBackendValidator, 
  validateInput, 
  validateForm,
  BackendValidatorConfig 
} from '../backend/secureSharkBackend';

describe('SecureSharkInputs Backend', () => {
  let validator: SecureSharkBackend;

  beforeEach(() => {
    validator = new SecureSharkBackend({
      enableSanitization: true,
      logThreats: false // Deshabilitar logs en tests
    });
  });

  describe('validateInput', () => {
    it('should validate safe input', async () => {
      const result = await validator.validateInput('Hello world');
      
      expect(result.isValid).toBe(true);
      expect(result.threats).toEqual([]);
      expect(result.severity).toBe('low');
      expect(result.sanitizedValue).toBe('Hello world');
    });

    it('should detect XSS attacks', async () => {
      const result = await validator.validateInput('<script>alert("xss")</script>');
      
      expect(result.isValid).toBe(false);
      expect(result.threats).toContain('XSS attack detected');
      expect(result.severity).toBe('critical');
      expect(result.recommendations).toContain('Avoid using script tags and special characters');
    });

    it('should detect SQL injection', async () => {
      const result = await validator.validateInput("'; DROP TABLE users; --");
      
      expect(result.isValid).toBe(false);
      expect(result.threats).toContain('SQL injection detected');
      expect(result.severity).toBe('critical');
    });

    it('should detect data theft attempts', async () => {
      const result = await validator.validateInput('document.cookie');
      
      expect(result.isValid).toBe(false);
      expect(result.threats).toContain('Data theft attempt detected');
      expect(result.severity).toBe('high');
    });

    it('should handle empty input', async () => {
      const result = await validator.validateInput('');
      
      expect(result.isValid).toBe(true);
      expect(result.threats).toEqual([]);
    });

    it('should handle null/undefined input', async () => {
      const result = await validator.validateInput(null as any);
      
      expect(result.isValid).toBe(false);
      expect(result.threats).toContain('Invalid input type');
      expect(result.severity).toBe('high');
    });

    it('should respect maxInputLength', async () => {
      const longInput = 'a'.repeat(1001);
      const result = await validator.validateInput(longInput);
      
      expect(result.isValid).toBe(false);
      expect(result.threats).toContain('Input too long');
      expect(result.severity).toBe('medium');
    });

    it('should sanitize input when enabled', async () => {
      const input = '<script>alert("xss")</script>Hello world';
      const result = await validator.validateInput(input);
      
      expect(result.isValid).toBe(false); // Debería detectar XSS
      expect(result.threats).toContain('XSS attack detected');
    });
  });

  describe('validateForm', () => {
    it('should validate form with all safe inputs', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world'
      };

      const result = await validator.validateForm(formData);
      
      expect(result.isValid).toBe(true);
      expect(result.overallThreats).toEqual([]);
      expect(Object.keys(result.fields)).toEqual(['name', 'email', 'message']);
      
      for (const field of Object.values(result.fields)) {
        expect(field.isValid).toBe(true);
      }
    });

    it('should detect threats in form', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: '<script>alert("xss")</script>'
      };

      const result = await validator.validateForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.overallThreats).toContain('XSS attack detected');
      expect(result.fields.message.isValid).toBe(false);
      expect(result.fields.name.isValid).toBe(true);
      expect(result.fields.email.isValid).toBe(true);
    });

    it('should handle multiple threats in form', async () => {
      const formData = {
        name: 'John<script>alert("xss")</script>',
        email: 'john@example.com',
        message: "'; DROP TABLE users; --"
      };

      const result = await validator.validateForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.overallThreats).toContain('XSS attack detected');
      expect(result.overallThreats).toContain('SQL injection detected');
      expect(result.fields.name.isValid).toBe(false);
      expect(result.fields.message.isValid).toBe(false);
    });
  });

  describe('Express Middleware', () => {
    it('should create express middleware', () => {
      const middleware = validator.createExpressMiddleware('message');
      
      expect(typeof middleware).toBe('function');
      expect(middleware.length).toBe(3); // req, res, next
    });

    it('should handle valid input in middleware', async () => {
      const middleware = validator.createExpressMiddleware('message');
      const req = { body: { message: 'Hello world' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle invalid input in middleware', async () => {
      const middleware = validator.createExpressMiddleware('message');
      const req = { body: { message: '<script>alert("xss")</script>' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          isValid: false,
          threats: expect.arrayContaining(['XSS attack detected'])
        })
      });
    });

    it('should sanitize input in middleware', async () => {
      const middleware = validator.createExpressMiddleware('message');
      const req = { body: { message: 'Hello<script>alert("xss")</script>world' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Fastify Middleware', () => {
    it('should create fastify middleware', () => {
      const middleware = validator.createFastifyMiddleware('message');
      
      expect(typeof middleware).toBe('function');
    });

    it('should handle valid input in fastify middleware', async () => {
      const middleware = validator.createFastifyMiddleware('message');
      const request = { body: { message: 'Hello world' } };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await middleware(request, reply);

      expect(reply.status).not.toHaveBeenCalled();
    });

    it('should handle invalid input in fastify middleware', async () => {
      const middleware = validator.createFastifyMiddleware('message');
      const request = { body: { message: '<script>alert("xss")</script>' } };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await middleware(request, reply);

      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.objectContaining({
          isValid: false,
          threats: expect.arrayContaining(['XSS attack detected'])
        })
      });
    });
  });

  describe('Custom Sanitizers', () => {
    it('should use custom sanitizers', async () => {
      const customValidator = new SecureSharkBackend({
        enableSanitization: true,
        customSanitizers: {
          email: (value) => value.toLowerCase().trim(),
          name: (value) => value.replace(/[^\w\s]/g, '').trim()
        }
      });

      const result = await customValidator.validateInput('JOHN@EXAMPLE.COM', 'email');
      
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('john@example.com');
    });
  });

  describe('Severity Calculation', () => {
    it('should calculate critical severity for XSS', async () => {
      const result = await validator.validateInput('<script>alert("xss")</script>');
      expect(result.severity).toBe('critical');
    });

    it('should calculate critical severity for SQL injection', async () => {
      const result = await validator.validateInput("'; DROP TABLE users; --");
      expect(result.severity).toBe('critical');
    });

    it('should calculate high severity for data theft', async () => {
      const result = await validator.validateInput('document.cookie');
      expect(result.severity).toBe('high');
    });

    it('should calculate medium severity for long input', async () => {
      const result = await validator.validateInput('a'.repeat(1001));
      expect(result.severity).toBe('medium');
    });

    it('should calculate low severity for safe input', async () => {
      const result = await validator.validateInput('Hello world');
      expect(result.severity).toBe('low');
    });
  });

  describe('Convenience Functions', () => {
    it('should work with createBackendValidator', () => {
      const validator = createBackendValidator({
        enableSanitization: true
      });
      
      expect(validator).toBeInstanceOf(SecureSharkBackend);
    });

    it('should work with validateInput function', async () => {
      const result = await validateInput('Hello world');
      
      expect(result.isValid).toBe(true);
      expect(result.threats).toEqual([]);
    });

    it('should work with validateForm function', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const result = await validateForm(formData);
      
      expect(result.isValid).toBe(true);
      expect(result.fields.name.isValid).toBe(true);
      expect(result.fields.email.isValid).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      // Mock validator to throw error
      const mockValidator = {
        validate: jest.fn().mockRejectedValue(new Error('Validation error'))
      };

      const validator = new SecureSharkBackend();
      (validator as any).validator = mockValidator;

      const result = await validator.validateInput('test');
      
      expect(result.isValid).toBe(false);
      expect(result.threats).toContain('Validation error');
      expect(result.severity).toBe('critical');
    });
  });

  describe('Configuration', () => {
    it('should use default configuration', () => {
      const validator = new SecureSharkBackend();
      
      expect(validator).toBeInstanceOf(SecureSharkBackend);
    });

    it('should use custom configuration', () => {
      const config: BackendValidatorConfig = {
        maxInputLength: 500,
        enableSanitization: false,
        logThreats: true
      };

      const validator = new SecureSharkBackend(config);
      
      expect(validator).toBeInstanceOf(SecureSharkBackend);
    });
  });
}); 