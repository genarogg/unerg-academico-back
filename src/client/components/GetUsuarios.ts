import { gql } from "@apollo/client";

export const GET_AREAS = gql`
  query ObtenerAreas($token: String!, $campusId: Int, $id: Int) {
    obtenerAreas(token: $token, campusId: $campusId, id: $id) {
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
          zonaUrbanizacion {
            id
            zona
            codigoPostal
            estadoPais {
              id
              estado
            }
          }
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
      meta {
        total
        page
        limit
        totalPages
      }
    }
  }
`;
