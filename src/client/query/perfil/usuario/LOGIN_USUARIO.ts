import { gql } from "@apollo/client";

const LOGIN_USUARIO = gql`
  mutation LoginUsuario(
    $email: String!
    $password: String!
    $captchaToken: String
  ) {
    loginUsuario(
      email: $email
      password: $password
      captchaToken: $captchaToken
    ) {
      type
      message
      data {
        id
        email
        rol
        token
        DatosPersonales {
            primerNombre
            primerApellido
        }
      }
    }
  }
`;

export default LOGIN_USUARIO;