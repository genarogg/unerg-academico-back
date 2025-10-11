import crearEstadoPais from "./crearEstadoPais";
import obtenerEstados from "./obtenerEstados";
import actualizarEstadoPais from "./actualizarEstadoPais";

const resolvers = {
    Query: {
        obtenerEstados
    },

    Mutation: {
        crearEstadoPais,
        actualizarEstadoPais
    },
};

export default resolvers;