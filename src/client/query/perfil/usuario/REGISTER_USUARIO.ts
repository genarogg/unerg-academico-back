import { gql } from "@apollo/client";

const REGISTER_USUARIO = gql`
  mutation RegisterUsuario(
    $email: String!
    $password: String!
    $cedula: Int!
    $captchaToken: String
    $rol: Rol,
    $token: String
  ) {
    registerUsuario(
      email: $email
      password: $password
      cedula: $cedula
      captchaToken: $captchaToken
      rol: $rol
      token: $token
    ) {
      type
      message
      data {
        id
        email
        rol
        token
        createdAt
        updatedAt
      }
    }
  }
`;

export default REGISTER_USUARIO;
