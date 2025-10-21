import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "@fn";

interface ObtenerZonasUrbanizacionArgs {
    token: string;
    estadoId?: number;
}

const obtenerZonasUrbanizacion = async (_: unknown, args: ObtenerZonasUrbanizacionArgs) => {
    const { token, estadoId } = args;

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

        // Construir filtro dinámico
        const where: any = {};
        if (estadoId) {
            where.estadoPaisId = estadoId;
        }

        // Obtener zonas (filtradas o todas)
        const zonas = await prisma.zonaUrbanizacion.findMany({
            where,
            include: {
                estadoPais: true,
            },
            orderBy: {
                id: 'asc',
            },
        });

        return successResponse({
            message: estadoId
                ? "Zonas de urbanización del estado obtenidas correctamente"
                : "Todas las zonas de urbanización obtenidas correctamente",
            data: zonas,
        });
    } catch (error) {
        console.error("Error al obtener zonas de urbanización:", error);
        return errorResponse({ message: "Error al obtener zonas de urbanización" });
    }
};

export default obtenerZonasUrbanizacion;
