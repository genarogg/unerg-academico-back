import demoResolvers from "./resolvers/datosPersonales";
import pdfResolverResolvers from "./resolvers/pdf"
import usuarioResolver from "./resolvers/usuario";
import datosPersonalesResolver from "./resolvers/datosPersonales";


const resolvers = {
    Query: {
        ...demoResolvers.Query,
        ...pdfResolverResolvers.Query,
        ...usuarioResolver.Query
    },

    Mutation: {
        ...usuarioResolver.Mutation,
        ...datosPersonalesResolver.Mutation
    },
};

export default resolvers;