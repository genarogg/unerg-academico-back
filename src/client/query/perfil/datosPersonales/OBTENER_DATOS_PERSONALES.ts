import { gql } from '@apollo/client';

export const OBTENER_DATOS_PERSONALES = gql`
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
        
      }
    }
  }
`;
