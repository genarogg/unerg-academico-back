import crearZonaUrbanizacion from "./crearZonaUrbanizacion";
import actualizarZonaUrbanizacion from "./actualizarZonaUrbanizacion";
import obtenerZonasUrbanizacion from "./obtenerZonasUrbanizacion"


const resolvers = {
    Query: {
        obtenerZonasUrbanizacion
    },

    Mutation: {
        crearZonaUrbanizacion,
        actualizarZonaUrbanizacion
    }
};

export default resolvers;