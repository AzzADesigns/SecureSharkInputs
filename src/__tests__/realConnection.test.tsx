import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ValidationShark, { useSharkValidation } from '../components/ValidationShark';

// Mock del DOM para simular inputs reales
const createMockInput = (id: string, value: string = '') => {
  const input = document.createElement('input');
  input.id = id;
  input.value = value;
  input.addEventListener = jest.fn();
  input.removeEventListener = jest.fn();
  return input;
};

// Mock de document.querySelector y getElementById
const mockInputs = {
  'name-input': createMockInput('name-input'),
  'email-input': createMockInput('email-input'),
  'message-input': createMockInput('message-input')
};

Object.defineProperty(document, 'querySelector', {
  value: jest.fn((selector) => {
    if (selector === 'input, textarea') {
      return mockInputs['name-input'];
    }
    return null;
  }),
  writable: true
});

Object.defineProperty(document, 'getElementById', {
  value: jest.fn((id) => mockInputs[id] || null),
  writable: true
});

describe('Real Connection Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Resetear valores de inputs
    Object.values(mockInputs).forEach(input => {
      input.value = '';
    });
  });

  describe('ValidationShark Component Connection', () => {
    it('should connect to real input and validate in real-time', async () => {
      const TestComponent = () => (
        <div>
          <input id="name-input" type="text" />
          <ValidationShark for="name-input" />
        </div>
      );

      render(<TestComponent />);

      // Simular input event
      const input = mockInputs['name-input'];
      const inputHandler = input.addEventListener.mock.calls.find(
        call => call[0] === 'input'
      )[1];

      // Test input seguro
      input.value = 'John Doe';
      inputHandler({ target: input });

      await waitFor(() => {
        expect(screen.getByText('✅ Válido')).toBeInTheDocument();
      });

      // Test input malicioso
      input.value = '<script>alert("xss")</script>';
      inputHandler({ target: input });

      await waitFor(() => {
        expect(screen.getByText('❌ No permitido')).toBeInTheDocument();
      });
    });

    it('should automatically find nearest input', async () => {
      const TestComponent = () => (
        <div>
          <input type="text" />
          <ValidationShark />
        </div>
      );

      render(<TestComponent />);

      // Verificar que se conectó al input más cercano
      expect(document.querySelector).toHaveBeenCalledWith('input, textarea');
      expect(mockInputs['name-input'].addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
    });

    it('should handle multiple inputs with specific IDs', async () => {
      const TestComponent = () => (
        <div>
          <input id="email-input" type="email" />
          <ValidationShark for="email-input" />
          <textarea id="message-input" />
          <ValidationShark for="message-input" />
        </div>
      );

      render(<TestComponent />);

      // Verificar que se conectó a los inputs específicos
      expect(document.getElementById).toHaveBeenCalledWith('email-input');
      expect(document.getElementById).toHaveBeenCalledWith('message-input');
    });
  });

  describe('Real-time Validation', () => {
    it('should validate on input change', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        
        return (
          <div>
            <input 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              data-testid="test-input"
            />
            <ValidationShark />
          </div>
        );
      };

      render(<TestComponent />);

      const input = screen.getByTestId('test-input');

      // Test input seguro
      fireEvent.change(input, { target: { value: 'Hello world' } });
      
      await waitFor(() => {
        expect(screen.getByText('✅ Válido')).toBeInTheDocument();
      });

      // Test input malicioso
      fireEvent.change(input, { target: { value: 'SELECT * FROM users' } });
      
      await waitFor(() => {
        expect(screen.getByText('❌ No permitido')).toBeInTheDocument();
      });
    });

    it('should validate on blur', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        
        return (
          <div>
            <input 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => {}}
              data-testid="test-input"
            />
            <ValidationShark />
          </div>
        );
      };

      render(<TestComponent />);

      const input = screen.getByTestId('test-input');

      // Escribir y hacer blur
      fireEvent.change(input, { target: { value: 'document.cookie' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText('❌ No permitido')).toBeInTheDocument();
      });
    });
  });

  describe('Hook Connection', () => {
    it('should validate programmatically with hook', async () => {
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

    it('should validate form data with hook', async () => {
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

  describe('Connection Verification', () => {
    it('should verify that inputs are actually protected', async () => {
      // Simular un formulario real
      const RealForm = () => {
        const [formData, setFormData] = React.useState({
          name: '',
          email: '',
          message: ''
        });

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        return (
          <form data-testid="real-form">
            <div>
              <label>Nombre:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                data-testid="name-input"
              />
              <ValidationShark />
            </div>
            
            <div>
              <label>Email:</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                data-testid="email-input"
              />
              <ValidationShark />
            </div>
            
            <div>
              <label>Mensaje:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                data-testid="message-input"
              />
              <ValidationShark />
            </div>
          </form>
        );
      };

      render(<RealForm />);

      // Verificar que todos los inputs están conectados
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');

      // Test que los inputs están protegidos
      fireEvent.change(nameInput, { target: { value: '<script>alert("xss")</script>' } });
      fireEvent.change(emailInput, { target: { value: 'SELECT * FROM users' } });
      fireEvent.change(messageInput, { target: { value: 'document.cookie' } });

      await waitFor(() => {
        // Deberían aparecer múltiples mensajes de error
        const errorMessages = screen.getAllByText('❌ No permitido');
        expect(errorMessages.length).toBeGreaterThan(0);
      });

      // Test que inputs seguros pasan
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Hello world' } });

      await waitFor(() => {
        const validMessages = screen.getAllByText('✅ Válido');
        expect(validMessages.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing inputs gracefully', () => {
      const TestComponent = () => (
        <div>
          <ValidationShark for="non-existent-input" />
        </div>
      );

      // No debería lanzar error
      expect(() => render(<TestComponent />)).not.toThrow();
    });

    it('should handle validation errors', async () => {
      const TestComponent = () => {
        const { validate } = useSharkValidation();
        const [error, setError] = React.useState('');

        React.useEffect(() => {
          const testError = async () => {
            try {
              await validate('');
            } catch (err) {
              setError('Error handled');
            }
          };
          testError();
        }, [validate]);

        return <div data-testid="error">{error}</div>;
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Error handled');
      });
    });
  });
}); 