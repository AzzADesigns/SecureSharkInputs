import React from 'react';
import { useForm } from 'react-hook-form';
import ValidationShark from 'securesharkinputs';

// ✅ EJEMPLO CORRECTO - Cómo usar ValidationShark con react-hook-form

const inputClass = 'border p-2 rounded w-full bg-[#181f2a] text-white placeholder-gray-400';

type FormData = {
  email: string;
  age: number;
  firstName: string;
  lastName: string;
  phone: string;
  discord: string;
  country: string;
  otherCountry: string;
  role: string;
  stack: string;
  experience: string;
  linkedin: string;
  github: string;
  behance: string;
  website: string;
  otherNetwork: string;
  expectations: string;
};

const InputField: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div className="input-field">
    <label className="text-white mb-2 block">{label}</label>
    {children}
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

const DatosPersonales: React.FC<{
  register: any;
  errors: any;
  countryValue: string;
}> = ({ register, errors, countryValue }) => (
  <>
    <h2 className="text-lg font-bold mt-4 text-white">DATOS PERSONALES</h2>
    
    {/* ✅ CORRECTO - ValidationShark dentro del contenedor */}
    <InputField label="Edad *" error={errors.age?.message}>
      <input id="age" type="number" {...register('age')} className={inputClass} placeholder="Ej: 25" />
      <ValidationShark />
    </InputField>
    
    <InputField label="Nombre *" error={errors.firstName?.message}>
      <input id="firstName" type="text" {...register('firstName')} className={inputClass} placeholder="Tu nombre" />
      <ValidationShark />
    </InputField>
    
    <InputField label="Apellido *" error={errors.lastName?.message}>
      <input id="lastName" type="text" {...register('lastName')} className={inputClass} placeholder="Tu apellido" />
      <ValidationShark />
    </InputField>
    
    <InputField label="Celular *" error={errors.phone?.message}>
      <input id="phone" type="text" {...register('phone')} className={inputClass} placeholder="Ej: 11-1234-5678" />
      <ValidationShark />
    </InputField>
    
    <InputField label="Alias o Nick en Discord" error={errors.discord?.message}>
      <input id="discord" type="text" {...register('discord')} className={inputClass} placeholder="Tu usuario de Discord" />
      <ValidationShark />
    </InputField>
    
    <InputField label="País de Residencia *" error={errors.country?.message}>
      <select id="country" {...register('country')} className={inputClass}>
        <option value="">Selecciona un país</option>
        <option value="Argentina">Argentina</option>
        <option value="México">México</option>
        <option value="Colombia">Colombia</option>
        <option value="Otra">Otra</option>
      </select>
      <ValidationShark />
    </InputField>
    
    {countryValue === 'Otra' && (
      <InputField label="Si pusiste Otra en País de Residencia, especificá cuál es." error={errors.otherCountry?.message}>
        <input id="otherCountry" type="text" {...register('otherCountry')} className={inputClass} placeholder="Tu país" />
        <ValidationShark />
      </InputField>
    )}
  </>
);

const DatosLaborales: React.FC<{
  register: any;
  errors: any;
}> = ({ register, errors }) => (
  <>
    <h2 className="text-lg font-bold mt-4 text-white">DATOS LABORALES</h2>
    
    <InputField label="Rol actual / Rol al que aspiras *" error={errors.role?.message}>
      <input id="role" type="text" {...register('role')} className={inputClass} placeholder="Ej: Frontend Developer" />
      <ValidationShark />
    </InputField>
    
    <InputField label="¿Cuál es tu stack tecnológico?" error={errors.stack?.message}>
      <input id="stack" type="text" {...register('stack')} className={inputClass} placeholder="Ej: React, TypeScript, Tailwind CSS" />
      <ValidationShark />
    </InputField>
    
    <InputField label="¿Cuántos años de experiencia tenés?" error={errors.experience?.message}>
      <input id="experience" type="text" {...register('experience')} className={inputClass} placeholder="Ej: 3 años" />
      <ValidationShark />
    </InputField>
    
    <InputField label="Tu LinkedIn es... *" error={errors.linkedin?.message}>
      <input id="linkedin" type="text" {...register('linkedin')} className={inputClass} placeholder="Tu perfil de LinkedIn" />
      <ValidationShark />
    </InputField>
    
    <InputField label="Tu GitHub es..." error={errors.github?.message}>
      <input id="github" type="text" {...register('github')} className={inputClass} placeholder="Tu perfil de GitHub" />
      <ValidationShark />
    </InputField>
    
    <InputField label="Tu Behance es..." error={errors.behance?.message}>
      <input id="behance" type="text" {...register('behance')} className={inputClass} placeholder="Tu perfil de Behance" />
      <ValidationShark />
    </InputField>
    
    <InputField label="Tu sitio web es..." error={errors.website?.message}>
      <input id="website" type="text" {...register('website')} className={inputClass} placeholder="Tu sitio web personal" />
      <ValidationShark />
    </InputField>
    
    <InputField label="Tenés otra red? Contanos" error={errors.otherNetwork?.message}>
      <input id="otherNetwork" type="text" {...register('otherNetwork')} className={inputClass} placeholder="Otras redes sociales" />
      <ValidationShark />
    </InputField>
    
    <InputField label="¿Qué es lo que esperás de la comunidad?" error={errors.expectations?.message}>
      <textarea id="expectations" {...register('expectations')} className={inputClass} placeholder="Cuéntanos tus expectativas y cómo te gustaría contribuir a la comunidad." />
      <ValidationShark />
    </InputField>
  </>
);

export const EntryForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
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

  const onSubmit = (data: FormData) => {
    alert('Formulario enviado correctamente!');
    console.log('Datos del formulario:', data);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full shadow-2xl shadow-black h-200 overflow-y-auto p-10 bg-[#101828] rounded"
    >
      <h2 className='mb-5 text-3xl font-bold text-white'>¡Bienvenido a la comunidad!</h2>
      
      {/* ✅ CORRECTO - ValidationShark dentro del InputField */}
      <InputField label="Correo electrónico *" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={inputClass}
          placeholder="Tu correo electrónico"
        />
        <ValidationShark />
      </InputField>
      
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
    </form>
  );
};

export default EntryForm; 