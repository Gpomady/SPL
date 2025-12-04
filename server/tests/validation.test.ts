import { describe, it, expect } from 'vitest';
import { 
  validateCNPJ, 
  formatCNPJ, 
  sanitizeInput,
  emailSchema,
  passwordSchema,
  cnpjSchema,
  cnaeSchema,
} from '../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateCNPJ', () => {
    it('should validate correct CNPJ', () => {
      expect(validateCNPJ('11222333000181')).toBe(true);
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    });

    it('should reject invalid CNPJ', () => {
      expect(validateCNPJ('12345678901234')).toBe(false);
      expect(validateCNPJ('00000000000000')).toBe(false);
      expect(validateCNPJ('11111111111111')).toBe(false);
      expect(validateCNPJ('123')).toBe(false);
    });

    it('should reject CNPJ with wrong length', () => {
      expect(validateCNPJ('123456789012')).toBe(false);
      expect(validateCNPJ('1234567890123456')).toBe(false);
    });
  });

  describe('formatCNPJ', () => {
    it('should format CNPJ correctly', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    });

    it('should handle already formatted CNPJ', () => {
      expect(formatCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
    });

    it('should escape special characters', () => {
      expect(sanitizeInput('Test & Demo')).toBe('Test &amp; Demo');
      expect(sanitizeInput('5 < 10')).toBe('5 &lt; 10');
      expect(sanitizeInput('10 > 5')).toBe('10 &gt; 5');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });
  });

  describe('Zod Schemas', () => {
    describe('emailSchema', () => {
      it('should validate correct emails', () => {
        expect(() => emailSchema.parse('test@example.com')).not.toThrow();
        expect(() => emailSchema.parse('user.name@domain.co.uk')).not.toThrow();
      });

      it('should reject invalid emails', () => {
        expect(() => emailSchema.parse('invalid')).toThrow();
        expect(() => emailSchema.parse('missing@domain')).toThrow();
      });
    });

    describe('passwordSchema', () => {
      it('should validate strong passwords', () => {
        expect(() => passwordSchema.parse('StrongPass1')).not.toThrow();
        expect(() => passwordSchema.parse('MyPassword123')).not.toThrow();
      });

      it('should reject weak passwords', () => {
        expect(() => passwordSchema.parse('weak')).toThrow();
        expect(() => passwordSchema.parse('alllowercase1')).toThrow();
        expect(() => passwordSchema.parse('ALLUPPERCASE1')).toThrow();
        expect(() => passwordSchema.parse('NoNumbers')).toThrow();
      });
    });

    describe('cnpjSchema', () => {
      it('should accept valid CNPJ formats', () => {
        expect(cnpjSchema.parse('11222333000181')).toBe('11222333000181');
        expect(cnpjSchema.parse('11.222.333/0001-81')).toBe('11222333000181');
      });

      it('should reject invalid CNPJ formats', () => {
        expect(() => cnpjSchema.parse('123')).toThrow();
        expect(() => cnpjSchema.parse('abc')).toThrow();
      });
    });

    describe('cnaeSchema', () => {
      it('should accept valid CNAE formats', () => {
        expect(cnaeSchema.parse('0111301')).toBe('0111301');
        expect(cnaeSchema.parse('0111-3/01')).toBe('0111301');
      });

      it('should reject invalid CNAE formats', () => {
        expect(() => cnaeSchema.parse('123')).toThrow();
        expect(() => cnaeSchema.parse('abc')).toThrow();
      });
    });
  });
});
