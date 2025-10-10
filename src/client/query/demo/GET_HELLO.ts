import { gql } from "@apollo/client";

const GET_HELLO = gql`
    query GetHello {
        hello
    }
`;

export default GET_HELLO;
