import { gql } from '@apollo/client';

const GET_USUARIOS = gql`
  query GetUsuarios($token: String!, $filtro: String) {
    getUsuarios(token: $token, filtro: $filtro) {
      type
      message
      data {
        id
        email
        rol
        createdAt
        updatedAt
        DatosPersonales {
          id
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
          direccionId
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export default GET_USUARIOS;
