import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "src/server/functions";

interface ObtenerTipoDocumentoArgs {
    token: string;
    id?: number;
}

const obtenerTipoDocumento = async (_: unknown, args: ObtenerTipoDocumentoArgs) => {
    const { token, id } = args;

    // Validar token obligatorio
    if (!token) {
        return errorResponse({ message: "Token obligatorio" });
    }

    try {
        // Verificar token
        const { isAuthenticated } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        let resultado;

        // Si se envía ID, buscar solo ese tipo de documento
        if (id) {
            resultado = await prisma.tipoDocumento.findUnique({
                where: { id },
            });

            if (!resultado) {
                return errorResponse({ message: "Tipo de documento no encontrado" });
            }
        } else {
            // Si no se envía ID, devolver todos los tipos de documentos
            resultado = await prisma.tipoDocumento.findMany({
                orderBy: { nombre: "asc" },
            });
        }

        return successResponse({
            message: id
                ? "Tipo de documento obtenido correctamente"
                : "Lista de tipos de documentos obtenida correctamente",
            data: resultado,
        });
    } catch (error) {
        console.error("Error al obtener tipo(s) de documento:", error);
        return errorResponse({ message: "Error al obtener tipo(s) de documento" });
    }
};

export default obtenerTipoDocumento;
