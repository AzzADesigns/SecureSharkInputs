import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ValidationShark, SimpleValidationShark } from '../components/ValidationShark';
import { useSharkValidation } from '../hooks/useSharkValidation';

// Mock del DOM para simular el entorno del navegador
const mockInput = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  value: '',
  id: 'test-input',
  closest: jest.fn(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    querySelector: jest.fn(() => ({
      setAttribute: jest.fn(),
      removeAttribute: jest.fn()
    }))
  }))
};

// Mock de document.querySelector
Object.defineProperty(document, 'querySelector', {
  value: jest.fn(() => mockInput),
  writable: true
});

// Mock de document.getElementById
Object.defineProperty(document, 'getElementById', {
  value: jest.fn(() => mockInput),
  writable: true
});

describe('ValidationShark Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInput.value = '';
  });

  describe('SimpleValidationShark', () => {
    it('should render nothing when no input is found', () => {
      (document.querySelector as jest.Mock).mockReturnValue(null);
      
      const { container } = render(<SimpleValidationShark />);
      expect(container.firstChild).toBeNull();
    });

    it('should connect to input automatically', () => {
      render(<SimpleValidationShark />);
      
      expect(document.querySelector).toHaveBeenCalledWith('input, textarea');
      expect(mockInput.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
      expect(mockInput.addEventListener).toHaveBeenCalledWith('blur', expect.any(Function));
    });

    it('should connect to specific input by ID', () => {
      render(<SimpleValidationShark for="my-input" />);
      
      expect(document.getElementById).toHaveBeenCalledWith('my-input');
    });

    it('should validate input on change', async () => {
      const onValid = jest.fn();
      const onInvalid = jest.fn();
      
      render(<SimpleValidationShark onValid={onValid} onInvalid={onInvalid} />);
      
      // Simular input event
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      // Test safe input
      mockInput.value = 'Hello world';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(screen.getByText('✅ Válido')).toBeInTheDocument();
      });
    });

    it('should show error for malicious input', async () => {
      const onInvalid = jest.fn();
      
      render(<SimpleValidationShark onInvalid={onInvalid} />);
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      // Test XSS input
      mockInput.value = '<script>alert("xss")</script>';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(screen.getByText('❌ No permitido')).toBeInTheDocument();
      });
    });
  });

  describe('ValidationShark (Advanced)', () => {
    it('should render with custom messages', async () => {
      const messages = {
        valid: '✅ Perfecto!',
        invalid: '❌ No permitido',
        xss: '🚨 XSS detectado'
      };
      
      render(<ValidationShark messages={messages} />);
      
      // Simular input event
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      mockInput.value = 'Hello world';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(screen.getByText('✅ Perfecto!')).toBeInTheDocument();
      });
    });

    it('should block form when malicious content is detected', async () => {
      const mockForm = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
        querySelector: jest.fn(() => ({
          setAttribute: jest.fn(),
          removeAttribute: jest.fn()
        }))
      };
      
      mockInput.closest.mockReturnValue(mockForm);
      
      render(<ValidationShark blockForm={true} />);
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      // Test malicious input
      mockInput.value = '<script>alert("xss")</script>';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(mockForm.addEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
        expect(mockForm.setAttribute).toHaveBeenCalledWith('data-validation-blocked', 'true');
      });
    });

    it('should unblock form when input becomes valid', async () => {
      const mockForm = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
        querySelector: jest.fn(() => ({
          setAttribute: jest.fn(),
          removeAttribute: jest.fn()
        }))
      };
      
      mockInput.closest.mockReturnValue(mockForm);
      
      render(<ValidationShark blockForm={true} />);
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      // First: malicious input
      mockInput.value = '<script>alert("xss")</script>';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(mockForm.addEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
      });
      
      // Then: safe input
      mockInput.value = 'Hello world';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(mockForm.removeEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
        expect(mockForm.removeAttribute).toHaveBeenCalledWith('data-validation-blocked');
      });
    });

    it('should show messages when showMessages is true', async () => {
      render(<ValidationShark showMessages={true} />);
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      mockInput.value = 'Hello world';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(screen.getByText('✅ Válido')).toBeInTheDocument();
      });
    });

    it('should not show messages when showMessages is false', async () => {
      render(<ValidationShark showMessages={false} />);
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      mockInput.value = 'Hello world';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(screen.queryByText('✅ Válido')).not.toBeInTheDocument();
      });
    });

    it('should call onValid callback when input is valid', async () => {
      const onValid = jest.fn();
      
      render(<ValidationShark onValid={onValid} />);
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      mockInput.value = 'Hello world';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(onValid).toHaveBeenCalled();
      });
    });

    it('should call onInvalid callback when input is malicious', async () => {
      const onInvalid = jest.fn();
      
      render(<ValidationShark onInvalid={onInvalid} />);
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      mockInput.value = '<script>alert("xss")</script>';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(onInvalid).toHaveBeenCalled();
      });
    });
  });

  describe('useSharkValidation Hook', () => {
    it('should provide validation functions', () => {
      const TestComponent = () => {
        const { validate, validateSync } = useSharkValidation();
        
        expect(typeof validate).toBe('function');
        expect(typeof validateSync).toBe('function');
        
        return <div>Test</div>;
      };
      
      render(<TestComponent />);
    });

    it('should validate text correctly', async () => {
      const TestComponent = () => {
        const { validate } = useSharkValidation();
        
        const testValidation = async () => {
          const result = await validate('Hello world');
          expect(result.isValid).toBe(true);
        };
        
        testValidation();
        return <div>Test</div>;
      };
      
      render(<TestComponent />);
    });

    it('should detect malicious content', async () => {
      const TestComponent = () => {
        const { validate } = useSharkValidation();
        
        const testValidation = async () => {
          const result = await validate('<script>alert("xss")</script>');
          expect(result.isValid).toBe(false);
        };
        
        testValidation();
        return <div>Test</div>;
      };
      
      render(<TestComponent />);
    });
  });

  describe('Form Integration', () => {
    it('should work with react-hook-form', async () => {
      const TestComponent = () => {
        const { register, handleSubmit } = require('react-hook-form');
        
        const onSubmit = (data: any) => {
          console.log('Form submitted:', data);
        };
        
        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-field">
              <input id="name" {...register('name')} />
              <ValidationShark />
            </div>
          </form>
        );
      };
      
      render(<TestComponent />);
      
      // Verify that ValidationShark is rendered
      expect(document.querySelector).toHaveBeenCalled();
    });
  });
}); 