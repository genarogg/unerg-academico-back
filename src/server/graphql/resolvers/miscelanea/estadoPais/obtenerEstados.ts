import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "src/server/functions";
import { Rol } from "@prisma/client";

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
        const { isAuthenticated, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        if (rol === Rol.DOCENTE) {
            return errorResponse({ message: "No tienes permisos para ver los estados" });
        }

        // Obtener todos los estados
        let estados = await prisma.estadoPais.findMany();

        const estadosOrdenados = estados.sort((a, b) =>
            a.estado.toLowerCase().localeCompare(b.estado.toLowerCase())
        );

        return successResponse({
            message: "Estados obtenidos exitosamente",
            data: estadosOrdenados,
        });
    } catch (error) {
        console.error("Error al obtener estados:", error);
        return errorResponse({ message: "Error al obtener estados" });
    }
};

export default obtenerEstados;
