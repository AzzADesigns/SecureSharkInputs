import React, { useEffect, useRef, useState } from 'react';
import { createEnterpriseValidator } from '../services/enterpriseValidator';

// Importación opcional de react-hook-form
let useFormContext: any = null;
try {
  const reactHookForm = require('react-hook-form');
  useFormContext = reactHookForm.useFormContext;
} catch (error) {
  // react-hook-form no está disponible
  console.warn('react-hook-form no está disponible, usando modo standalone');
}

interface ValidationSharkProps {
  name: string; // Campo requerido para react-hook-form
  type?: string; // Tipo de input (text, email, password, etc.)
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  // Props de validación
  onValid?: () => void;
  onInvalid?: () => void;
  blockForm?: boolean;
  showMessages?: boolean;
}

interface ValidationState {
  isValid: boolean;
  message: string;
  isVisible: boolean;
}

const ValidationShark: React.FC<ValidationSharkProps> = ({
  name,
  type = 'text',
  placeholder,
  label,
  required = false,
  className = '',
  style,
  onValid,
  onInvalid,
  blockForm = true,
  showMessages = true
}) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    message: '',
    isVisible: false
  });
  
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const formContext = useFormContext();
  
  // Obtener register y errors del contexto del formulario
  const register = formContext?.register;
  const errors = formContext?.formState?.errors;
  const watch = formContext?.watch;

  const inputId = name; // Usar el name como id

  const findInput = (): HTMLInputElement | HTMLTextAreaElement | null => {
    return document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement;
  };

  useEffect(() => {
    const input = findInput();
    if (!input) {
      console.warn('ValidationShark: No se encontró el input para validar');
      return;
    }
    
    inputRef.current = input;
    console.log('ValidationShark: Input encontrado:', input.id);

    const validator = createEnterpriseValidator({
      enableExternalValidation: false,
      enableLogging: true,
      maxInputLength: 1000
    });

    const preventSubmit = (e: Event) => {
      if (!validationState.isValid) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚨 Form submission blocked due to validation failure');
        return false;
      }
      return true;
    };

    const validateInput = async (value: string) => {
      if (!value.trim()) {
        setValidationState({
          isValid: true,
          message: '',
          isVisible: false
        });
        onValid?.();
        return;
      }

      try {
        const result = await validator.validate(value);
        
        if (result.isValid) {
          setValidationState({
            isValid: true,
            message: '',
            isVisible: false
          });
          onValid?.();
        } else {
          setValidationState({
            isValid: false,
            message: `⚠️ Contenido no permitido detectado`,
            isVisible: true
          });
          onInvalid?.();
        }
      } catch (error) {
        console.error('Error en validación:', error);
        setValidationState({
          isValid: false,
          message: '❌ Error en validación',
          isVisible: true
        });
        onInvalid?.();
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

    // Agregar event listeners
    input.addEventListener('input', handleInput);
    input.addEventListener('blur', handleBlur);

    // Bloquear formulario si está configurado
    if (blockForm) {
      const form = input.closest('form');
      if (form) {
        form.addEventListener('submit', preventSubmit);
        
        // Marcar el formulario como bloqueado si hay validación fallida
        if (!validationState.isValid) {
          form.setAttribute('data-validation-blocked', 'true');
        } else {
          form.removeAttribute('data-validation-blocked');
        }
      }
    }

    return () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('blur', handleBlur);
      
      if (blockForm) {
        const form = input.closest('form');
        if (form) {
          form.removeEventListener('submit', preventSubmit);
        }
      }
    };
  }, [inputId, validationState.isValid, blockForm, onValid, onInvalid]);

  // Estilos base
  const inputClass = `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const errorClass = 'text-red-500 text-sm mt-1';

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className={labelClass}>
          {label} {required && '*'}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        {...(register ? register(name, { 
          required: required ? `${label || name} es requerido` : false 
        }) : {})}
        className={inputClass}
        style={style}
      />
      
      {/* Mensaje de error de react-hook-form */}
      {errors && errors[name] && (
        <span className={errorClass}>{errors[name]?.message as string}</span>
      )}
      
      {/* Mensaje de validación de seguridad */}
      {showMessages && validationState.isVisible && !validationState.isValid && (
        <span className={errorClass}>{validationState.message}</span>
      )}
    </div>
  );
};

// HOC para componentes con validación
export const useValidationShark = (config?: any) => {
  const [isValid, setIsValid] = useState(true);
  const [message, setMessage] = useState('');

  const validate = async (input: string) => {
    const validator = createEnterpriseValidator(config);
    const result = await validator.validate(input);
    setIsValid(result.isValid);
    setMessage(result.isValid ? '' : 'Contenido no permitido');
    return result;
  };

  return { isValid, message, validate };
};

// HOC para envolver componentes
export const withValidationShark = <P extends object>(
  Component: React.ComponentType<P>,
  config?: any
) => {
  return (props: P) => {
    const validationProps = useValidationShark(config);
    return <Component {...props} {...validationProps} />;
  };
};

export default ValidationShark; 