export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface SignUpSubmitData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SignUpSubmitData) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}