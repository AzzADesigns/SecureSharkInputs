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
  // Nuevas props para control automático
  blockForm?: boolean;
  showMessages?: boolean;
}

interface ValidationState {
  isValid: boolean;
  message: string;
  isVisible: boolean;
}

const ValidationShark: React.FC<ValidationSharkProps> = ({
  inputId,
  config = {},
  onValid,
  onInvalid,
  className,
  style,
  messages = {},
  blockForm = true,
  showMessages = true
}) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    message: '',
    isVisible: false
  });
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const findNearestInput = (): HTMLInputElement | HTMLTextAreaElement | null => {
    // Si se proporciona inputId, usarlo directamente
    if (inputId) {
      return document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement;
    }

    // Buscar el input más cercano usando una estrategia más robusta
    // Usar una referencia al elemento actual del componente
    const currentElement = document.querySelector('[data-validation-shark]');
    
    if (currentElement) {
      // 1. Buscar en el elemento padre inmediato
      const parent = currentElement.parentElement;
      if (parent) {
        const input = parent.querySelector('input, textarea, select');
        if (input) return input as HTMLInputElement | HTMLTextAreaElement;
      }

      // 2. Buscar en el contenedor padre (InputField)
      const container = currentElement.closest('.InputField, [class*="InputField"], div');
      if (container) {
        const input = container.querySelector('input, textarea, select');
        if (input) return input as HTMLInputElement | HTMLTextAreaElement;
      }

      // 3. Buscar en el elemento anterior (hermano)
      let sibling = currentElement.previousElementSibling;
      while (sibling) {
        if (sibling.tagName === 'INPUT' || sibling.tagName === 'TEXTAREA' || sibling.tagName === 'SELECT') {
          return sibling as HTMLInputElement | HTMLTextAreaElement;
        }
        sibling = sibling.previousElementSibling;
      }
    }

    // 4. Si no se encuentra, buscar en todo el DOM por el input más cercano
    // Esto es un fallback para casos donde la estructura no es estándar
    const allInputs = document.querySelectorAll('input, textarea, select');
    if (allInputs.length > 0) {
      // Retornar el primer input encontrado como fallback
      return allInputs[0] as HTMLInputElement | HTMLTextAreaElement;
    }

    return null;
  };

  useEffect(() => {
    const input = findNearestInput();
    if (!input) {
      console.warn('ValidationShark: No se encontró ningún input para validar');
      console.log('ValidationShark: Elementos input disponibles:', document.querySelectorAll('input, textarea, select').length);
      return;
    }
    console.log('ValidationShark: Input encontrado:', input.id || input.name || 'sin id');
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
            isVisible: showMessages
          });
          onValid?.();
          
          // Desbloquear el formulario si estaba bloqueado
          if (blockForm) {
            const form = input.closest('form');
            if (form) {
              form.removeAttribute('data-validation-blocked');
              const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
              if (submitButton) {
                submitButton.removeAttribute('disabled');
                submitButton.removeAttribute('title');
              }
            }
          }
        } else {
          setValidationState({
            isValid: false,
            message: messages.invalid || '❌ Contenido no permitido detectado',
            isVisible: showMessages
          });
          onInvalid?.();
          
          // Bloquear el formulario si está habilitado
          if (blockForm) {
            const form = input.closest('form');
            if (form) {
              form.setAttribute('data-validation-blocked', 'true');
              const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
              if (submitButton) {
                submitButton.setAttribute('disabled', 'true');
                submitButton.setAttribute('title', 'Formulario bloqueado por contenido no permitido');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error de validación:', error);
        setValidationState({
          isValid: false,
          message: '❌ Error de validación',
          isVisible: showMessages
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

// Configurar displayName y defaultProps
ValidationShark.displayName = 'ValidationShark';
ValidationShark.defaultProps = {
  config: {},
  messages: {
    valid: '✅ Válido',
    invalid: '❌ Contenido no permitido detectado'
  },
  blockForm: true,
  showMessages: true
};

export default ValidationShark; 