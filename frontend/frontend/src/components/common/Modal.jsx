import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative bg-zoom-panel w-full max-w-md rounded-2xl border border-gray-800 p-6 shadow-2xl flex flex-col gap-4 transform transition-all duration-300 scale-100 ${className}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          <Button variant="ghost" onClick={onClose} className="!p-1">
            <X size={18} />
          </Button>
        </div>

        {/* Body */}
        <div className="text-sm text-gray-300">{children}</div>
      </div>
    </div>
  );
}
