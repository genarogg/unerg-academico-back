import { gql } from '@apollo/client';

const GET_USUARIOS = gql`
  query GetUsuarios($token: String!, $filtro: String) {
    getUsuarios(token: $token, filtro: $filtro) {
      type
      message
      meta {
        limit
        page
        total
        totalPages
      }
      data {
        id
        email
        rol
        createdAt
        updatedAt
        datosPersonales {
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
