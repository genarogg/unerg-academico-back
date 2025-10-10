import { gql } from "@apollo/client";

const GET_USUARIO = gql`
  query GetUsuario($token: String!) {
    getUsuario(token: $token) {
      type
      message
      data {
        id
        email
        rol
        token
        createdAt
        updatedAt
        DatosPersonales {
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
