import { FormItemProps, InputProps, SwitchProps } from 'naive-ui';

export interface FormConfigBase extends FormItemProps {
  formType: 'input' | 'select' | 'radio' | 'checkbox' | 'date' | 'time' | 'datetime' | 'switch' | 'slider' | 'rate' | 'color-picker' | 'cascader' | 'upload' | 'form-item' | 'form';
  disabled?: boolean;
  key: string;
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

export type FormFieldConfig =
  InputConfig
  | SwitchConfig;
