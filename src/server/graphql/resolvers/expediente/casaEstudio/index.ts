import crearCasaEstudio from "./crearCasaEstudio";
import actualizarCasaEstudio from "./actualizarCasaEstudio";
import obtenerCasaEstudio from "./obtenerCasaEstudio";

const resolvers = {
    Query: {
        obtenerCasaEstudio,
    },

    Mutation: {
        crearCasaEstudio,
        actualizarCasaEstudio,
    },
};

export default resolvers;
