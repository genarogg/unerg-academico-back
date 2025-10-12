import { gql } from "@apollo/client";

const GET_USUARIO = gql`
  query GetUsuario($token: String!, $id: Int) {
    getUsuario(token: $token, id: $id) {
      type
      message
      data {
        id
        email
        rol
        token
        createdAt
        updatedAt
        datosPersonales {
          primerNombre
          segundoNombre
          tercerNombre
          primerApellido
          segundoApellido
          sexo
          fechaNacimiento
          numeroCedula
          numeroBancario
          telefono
        }
      }
    }
  }
`;

export default GET_USUARIO;
