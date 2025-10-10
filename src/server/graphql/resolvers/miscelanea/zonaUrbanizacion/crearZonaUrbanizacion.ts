import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "@fn";
import { Rol } from "@prisma/client";

interface ObtenerZonasUrbanizacionArgs {
    token: string;
}

const obtenerZonasUrbanizacion = async (_: unknown, args: ObtenerZonasUrbanizacionArgs) => {
    const { token } = args;

    // Validar campos obligatorios
    if (!token) {
        return errorResponse({ message: "Token es obligatorio" });
    }

    try {
        // Verificar token
        const { isAuthenticated, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Permitir acceso solo a SUPER, ADMIN o AREA
        if (rol !== Rol.SUPER) {
            return errorResponse({ message: "No tienes permisos para acceder a esta información" });
        }

        // Obtener todas las zonas con información del estado al que pertenecen
        const zonas = await prisma.zonaUrbanizacion.findMany();

        // Ordenar alfabéticamente por nombre de zona
        const zonasOrdenadas = zonas.sort((a, b) =>
            a.zona.toLowerCase().localeCompare(b.zona.toLowerCase())
        );

        return successResponse({
            message: "Zonas de urbanización obtenidas correctamente",
            data: zonasOrdenadas,
        });

    } catch (error) {
        console.error("Error al obtener zonas de urbanización:", error);
        return errorResponse({ message: "Error al obtener zonas de urbanización" });
    }
};

export default obtenerZonasUrbanizacion;
