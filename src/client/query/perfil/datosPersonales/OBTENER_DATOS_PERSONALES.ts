import { gql } from "@apollo/client";

const OBTENER_DATOS_PERSONALES = gql`
  query ObtenerDatosPersonales($token: String!) {
    obtenerDatosPersonales(token: $token) {
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
          zonaUrbanizacion {
            id
            codigoPostal
            zona
            vigencia
            estadoPais {
              id
              estado
              vigencia
            }
          }
        }
      }
    }
  }
`;

export default OBTENER_DATOS_PERSONALES;
