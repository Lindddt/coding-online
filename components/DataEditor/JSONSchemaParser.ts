import { JSONSchema } from './types';
import { assignIn } from 'lodash';
const JSONSchemaParser = (root: JSONSchema): {
  [key: string]: any;
} | any[] | any => {
  if (root.type === 'object') {
    const result = {};
    if (root.values) {
      root.values.forEach((item) => {
        assignIn(result, {
          [item.name]: JSONSchemaParser(item)
        });
      });
    }
    return result;
  } else if (root.type === 'array') {
    const result = root.values.map((item) => JSONSchemaParser(item));
    return result;
  } else if (root.type === 'boolean') {
    const result = root.values === 'false' ? false : true;
    return result;
  } else {
    const result = root.values;
    return result;
  }
};
export default JSONSchemaParser;