// query.ts
import { gql } from '@apollo/client';

export const ACTUALIZAR_ZONA_URBANIZACION = gql`
  mutation ActualizarZonaUrbanizacion(
    $token: String!
    $id: Int!
    $estadoPaisId: Int
    $codigoPostal: Int
    $zona: String
    $vigencia: Vigencia
  ) {
    actualizarZonaUrbanizacion(
      token: $token
      id: $id
      estadoPaisId: $estadoPaisId
      codigoPostal: $codigoPostal
      zona: $zona
      vigencia: $vigencia
    ) {
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
      }
    }
  }
`;
