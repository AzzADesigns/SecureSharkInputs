import React, { useEffect, useRef, useState } from 'react';
import { createEnterpriseValidator } from '../services/enterpriseValidator';

interface ValidationSharkProps {
  inputId?: string;
  config?: any;
  onValid?: () => void;
  onInvalid?: () => void;
  className?: string;
  style?: React.CSSProperties;
  messages?: {
    valid?: string;
    invalid?: string;
  };
}

interface ValidationState {
  isValid: boolean;
  message: string;
  isVisible: boolean;
}

export const ValidationShark: React.FC<ValidationSharkProps> = ({
  inputId,
  config = {},
  onValid,
  onInvalid,
  className,
  style,
  messages = {}
}) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    message: '',
    isVisible: false
  });
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const findNearestInput = (): HTMLInputElement | HTMLTextAreaElement | null => {
    if (inputId) {
      return document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement;
    }
    const component = document.querySelector('[data-validation-shark]');
    if (!component) return null;
    let element = component.parentElement;
    while (element) {
      const input = element.querySelector('input, textarea');
      if (input) return input as HTMLInputElement | HTMLTextAreaElement;
      element = element.parentElement;
    }
    const input = component.querySelector('input, textarea');
    return input as HTMLInputElement | HTMLTextAreaElement;
  };

  useEffect(() => {
    const input = findNearestInput();
    if (!input) {
      console.warn('ValidationShark: No se encontró ningún input para validar');
      return;
    }
    inputRef.current = input;

    const validator = createEnterpriseValidator({
      maxInputLength: 1000,
      enableLogging: false,
      ...config
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
            message: messages.valid || '✅ Válido',
            isVisible: true
          });
          onValid?.();
        } else {
          setValidationState({
            isValid: false,
            message: messages.invalid || '❌ No permitido',
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

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      validateInput(target.value);
    };

    const handleBlur = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
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
  }, [inputId, config, onValid, onInvalid, messages]);

  if (!validationState.isVisible) {
    return null;
  }

  return (
    <div
      data-validation-shark
      className={className}
      style={{
        fontSize: '12px',
        marginTop: '4px',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: validationState.isValid ? '#d4edda' : '#f8d7da',
        color: validationState.isValid ? '#155724' : '#721c24',
        border: `1px solid ${validationState.isValid ? '#c3e6cb' : '#f5c6cb'}`,
        display: 'inline-block',
        ...style
      }}
    >
      {validationState.message}
    </div>
  );
};

// Hook para validación programática
export const useValidationShark = (config?: any) => {
  const validator = createEnterpriseValidator({
    maxInputLength: 1000,
    enableLogging: false,
    ...config
  });

  const validate = async (input: string) => {
    return await validator.validate(input);
  };

  return { validate };
};

// HOC para envolver componentes
export const withValidationShark = <P extends object>(
  Component: React.ComponentType<P>,
  config?: any
) => {
  return (props: P) => {
    return (
      <div>
        <Component {...props} />
        <ValidationShark config={config} />
      </div>
    );
  };
};

export default ValidationShark; 