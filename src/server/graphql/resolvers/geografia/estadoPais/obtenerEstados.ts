import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "@fn";

interface ObtenerEstadosArgs {
    token: string;
}

const obtenerEstados = async (_: unknown, args: ObtenerEstadosArgs) => {
    const { token } = args;

    // Validar token
    if (!token) {
        return errorResponse({ message: "Token es obligatorio" });
    }

    try {
        // Verificar token
        const { isAuthenticated } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Obtener estados con sus zonas y urbanizaciones
        const estados = await prisma.estadoPais.findMany();

        // Ordenar alfabéticamente los estados
        const estadosOrdenados = estados.sort((a, b) =>
            a.estado.toLowerCase().localeCompare(b.estado.toLowerCase())
        );

        return successResponse({
            message: "Estados y zonas obtenidos exitosamente",
            data: estadosOrdenados,
        });
    } catch (error) {
        console.error("Error al obtener estados y zonas:", error);
        return errorResponse({ message: "Error al obtener estados y zonas" });
    }
};

export default obtenerEstados;
