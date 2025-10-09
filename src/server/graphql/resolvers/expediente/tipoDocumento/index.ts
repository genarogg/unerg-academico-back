import crearTipoDocumento from "./crearTipoDocumento";
import actualizarTipoDocumento from "./actualizarDocumento";
import obtenerTipoDocumento from "./obtenerTipoDocumento";

const resolvers = {
    Query: {
        obtenerTipoDocumento
    },

    Mutation: {
        crearTipoDocumento,
        actualizarTipoDocumento
    },
};

export default resolvers;