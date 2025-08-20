import type { SignUpFormData } from './types';

export const INITIAL_FORM_DATA: SignUpFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
};

export const MODAL_CLASSES = {
  backdrop: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn',
  modal: 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto',
  header: 'relative bg-gradient-to-r from-teal-400 to-emerald-500 p-6 text-white',
  form: 'p-6 space-y-4',
} as const;