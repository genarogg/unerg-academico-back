import { gql } from "@apollo/client";

const REGISTER_USUARIO = gql`
  mutation RegisterUsuario(
    $email: String!
    $password: String!
    $cedula: Int!
    $captchaToken: String
    $rol: Rol
  ) {
    registerUsuario(
      email: $email
      password: $password
      cedula: $cedula
      captchaToken: $captchaToken
      rol: $rol
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
