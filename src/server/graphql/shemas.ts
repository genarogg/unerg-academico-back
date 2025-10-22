import { buildSchema } from 'graphql';

import schemas from './schema/schemas';
import enums from './schema/enums';

const schema = buildSchema(`
  ${enums},
  ${schemas}
`);

export default schema;