// query.ts
import { gql } from '@apollo/client';

const ACTUALIZAR_ESTADO_PAIS = gql`
  mutation ActualizarEstadoPais(
    $token: String!
    $id: Int!
    $estado: String!
    $vigencia: Vigencia!
  ) {
    actualizarEstadoPais(
      token: $token
      id: $id
      estado: $estado
      vigencia: $vigencia
    ) {
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

export default ACTUALIZAR_ESTADO_PAIS;