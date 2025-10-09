import demoResolvers from "./resolvers/perfil/datosPersonales";
import pdfResolverResolvers from "./resolvers/pdf"
import usuarioResolver from "./resolvers/perfil/usuario";
import datosPersonalesResolver from "./resolvers/perfil/datosPersonales";

import estadoPaisResolver from "./resolvers/miscelanea/estadoPais";
import zonaUrbanizarionRasolver from "./resolvers/miscelanea/zonaUrbanizacion";

import tipoDocumentoResolver from "./resolvers/expediente/tipoDocumento";


const resolvers = {
    Query: {
        ...demoResolvers.Query,
        ...pdfResolverResolvers.Query,
        ...usuarioResolver.Query,
        ...estadoPaisResolver.Query,
        ...zonaUrbanizarionRasolver.Query,
        ...tipoDocumentoResolver.Query
    },

    Mutation: {
        ...usuarioResolver.Mutation,
        ...datosPersonalesResolver.Mutation,
        ...estadoPaisResolver.Mutation,
        ...zonaUrbanizarionRasolver.Mutation,
        ...tipoDocumentoResolver.Mutation
    },
};

export default resolvers;