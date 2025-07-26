import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ValidationShark, SimpleValidationShark } from '../components/ValidationShark';
import { useSharkValidation } from '../hooks/useSharkValidation';

// Mock del DOM para simular el entorno del navegador
const mockInput = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  value: '',
  id: 'test-input'
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
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      mockInput.value = 'Hello world';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(screen.getByText('✅ Perfecto!')).toBeInTheDocument();
      });
    });

    it('should call onValid callback', async () => {
      const onValid = jest.fn();
      
      render(<ValidationShark onValid={onValid} />);
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      mockInput.value = 'Safe input';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(onValid).toHaveBeenCalledWith('Safe input');
      });
    });

    it('should call onInvalid callback', async () => {
      const onInvalid = jest.fn();
      
      render(<ValidationShark onInvalid={onInvalid} />);
      
      const inputHandler = mockInput.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];
      
      mockInput.value = '<script>alert("xss")</script>';
      inputHandler({ target: mockInput });
      
      await waitFor(() => {
        expect(onInvalid).toHaveBeenCalledWith('<script>alert("xss")</script>', expect.any(String));
      });
    });
  });
});

describe('useSharkValidation Hook', () => {
  it('should validate text correctly', async () => {
    const TestComponent = () => {
      const { validate, validateSync } = useSharkValidation();
      const [result, setResult] = React.useState('');
      
      React.useEffect(() => {
        const testValidation = async () => {
          const asyncResult = await validate('Hello world');
          const syncResult = validateSync('Hello world');
          setResult(`${asyncResult.isValid}-${syncResult.isValid}`);
        };
        testValidation();
      }, [validate, validateSync]);
      
      return <div data-testid="result">{result}</div>;
    };
    
    render(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('true-true');
    });
  });

  it('should reject malicious content', async () => {
    const TestComponent = () => {
      const { validate, validateSync } = useSharkValidation();
      const [result, setResult] = React.useState('');
      
      React.useEffect(() => {
        const testValidation = async () => {
          const asyncResult = await validate('<script>alert("xss")</script>');
          const syncResult = validateSync('<script>alert("xss")</script>');
          setResult(`${asyncResult.isValid}-${syncResult.isValid}`);
        };
        testValidation();
      }, [validate, validateSync]);
      
      return <div data-testid="result">{result}</div>;
    };
    
    render(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('false-false');
    });
  });

  it('should validate form data', async () => {
    const TestComponent = () => {
      const { validateForm } = useSharkValidation();
      const [result, setResult] = React.useState('');
      
      React.useEffect(() => {
        const testFormValidation = async () => {
          const formData = {
            name: 'John Doe',
            email: 'john@example.com',
            message: '<script>alert("xss")</script>'
          };
          
          const validationResult = await validateForm(formData);
          setResult(validationResult.isValid.toString());
        };
        testFormValidation();
      }, [validateForm]);
      
      return <div data-testid="result">{result}</div>;
    };
    
    render(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('false');
    });
  });
}); 