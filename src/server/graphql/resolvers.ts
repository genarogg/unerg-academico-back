import demoResolvers from "./resolvers/perfil/datosPersonales";
import pdfResolverResolvers from "./resolvers/pdf"
import usuarioResolver from "./resolvers/perfil/usuario";
import datosPersonalesResolver from "./resolvers/perfil/datosPersonales";
import estadoPaisResolver from "./resolvers/miscelanea/estadoPais";
import zonaUrbanizarionRasolver from "./resolvers/miscelanea/zonaUrbanizacion";

const resolvers = {
    Query: {
        ...demoResolvers.Query,
        ...pdfResolverResolvers.Query,
        ...usuarioResolver.Query,
        ...estadoPaisResolver.Query,
        ...zonaUrbanizarionRasolver.Query
    },

    Mutation: {
        ...usuarioResolver.Mutation,
        ...datosPersonalesResolver.Mutation,
        ...estadoPaisResolver.Mutation,
        ...zonaUrbanizarionRasolver.Mutation
    },
};

export default resolvers;