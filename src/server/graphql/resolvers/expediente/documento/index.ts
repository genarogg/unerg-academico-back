import crearDocumento from "./crearDocumento";
import actualizarDocumento from "./actualizarDocumento";
import obtenerDocumentos from "./obtenerDocumentos";

const resolvers = {
    Query: {
        obtenerDocumentos,
    },

    Mutation: {
        crearDocumento,
        actualizarDocumento,
    },
};

export default resolvers;
