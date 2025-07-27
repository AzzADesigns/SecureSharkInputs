// Main entry point for SecureSharkInputs
export * from './services/enterpriseValidator';
export * from './schemas/enterpriseConfig';
export * from './schemas/useSchema';

// Componente principal simplificado
export { default as ValidationShark, useValidationShark, withValidationShark } from './components/ValidationShark';

// Exportar ValidationShark como default principal
export { default } from './components/ValidationShark'; 