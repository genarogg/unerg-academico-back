import demoResolvers from "./resolvers/datosPersonales";
import pdfResolverResolvers from "./resolvers/pdf"
import usuarioResolver from "./resolvers/usuario";
import datosPersonalesResolver from "./resolvers/datosPersonales";
import estadoPais from "./resolvers/miscelanea/estadoPais";


const resolvers = {
    Query: {
        ...demoResolvers.Query,
        ...pdfResolverResolvers.Query,
        ...usuarioResolver.Query,
        ...estadoPais.Query
    },

    Mutation: {
        ...usuarioResolver.Mutation,
        ...datosPersonalesResolver.Mutation,
        ...estadoPais.Mutation
    },
};

export default resolvers;