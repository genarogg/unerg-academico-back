import { gql } from "@apollo/client";

const CREAR_ESTADO_PAIS = gql`
  mutation CrearEstadoPais($token: String!, $estado: String!) {
    crearEstadoPais(token: $token, estado: $estado) {
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

export default CREAR_ESTADO_PAIS;
