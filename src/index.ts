// Main entry point for enterprise-validator
export * from './services/enterpriseValidator';
export * from './schemas/enterpriseConfig';
export * from './schemas/useSchema';

// Nuevos componentes simples
export { default as ValidationShark, useValidationShark, withValidationShark } from './components/ValidationShark';
export { default as SimpleValidationShark } from './components/SimpleValidationShark';
export { useSharkValidation } from './hooks/useSharkValidation';

// Exportar ValidationShark como default principal
export { default } from './components/ValidationShark';

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