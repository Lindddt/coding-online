
export enum JSONSchemaType {
  'object' = 'object',
  'string' = 'string',
  'array' = 'array',
  'boolean' = 'boolean',
  'integer' = 'integer',
  'number' = 'number',
}
export interface JSONSchema {
  type: JSONSchemaType;
  title: string;
  value?: any;
  required: string[];
  properties?: { [key: string]: JSONSchema };
}