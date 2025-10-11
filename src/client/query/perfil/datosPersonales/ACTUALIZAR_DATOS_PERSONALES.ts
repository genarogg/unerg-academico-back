import { gql } from "@apollo/client";

export const ACTUALIZAR_DATOS_PERSONALES = gql`
  mutation ActualizarDatosPersonales(
    $token: String!
    $primerNombre: String
    $segundoNombre: String
    $tercerNombre: String
    $primerApellido: String
    $segundoApellido: String
    $sexo: Sex
    $fechaNacimiento: Date
    $numeroCedula: Int
    $numeroBancario: String
    $telefono: String
    $zonaUrbanizacionId: Int
    $calle: String
    $numeroCasa: Int
  ) {
    actualizarDatosPersonales(
      token: $token
      primerNombre: $primerNombre
      segundoNombre: $segundoNombre
      tercerNombre: $tercerNombre
      primerApellido: $primerApellido
      segundoApellido: $segundoApellido
      sexo: $sexo
      fechaNacimiento: $fechaNacimiento
      numeroCedula: $numeroCedula
      numeroBancario: $numeroBancario
      telefono: $telefono
      zonaUrbanizacionId: $zonaUrbanizacionId
      calle: $calle
      numeroCasa: $numeroCasa
    ) {
      type
      message
      data {
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
        direccion {
          id
          calle
          numeroCasa
          ZonaUrbanizacion {
            id
            zona
            codigoPostal
            estadoPais {
              id
              estado
            }
          }
        }
      }
    }
  }
`;
