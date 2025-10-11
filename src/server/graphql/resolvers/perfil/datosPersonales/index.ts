import crearDatosPersonales from "./crearDatosPersonales";
import actualizarDatosPersonales from "./actualizarDatosPersonales";

const resolvers = {
    Query: {

    },

    Mutation: {
        crearDatosPersonales,
        actualizarDatosPersonales,
    },
};

export default resolvers;