// Main entry point for enterprise-validator
export * from './services/enterpriseValidator';
export * from './schemas/enterpriseConfig';
export * from './schemas/useSchema';

// Componente principal simplificado
export { default as ValidationShark, useValidationShark, withValidationShark } from './components/ValidationShark';

// Exportar ValidationShark como default principal
export { default } from './components/ValidationShark';

// Backend exports
export * from './backend/secureSharkBackend'; 