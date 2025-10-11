// query.ts
import { gql } from '@apollo/client';

export const CREAR_ZONA_URBANIZACION = gql`
  mutation CrearZonaUrbanizacion(
    $token: String!
    $estadoPaisId: Int!
    $codigoPostal: Int!
    $zona: String!
  ) {
    crearZonaUrbanizacion(
      token: $token
      estadoPaisId: $estadoPaisId
      codigoPostal: $codigoPostal
      zona: $zona
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
