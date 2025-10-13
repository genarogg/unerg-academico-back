import demoResolver from "./resolvers/demo/hello"
import pdfResolverResolvers from "./resolvers/pdf"
import usuarioResolver from "./resolvers/perfil/usuario";
import datosPersonalesResolver from "./resolvers/perfil/datosPersonales";

import estadoPaisResolver from "./resolvers/geografia/estadoPais";
import zonaUrbanizarionRasolver from "./resolvers/geografia/zonaUrbanizacion";

import tipoDocumentoResolver from "./resolvers/expediente/tipoDocumento";
import documentoResolver from "./resolvers/expediente/documento"
import crearCasaEstudio from "./resolvers/expediente/casaEstudio";
import estudioResolver from "./resolvers/expediente/estudio"

import campusResolver from "./resolvers/institucion/campus"
import areaResolver from "./resolvers/institucion/area"


const resolvers = {
    Query: {
        ...demoResolver.Query,
        ...pdfResolverResolvers.Query,
        ...datosPersonalesResolver.Query,
        ...usuarioResolver.Query,
        ...estadoPaisResolver.Query,
        ...zonaUrbanizarionRasolver.Query,
        ...tipoDocumentoResolver.Query,
        ...documentoResolver.Query,
        ...crearCasaEstudio.Query,
        ...estudioResolver.Query,
        ...campusResolver.Query,
        ...areaResolver.Query,
    },

    Mutation: {
        ...usuarioResolver.Mutation,
        ...datosPersonalesResolver.Mutation,
        ...estadoPaisResolver.Mutation,
        ...zonaUrbanizarionRasolver.Mutation,
        ...tipoDocumentoResolver.Mutation,
        ...documentoResolver.Mutation,
        ...crearCasaEstudio.Mutation,
        ...estudioResolver.Mutation,
        ...campusResolver.Mutation,
        ...areaResolver.Mutation,
    },
};

export default resolvers;