import React, { useState } from 'react';
import ValidationShark, { useSharkValidation } from 'securesharkinputs';

// ============================================================================
// EJEMPLO 1: USO MÁS SIMPLE - Solo colocar el componente
// ============================================================================

const SimpleExample: React.FC = () => {
  return (
    <div>
      <h3>Ejemplo 1: Uso más simple</h3>
      <input 
        type="text" 
        placeholder="Escribe algo aquí..."
        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <ValidationShark />
    </div>
  );
};

// ============================================================================
// EJEMPLO 2: Con ID específico
// ============================================================================

const WithIdExample: React.FC = () => {
  return (
    <div>
      <h3>Ejemplo 2: Con ID específico</h3>
      <input 
        id="my-input"
        type="text" 
        placeholder="Escribe algo aquí..."
        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <ValidationShark for="my-input" />
    </div>
  );
};

// ============================================================================
// EJEMPLO 3: Con configuración personalizada
// ============================================================================

const WithConfigExample: React.FC = () => {
  return (
    <div>
      <h3>Ejemplo 3: Con configuración</h3>
      <input 
        type="text" 
        placeholder="Escribe algo aquí..."
        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <ValidationShark 
        maxLength={500}
        onValid={() => console.log('✅ Input válido')}
        onInvalid={() => console.log('❌ Input inválido')}
      />
    </div>
  );
};

// ============================================================================
// EJEMPLO 4: Con hook programático
// ============================================================================

const WithHookExample: React.FC = () => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const { validate, validateSync } = useSharkValidation({ maxLength: 100 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Validación síncrona para feedback inmediato
    const syncResult = validateSync(newValue);
    setResult(syncResult.message || '');
  };

  const handleSubmit = async () => {
    // Validación asíncrona completa
    const asyncResult = await validate(value);
    console.log('Resultado completo:', asyncResult);
  };

  return (
    <div>
      <h3>Ejemplo 4: Con hook programático</h3>
      <input 
        type="text" 
        value={value}
        onChange={handleInputChange}
        placeholder="Escribe algo aquí..."
        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      {result && (
        <div style={{ 
          marginTop: '4px', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px',
          backgroundColor: result.includes('✅') ? '#ecfdf5' : '#fef2f2',
          color: result.includes('✅') ? '#10b981' : '#ef4444'
        }}>
          {result}
        </div>
      )}
      <button 
        onClick={handleSubmit}
        style={{ 
          marginTop: '8px', 
          padding: '8px 16px', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Validar
      </button>
    </div>
  );
};

// ============================================================================
// EJEMPLO 5: Formulario completo
// ============================================================================

const FormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { validateForm } = useSharkValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await validateForm(formData);
    
    if (result.isValid) {
      alert('✅ Formulario válido!');
    } else {
      alert('❌ Formulario inválido!');
      console.log('Errores:', result.results);
    }
  };

  return (
    <div>
      <h3>Ejemplo 5: Formulario completo</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginLeft: '8px' }}
          />
          <ValidationShark />
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <label>Email:</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginLeft: '8px' }}
          />
          <ValidationShark />
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <label>Mensaje:</label>
          <textarea 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginLeft: '8px', width: '300px', height: '100px' }}
          />
          <ValidationShark />
        </div>
        
        <button 
          type="submit"
          style={{ 
            marginTop: '16px', 
            padding: '8px 16px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🦈 SecureSharkInputs - Ejemplos Simples</h1>
      <p>Estos ejemplos muestran cómo usar la nueva API simplificada.</p>
      
      <div style={{ marginBottom: '40px' }}>
        <SimpleExample />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <WithIdExample />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <WithConfigExample />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <WithHookExample />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <FormExample />
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '16px', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h4>📝 Instrucciones de uso:</h4>
        <ul>
          <li><strong>Uso más simple:</strong> Solo coloca <code>&lt;ValidationShark /&gt;</code> debajo del input</li>
          <li><strong>Con ID:</strong> Usa <code>&lt;ValidationShark for="input-id" /&gt;</code></li>
          <li><strong>Con configuración:</strong> Pasa props como <code>maxLength</code>, <code>onValid</code>, etc.</li>
          <li><strong>Programático:</strong> Usa el hook <code>useSharkValidation()</code></li>
        </ul>
      </div>
    </div>
  );
};

export default App; 