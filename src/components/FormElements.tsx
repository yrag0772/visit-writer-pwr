import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  borderColor?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  extraActions?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  icon, 
  borderColor = 'border-blue-500', 
  children,
  isOpen = true,
  onToggle,
  extraActions
}) => {
  return (
    <div className="space-y-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100" id={title}>
      <div className="flex items-center justify-between">
        <button 
          onClick={onToggle}
          className="flex-1 flex items-center justify-between text-left group"
        >
          <h2 className={`text-lg font-bold flex items-center gap-2 text-gray-800 border-l-4 ${borderColor} pl-3 transition-all group-hover:pl-4`}>
            {icon}
            {title}
          </h2>
          {onToggle && (
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          )}
        </button>
        {extraActions && <div className="flex items-center gap-2 ml-4">{extraActions}</div>}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  className?: string;
  hint?: string;
  min?: string;
  max?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder, type = 'text', icon, className = '', hint, min, max }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
      {label}
      {hint && <span className="text-[10px] font-normal text-blue-400 normal-case">{hint}</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      <input 
        type={type} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (type === 'number' && (e.key === '-' || e.key === 'e')) {
            e.preventDefault();
          }
        }}
        min={min || (type === 'number' ? "0" : undefined)}
        max={max}
        className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all bg-gray-50 text-sm`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

export const TextAreaField: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder, className = '', hint }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
      {label}
      {hint && <span className="text-[10px] font-normal text-blue-400 normal-case">{hint}</span>}
    </label>
    <textarea 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all bg-gray-50 text-sm min-h-[100px] resize-y"
      placeholder={placeholder}
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
  allowOther?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, options, value, onChange, className = '', allowOther, otherValue, onOtherChange }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(value === opt ? '' : opt)}
          className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
            value === opt 
            ? 'bg-brand border-brand text-white shadow-md' 
            : 'bg-white border-gray-100 text-gray-500 hover:border-brand-light'
          }`}
        >
          {opt}
        </button>
      ))}
      {allowOther && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange(value === '其他' ? '' : '其他')}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
              value === '其他' 
              ? 'bg-brand border-brand text-white shadow-md' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-brand-light'
            }`}
          >
            其他
          </button>
          {value === '其他' && (
            <textarea 
              value={otherValue}
              onChange={(e) => onOtherChange?.(e.target.value)}
              placeholder="請輸入其他內容..."
              className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand min-h-[80px] resize-y"
            />
          )}
        </div>
      )}
    </div>
  </div>
);

interface MultiSelectFieldProps {
  label: string;
  options: string[];
  values: string[];
  onChange: (vals: string[]) => void;
  className?: string;
  allowOther?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({ label, options, values, onChange, className = '', allowOther, otherValue, onOtherChange }) => {
  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter(v => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer text-left ${
              values.includes(opt) 
              ? 'bg-brand border-brand text-white shadow-md' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-brand-light'
            }`}
          >
            {opt}
          </button>
        ))}
        {allowOther && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggle('其他')}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer text-left ${
                values.includes('其他') 
                ? 'bg-brand border-brand text-white shadow-md' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-brand-light'
              }`}
            >
              其他
            </button>
            {values.includes('其他') && (
              <textarea 
                value={otherValue}
                onChange={(e) => onOtherChange?.(e.target.value)}
                placeholder="請輸入其他內容..."
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand min-h-[80px] resize-y"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
