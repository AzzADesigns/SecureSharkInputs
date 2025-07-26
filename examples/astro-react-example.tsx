// Astro + React Example with ValidationShark
// File: src/components/EntryForm.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import ValidationShark from 'securesharkinputs';

// Helper function to safely convert error message to string
const getErrorMessage = (error: any): string => {
  if (!error?.message) return '';
  return typeof error.message === 'string' ? error.message : String(error.message);
};

const inputClass = 'border p-2 rounded w-full bg-[#181f2a] text-white placeholder-gray-400';

type EntryFormProps = {
  onClose: () => void;
};

type FormSectionProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
};

type DatosPersonalesProps = FormSectionProps & {
  countryValue: string;
};

const DatosPersonales: React.FC<DatosPersonalesProps> = ({ register, errors, countryValue }) => (
  <>
    <h2 className="text-lg font-bold mt-4 text-white">DATOS PERSONALES</h2>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Edad *</label>
      <input id="age" type="number" {...register('age')} className={inputClass} placeholder="Ej: 25" />
      {/* ✅ Para Astro + React: Usar inputId explícitamente */}
      <ValidationShark inputId="age" />
      {getErrorMessage(errors.age) && <span className="text-red-500 text-sm">{getErrorMessage(errors.age)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Nombre *</label>
      <input id="firstName" type="text" {...register('firstName')} className={inputClass} placeholder="Tu nombre" />
      <ValidationShark inputId="firstName" />
      {getErrorMessage(errors.firstName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.firstName)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Apellido *</label>
      <input 
        id="lastName"
        type="text" 
        {...register('lastName')} 
        className={inputClass} 
        placeholder="Tu apellido"
      />
      <ValidationShark inputId="lastName" />
      {getErrorMessage(errors.lastName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.lastName)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Celular *</label>
      <input id="phone" type="text" {...register('phone')} className={inputClass} placeholder="Ej: 11-1234-5678" />
      <ValidationShark inputId="phone" />
      {getErrorMessage(errors.phone) && <span className="text-red-500 text-sm">{getErrorMessage(errors.phone)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Alias o Nick en Discord</label>
      <input id="discord" type="text" {...register('discord')} className={inputClass} placeholder="Tu usuario de Discord" />
      <ValidationShark inputId="discord" />
      {getErrorMessage(errors.discord) && <span className="text-red-500 text-sm">{getErrorMessage(errors.discord)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">País de Residencia *</label>
      <select id="country" {...register('country')} className={inputClass}>
        <option value="">Selecciona un país</option>
        <option value="Argentina">Argentina</option>
        <option value="México">México</option>
        <option value="Colombia">Colombia</option>
        <option value="Otra">Otra</option>
      </select>
      <ValidationShark inputId="country" />
      {getErrorMessage(errors.country) && <span className="text-red-500 text-sm">{getErrorMessage(errors.country)}</span>}
    </div>
    {countryValue === 'Otra' && (
      <div className="input-field">
        <label className="block text-sm font-medium text-white mb-1">Si pusiste Otra en País de Residencia, especificá cuál es.</label>
        <input id="otherCountry" type="text" {...register('otherCountry')} className={inputClass} placeholder="Tu país" />
        <ValidationShark inputId="otherCountry" />
        {getErrorMessage(errors.otherCountry) && <span className="text-red-500 text-sm">{getErrorMessage(errors.otherCountry)}</span>}
      </div>
    )}
  </>
);

const DatosLaborales: React.FC<FormSectionProps> = ({ register, errors }) => (
  <>
    <h2 className="text-lg font-bold mt-4 text-white">DATOS LABORALES</h2>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Rol actual / Rol al que aspiras *</label>
      <input id="role" type="text" {...register('role')} className={inputClass} placeholder="Ej: Frontend Developer" />
      <ValidationShark inputId="role" />
      {getErrorMessage(errors.role) && <span className="text-red-500 text-sm">{getErrorMessage(errors.role)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">¿Cuál es tu stack tecnológico? Por favor escribe las tecnologías separadas por comas.</label>
      <input id="stack" type="text" {...register('stack')} className={inputClass} placeholder="Ej: React, TypeScript, Tailwind CSS" />
      <ValidationShark inputId="stack" />
      {getErrorMessage(errors.stack) && <span className="text-red-500 text-sm">{getErrorMessage(errors.stack)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Si estás trabajando en la industria, ¿cuántos años de experiencia tenés?</label>
      <input id="experience" type="text" {...register('experience')} className={inputClass} placeholder="Ej: 3 años" />
      <ValidationShark inputId="experience" />
      {getErrorMessage(errors.experience) && <span className="text-red-500 text-sm">{getErrorMessage(errors.experience)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Tu LinkedIn es... *</label>
      <input id="linkedin" type="text" {...register('linkedin')} className={inputClass} placeholder="Tu perfil de LinkedIn" />
      <ValidationShark inputId="linkedin" />
      {getErrorMessage(errors.linkedin) && <span className="text-red-500 text-sm">{getErrorMessage(errors.linkedin)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Tu GitHub es...</label>
      <input id="github" type="text" {...register('github')} className={inputClass} placeholder="Tu perfil de GitHub" />
      <ValidationShark inputId="github" />
      {getErrorMessage(errors.github) && <span className="text-red-500 text-sm">{getErrorMessage(errors.github)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Tu Behance es...</label>
      <input id="behance" type="text" {...register('behance')} className={inputClass} placeholder="Tu perfil de Behance" />
      <ValidationShark inputId="behance" />
      {getErrorMessage(errors.behance) && <span className="text-red-500 text-sm">{getErrorMessage(errors.behance)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Tu sitio web es...</label>
      <input id="website" type="text" {...register('website')} className={inputClass} placeholder="Tu sitio web personal" />
      <ValidationShark inputId="website" />
      {getErrorMessage(errors.website) && <span className="text-red-500 text-sm">{getErrorMessage(errors.website)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">Tenés otra red? Contanos</label>
      <input id="otherNetwork" type="text" {...register('otherNetwork')} className={inputClass} placeholder="Otras redes sociales" />
      <ValidationShark inputId="otherNetwork" />
      {getErrorMessage(errors.otherNetwork) && <span className="text-red-500 text-sm">{getErrorMessage(errors.otherNetwork)}</span>}
    </div>
    <div className="input-field">
      <label className="block text-sm font-medium text-white mb-1">¿Qué es lo que esperás de la comunidad? ¿Cuáles serían tus ideas para contribuir a la misma?</label>
      <textarea id="expectations" {...register('expectations')} className={inputClass} placeholder="Cuéntanos tus expectativas y cómo te gustaría contribuir a la comunidad." />
      <ValidationShark inputId="expectations" />
      {getErrorMessage(errors.expectations) && <span className="text-red-500 text-sm">{getErrorMessage(errors.expectations)}</span>}
    </div>
  </>
);

export const EntryForm: React.FC<EntryFormProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      age: undefined,
      firstName: '',
      lastName: '',
      phone: '',
      discord: '',
      country: '',
      otherCountry: '',
      role: '',
      stack: '',
      experience: '',
      linkedin: '',
      github: '',
      behance: '',
      website: '',
      otherNetwork: '',
      expectations: '',
    },
  });

  const countryValue = watch('country');

  const onSubmit = (data: any) => {
    alert('Formulario enviado correctamente!');
    onClose();
  };

  return (
    <form
      key="entry-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full shadow-2xl shadow-black h-200 overflow-y-auto p-10 bg-[#101828] rounded custom-scrollbar"
      style={{ boxSizing: 'border-box' }}
    >
      <h2 className='mb-5 text-3xl font-bold'>¡Bienvenido a la comunidad!</h2>
      <div className="input-field">
        <label className="block text-sm font-medium text-white mb-1">Correo electrónico *</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={inputClass}
          placeholder="Tu correo electrónico"
        />
        {/* ✅ Para Astro + React: Usar inputId explícitamente */}
        <ValidationShark inputId="email" />
        {getErrorMessage(errors.email) && <span className="text-red-500 text-sm">{getErrorMessage(errors.email)}</span>}
      </div>
      <DatosPersonales register={register} errors={errors} countryValue={countryValue ?? ''} />
      <DatosLaborales register={register} errors={errors} />
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Enviar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Cerrar
        </button>
      </div>
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #85D9F6  transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #111;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-left: 1px solid #222;
        }
      `}</style>
    </form>
  );
}; 