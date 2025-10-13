import { gql } from "@apollo/client";

const OBTENER_CAMPUSES = gql`
  query ObtenerCampuses($token: String!) {
    obtenerCampuses(token: $token) {
      type
      message
      data {
        id
        tipo
        fechaCreacion
        fechaCierre
        createdAt
        updatedAt
        zonaUrbanizacion {
          id
          codigoPostal
          zona
          vigencia
          createdAt
          updatedAt
          estadoPais {
            id
            estado
            vigencia
            createdAt
            updatedAt
          }
        }
        area {
          id
          nombre
          createdAt
          updatedAt
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
        }
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

export default OBTENER_CAMPUSES;
