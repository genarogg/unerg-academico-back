import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "@fn";

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
        const { isAuthenticated } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Obtener todas las zonas con información del estado al que pertenecen
        const zonas = await prisma.zonaUrbanizacion.findMany({
            include: {
                estadoPais: true,
            }
        });

        return successResponse({
            message: "Zonas de urbanización obtenidas correctamente",
            data: zonas,
        });
    } catch (error) {
        console.error("Error al obtener zonas de urbanización:", error);
        return errorResponse({ message: "Error al obtener zonas de urbanización" });
    }
};

export default obtenerZonasUrbanizacion;
