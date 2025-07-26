// Main entry point for enterprise-validator
export * from './services/enterpriseValidator';
export * from './schemas/enterpriseConfig';
export * from './schemas/useSchema';

// Nuevos componentes simples
export { ValidationShark, useValidationShark, withValidationShark } from './components/ValidationShark';
export { SimpleValidationShark, ValidationShark as SimpleShark } from './components/SimpleValidationShark';
export { useSharkValidation } from './hooks/useSharkValidation';

// Exportar el componente más simple como default
export { ValidationShark as default } from './components/SimpleValidationShark';

// Backend exports
export * from './backend/secureSharkBackend';

// Core exports (versión ligera)
export { 
  createLightweightValidator, 
  validateInput as validateInputLightweight,
  validateInputSync,
  LightweightValidator,
  type LightweightValidationResult,
  type LightweightValidatorConfig
} from './core/lightweightValidator'; 