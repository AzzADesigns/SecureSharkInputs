import React, { useEffect, useState } from 'react';
import { createEnterpriseValidator } from '../services/enterpriseValidator';

interface SimpleValidationSharkProps {
  for?: string;
  maxLength?: number;
  onValid?: () => void;
  onInvalid?: () => void;
}

interface ValidationState {
  isValid: boolean;
  message: string;
  isVisible: boolean;
}

export const SimpleValidationShark: React.FC<SimpleValidationSharkProps> = ({
  for: inputId,
  maxLength = 1000,
  onValid,
  onInvalid
}) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    message: '',
    isVisible: false
  });

  useEffect(() => {
    const input = inputId
      ? document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement
      : document.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;

    if (!input) {
      console.warn('SimpleValidationShark: No se encontró ningún input para validar');
      return;
    }

    const validator = createEnterpriseValidator({
      maxInputLength: maxLength,
      enableLogging: false
    });

    const validateInput = async (value: string) => {
      if (!value.trim()) {
        setValidationState({
          isValid: true,
          message: '',
          isVisible: false
        });
        return;
      }

      try {
        const result = await validator.validate(value);
        
        if (result.isValid) {
          setValidationState({
            isValid: true,
            message: '✅ Válido',
            isVisible: true
          });
          onValid?.();
        } else {
          setValidationState({
            isValid: false,
            message: '❌ No permitido',
            isVisible: true
          });
          onInvalid?.();
        }
      } catch (error) {
        console.error('Error de validación:', error);
        setValidationState({
          isValid: false,
          message: '❌ Error de validación',
          isVisible: true
        });
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      validateInput(target.value);
    };

    const handleBlur = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.value.trim()) {
        validateInput(target.value);
      }
    };

    input.addEventListener('input', handleInput);
    input.addEventListener('blur', handleBlur);

    return () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('blur', handleBlur);
    };
  }, [inputId, maxLength, onValid, onInvalid]);

  if (!validationState.isVisible) {
    return null;
  }

  return (
    <div
      style={{
        fontSize: '12px',
        marginTop: '4px',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: validationState.isValid ? '#d4edda' : '#f8d7da',
        color: validationState.isValid ? '#155724' : '#721c24',
        border: `1px solid ${validationState.isValid ? '#c3e6cb' : '#f5c6cb'}`,
        display: 'inline-block'
      }}
    >
      {validationState.message}
    </div>
  );
};

// Exportar como ValidationShark para compatibilidad
export const ValidationShark: React.FC = () => <SimpleValidationShark />;

export default SimpleValidationShark; 