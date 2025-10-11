import { gql } from '@apollo/client';

const OBTENER_ESTADOS = gql`
  query ObtenerEstados($token: String!) {
    obtenerEstados(token: $token) {
      type
      message
      data {
        id
        estado
        vigencia
        createdAt
        updatedAt
      }
    }
  }
`;

export default OBTENER_ESTADOS;