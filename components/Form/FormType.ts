import { FormItemProps, InputProps, SwitchProps, RadioGroupProps,SelectProps } from 'naive-ui';
import { VNodeRef } from 'vue';

export interface FormConfigBase {
  formType: 'input' | 'select' | 'custom' | 'switch' | 'radio';
  disabled?: boolean;
  key: string;
  label?: FormItemProps['label'];
  rule?: FormItemProps['rule'];
}

export interface InputConfig extends FormConfigBase {
  formType: 'input';
  autofocus?: boolean;
  autosize?: boolean;
  clearable?: boolean;
  maxlength?: number;
  minlength?: number;
  placeholder?: string;
  type?: InputProps['type'];
  value?: InputProps['value'];
  'onUpdateValue'?: InputProps['onUpdate:value'];
}

export interface SwitchConfig extends FormConfigBase {
  formType: 'switch';
  'checkedValue'?: SwitchProps['checkedValue'];
  value?: SwitchProps['value'];
  'railStyle'?: SwitchProps['railStyle'];
  'checkedContent'?: Element;
  'uncheckedContent'?: Element;
}

export interface RadioConfig extends FormConfigBase {
  formType: 'radio';
  value: RadioGroupProps['value'];
  options: {
    label: string;
    value: string | number;
  }[];
}

export interface SelectConfig extends FormConfigBase {
  formType: 'select';
  value?: SelectProps['value'];
  options: SelectProps['options'];
  placeholder?: SelectProps['placeholder'];
  virtualScroll?: SelectProps['virtualScroll'];
  multiple?: SelectProps['multiple'];
  clearable?: SelectProps['clearable'];
  'onUpdateValue'?: SelectProps['onUpdate:value'];
}

export interface CustomConfig extends FormConfigBase {
  formType: 'custom';
  value?: any;
  render: ({
    formData,
    changeData,
    validate
  }: {
    formData: Record<string, any>;
    changeData: (value: any, key: string) => void;
    validate: (keys?: string[]) => Promise<boolean>
  }) => JSX.Element;
}
export type FormFieldConfig =
  InputConfig
  | SwitchConfig
  | RadioConfig
  | SelectConfig
  | CustomConfig;

export interface FormRef {
  validate: (keys?: string[]) => Promise<boolean>;
  resetFields: () => void;
  clearValidate: (keys?: string[]) => void;
  formData: Record<string, any>;
}
