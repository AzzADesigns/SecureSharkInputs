/**
 * 🛡️ SecureSharkInputs - Ejemplo React Súper Simple
 * 
 * Copia y pega este componente en tu proyecto React
 */

import React, { useState } from 'react';
import { ValidationShark } from 'securesharkinputs';

function SecureForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('✅ Formulario enviado:', formData);
    alert('Formulario enviado correctamente!');
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ color: '#333', textAlign: 'center' }}>
        🛡️ Formulario Protegido
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nombre:
          </label>
          <input
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Escribe tu nombre..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <ValidationShark />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <ValidationShark />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Mensaje:
          </label>
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Escribe tu mensaje..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              height: '100px',
              resize: 'vertical'
            }}
          />
          <ValidationShark />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          🚀 Enviar Formulario
        </button>
      </form>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e7f3ff', 
        borderRadius: '4px',
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>
          🧪 Prueba estos ataques:
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
          <li><code>&lt;script&gt;alert('xss')&lt;/script&gt;</code></li>
          <li><code>SELECT * FROM users</code></li>
          <li><code>document.cookie</code></li>
          <li><code>javascript:alert('hack')</code></li>
        </ul>
      </div>
    </div>
  );
}

export default SecureForm; 