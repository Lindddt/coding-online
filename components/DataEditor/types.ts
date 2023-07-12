
export enum JSONSchemaType {
  'object' = 'object',
  'string' = 'string',
  'array' = 'array',
  'boolean' = 'boolean',
  'number' = 'number',
}
export type JSONSchema = {
  type: JSONSchemaType.array | JSONSchemaType.object;
  name: string;
  // key?: string;
  values: JSONSchema[];
} | {
  type: JSONSchemaType.string;
  name: string;
  // key?: string;
  values: string;
} | {
  type: JSONSchemaType.boolean;
  name: string;
  // key?: string;
  values: 'true' | 'false';
} | {
  type: JSONSchemaType.number;
  name: string;
  // key?: string;
  values: number;
};

export const TYPE_NAME = ['string', 'number', 'object', 'array', 'boolean'];

export const TYPE_DEFAULT: {
  [key in JSONSchemaType]: JSONSchema[] | string  | number;
} = {
  'object': [{
    name: 'object_item_0',
    type: JSONSchemaType.string,
    values: '1'
  }],
  'string': 'string',
  'array': [{
    name: 'array_item_0',
    type: JSONSchemaType.string,
    values: '1'
  }],
  'boolean': 'false',
  'number': 1234.56,
};
