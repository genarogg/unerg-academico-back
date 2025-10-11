import crearDatosPersonales from "./crearDatosPersonales";
import actualizarDatosPersonales from "./actualizarDatosPersonales";
import obtenerDatosPersonales from "./obtenerDatosPersonales";

const resolvers = {
    Query: {
        obtenerDatosPersonales,
    },

    Mutation: {
        crearDatosPersonales,
        actualizarDatosPersonales,
    },
};

export default resolvers;