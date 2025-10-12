import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "@fn";
import { Rol } from "@prisma/client";

interface ObtenerCampusesArgs {
    token: string;
}

const obtenerCampuses = async (_: unknown, args: ObtenerCampusesArgs) => {
    const { token } = args;

    // Validar token
    if (!token) {
        return errorResponse({ message: "Token es obligatorio" });
    }

    try {
        // Verificar token
        const { isAuthenticated, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Control de permisos
        if (rol === Rol.DOCENTE) {
            return errorResponse({ message: "No tienes permisos para ver los campus" });
        }

        // Obtener todos los campus con sus relaciones relevantes
        const campuses = await prisma.campus.findMany({
            include: {
                zonaUrbanizacion: {
                    include: {
                        estadoPais: true, 
                    },
                },
                Area: {
                    include: {
                        Programa: true,
                    },
                },
            },
        });

        console.log(campuses)

        // Ordenar los campus por fecha de creación (más recientes primero)
        const campusesOrdenados = campuses.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        return successResponse({
            message: "Campuses obtenidos exitosamente",
            data: campusesOrdenados,
        });
    } catch (error) {
        console.error("Error al obtener campuses:", error);
        return errorResponse({ message: "Error al obtener campuses" });
    }
};

export default obtenerCampuses;
