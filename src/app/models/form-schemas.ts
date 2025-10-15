export type FieldType = 'text' | 'textarea' | 'date' | 'dropdown' | 'multiselect' | 'checkbox' | 'number' | 'password';

export interface FieldValidation {
  pattern?: string;
  message?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export interface Field {
  label: string;
  name: string;
  type: FieldType;
  required?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  options?: string[];
  dependsOn?: string;
  validation?: FieldValidation;
  placeholder?: string;
}

export interface FormSchema {
  title?: string;
  fields: Field[];
}
