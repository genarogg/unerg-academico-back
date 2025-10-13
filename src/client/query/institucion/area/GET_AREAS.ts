import { gql } from "@apollo/client";

export const GET_AREAS = gql`
  query ObtenerAreas($token: String!) {
    obtenerAreas(token: $token) {
      type
      message
      data {
        id
        nombre
        campus {
          id
          tipo
          fechaCreacion
          fechaCierre
        }
        programa {
          id
          nombre
          nivelAcademico
          modalidad
          duracionAnios
          vigencia
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      
    }
  }
`;
