// query.ts
import { gql } from '@apollo/client';

export const OBTENER_ZONAS_URBANIZACION = gql`
  query ObtenerZonasUrbanizacion($token: String!) {
    obtenerZonasUrbanizacion(token: $token) {
      type
      message
      data {
        id
        estadoPaisId
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
    }
  }
`;
