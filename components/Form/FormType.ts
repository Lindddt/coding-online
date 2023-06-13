import { FormItemProps, InputProps, SwitchProps } from 'naive-ui';
import { VNodeRef } from 'vue';

export interface FormConfigBase {
  formType: 'input' | 'select' | 'custom' | 'switch';
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
  | CustomConfig;
