import { buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import enums from './schema/enums';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const leerGraphql = (archivo: any) => {
  return readFileSync(join(__dirname, archivo))
}

const schema = buildSchema(`
  ${enums}
  ${leerGraphql("./schema/scalars.graphql")}
  ${leerGraphql("./schema/types.graphql")}
  ${leerGraphql("./schema/response.graphql")}
  ${leerGraphql("./schema/funcions.graphql")}
`);

export default schema;