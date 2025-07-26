import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ValidationShark from 'securesharkinputs';

// 🛡️ SecureSharkInputs - React Form Template
// 
// ✅ This template includes everything you need:
//    - react-hook-form (included in the library)
//    - ValidationShark component (automatic security validation)
//    - Complete form with security testing examples
//
// 🎯 Features:
//    - XSS Protection
//    - SQL Injection Protection
//    - Data Theft Protection
//    - Form Blocking when threats detected
//    - Real-time validation feedback
//
// 📝 Usage: Just import and use this component in your app!

interface FormData {
  name: string;
  email: string;
  message: string;
  age: number;
}

const SecureSharkForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      message: '',
      age: undefined
    }
  });

  const onSubmit = (data: FormData) => {
    console.log('✅ Form submitted successfully:', data);
    setIsSubmitted(true);
    reset();
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  // 🎨 Styling classes (you can customize these)
  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🛡️ SecureSharkInputs Demo
      </h2>
      
      {isSubmitted && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ Form submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className={labelClass}>
            Name *
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className={inputClass}
            placeholder="Enter your name"
          />
          {/* 🛡️ ValidationShark automatically protects this input */}
          <ValidationShark inputId="name" />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className={inputClass}
            placeholder="Enter your email"
          />
          {/* 🛡️ ValidationShark automatically protects this input */}
          <ValidationShark inputId="email" />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Age Field */}
        <div>
          <label htmlFor="age" className={labelClass}>
            Age
          </label>
          <input
            id="age"
            type="number"
            {...register('age', { 
              min: { value: 0, message: 'Age must be positive' },
              max: { value: 120, message: 'Age must be realistic' }
            })}
            className={inputClass}
            placeholder="Enter your age"
          />
          {/* 🛡️ ValidationShark automatically protects this input */}
          <ValidationShark inputId="age" />
          {errors.age && (
            <span className="text-red-500 text-sm">{errors.age.message}</span>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className={labelClass}>
            Message *
          </label>
          <textarea
            id="message"
            {...register('message', { required: 'Message is required' })}
            className={`${inputClass} resize-none`}
            rows={4}
            placeholder="Enter your message"
          />
          {/* 🛡️ ValidationShark automatically protects this input */}
          <ValidationShark inputId="message" />
          {errors.message && (
            <span className="text-red-500 text-sm">{errors.message.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Submit Form
        </button>
      </form>

      {/* 🧪 Security Testing Instructions */}
      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold text-gray-900 mb-2">🧪 Test Security Features:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>XSS Test:</strong> Try: &lt;script&gt;alert('xss')&lt;/script&gt;</li>
          <li>• <strong>SQL Injection:</strong> Try: '; DROP TABLE users; --</li>
          <li>• <strong>Data Theft:</strong> Try: document.cookie</li>
          <li>• <strong>Normal Input:</strong> Try: Hello World</li>
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          💡 The form should block submission and show warnings for malicious content
        </p>
      </div>

      {/* 📚 Documentation Links */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-900 mb-1">📚 Learn More:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• <a href="https://www.npmjs.com/package/securesharkinputs" className="underline">NPM Package</a></li>
          <li>• <a href="https://github.com/AzzADesigns/SecureSharkInputs" className="underline">GitHub Repository</a></li>
          <li>• Check SECURESHARK_SETUP.md for detailed instructions</li>
        </ul>
      </div>
    </div>
  );
};

export default SecureSharkForm; 