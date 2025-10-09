import crearEstudio from "./crearEstudio";
import actualizarEstudio from "./actualizarEstudio";
import obtenerEstudios from "./obtenerEstudios";

const resolvers = {
    Query: {
        obtenerEstudios,
    },

    Mutation: {
        crearEstudio,
        actualizarEstudio,
    },
};

export default resolvers;
