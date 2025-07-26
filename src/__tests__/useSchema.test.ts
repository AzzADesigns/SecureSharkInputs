import { entryFormSchema } from '../schemas/useSchema';

describe('Entry Form Schema', () => {
  const validFormData = {
    email: 'user@company.com',
    age: 25,
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    country: 'United States',
    role: 'Developer',
    linkedin: 'https://linkedin.com/in/johndoe',
    expectations: 'I want to contribute to innovative projects and learn new technologies. I am passionate about creating high-quality software solutions.'
  };

  describe('email validation', () => {
    it('should reject invalid email format', async () => {
      const data = { ...validFormData, email: 'invalid-email' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });

    it('should reject email with XSS', async () => {
      const data = { ...validFormData, email: 'user<script>alert("xss")</script>@company.com' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('age validation', () => {
    it('should reject age below minimum', async () => {
      const data = { ...validFormData, age: 11 };
      await expect(entryFormSchema.validate(data)).rejects.toThrow('Debés tener al menos 12 años');
    });

    it('should reject age above maximum', async () => {
      const data = { ...validFormData, age: 101 };
      await expect(entryFormSchema.validate(data)).rejects.toThrow('Edad no válida');
    });
  });

  describe('name validation', () => {
    it('should reject names with special characters', async () => {
      const data = { ...validFormData, firstName: 'John<script>' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });

    it('should reject names with inappropriate content', async () => {
      const data = { ...validFormData, firstName: 'puta' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('phone validation', () => {
    it('should reject invalid phone format', async () => {
      const data = { ...validFormData, phone: 'invalid-phone' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('country validation', () => {
    it('should require otherCountry when country is "Otra"', async () => {
      const data = { ...validFormData, country: 'Otra' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow('Especifica el país');
    });
  });

  describe('role validation', () => {
    it('should reject role with XSS', async () => {
      const data = { ...validFormData, role: 'Developer<script>' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('stack validation', () => {
    it('should reject stack with single character items', async () => {
      const data = { ...validFormData, stack: 'R, T, N' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('experience validation', () => {
    it('should reject experience that is too long', async () => {
      const data = { ...validFormData, experience: 'a'.repeat(51) };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('linkedin validation', () => {
    it('should reject invalid LinkedIn URL', async () => {
      const data = { ...validFormData, linkedin: 'https://invalid.com/profile' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('github validation', () => {
    it('should reject invalid GitHub URL', async () => {
      const data = { ...validFormData, github: 'https://invalid.com/johndoe' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('behance validation', () => {
    it('should reject invalid Behance URL', async () => {
      const data = { ...validFormData, behance: 'https://invalid.com/johndoe' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('website validation', () => {
    it('should reject invalid website URL', async () => {
      const data = { ...validFormData, website: 'invalid-url' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('expectations validation', () => {
    it('should reject expectations that are too short', async () => {
      const data = { ...validFormData, expectations: 'Too short' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });

    it('should reject expectations that are too long', async () => {
      const data = { ...validFormData, expectations: 'a'.repeat(501) };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });

    it('should reject expectations with XSS', async () => {
      const data = { 
        ...validFormData, 
        expectations: 'I want to contribute<script>alert("xss")</script> to projects.' 
      };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });

  describe('security validation', () => {
    it('should reject SQL injection attempts', async () => {
      const data = { ...validFormData, expectations: 'I want to SELECT * FROM users' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });

    it('should reject data theft attempts', async () => {
      const data = { ...validFormData, expectations: 'I want to access document.cookie' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });

    it('should reject inappropriate content', async () => {
      const data = { ...validFormData, expectations: 'I want to contribute puta to projects' };
      await expect(entryFormSchema.validate(data)).rejects.toThrow();
    });
  });
}); 