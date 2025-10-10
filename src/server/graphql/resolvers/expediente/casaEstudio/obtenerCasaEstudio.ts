import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "@fn";

interface ObtenerCasaEstudioArgs {
    token: string;
    id?: number; // opcional: si no se pasa, trae todas
}

const obtenerCasaEstudio = async (_: unknown, args: ObtenerCasaEstudioArgs) => {
    const { token, id } = args;

    // Validar token
    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        // Verificar token
        const { isAuthenticated } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Si se pasa un id, buscar una sola casa de estudio
        if (id) {
            const casa = await prisma.casaEstudio.findUnique({
                where: { id },
                include: {
                    Estudio: {
                        include: {
                            nivelEstudio: true,
                            expediente: true,
                        },
                    },
                },
            });

            if (!casa) {
                return errorResponse({ message: "La casa de estudio no existe" });
            }

            return successResponse({
                message: "Casa de estudio obtenida exitosamente",
                data: casa,
            });
        }

        // Si no se pasa id, traer todas las casas de estudio
        const casas = await prisma.casaEstudio.findMany({
            orderBy: { nombre: "asc" },
            include: {
                Estudio: true,
            },
        });

        return successResponse({
            message: "Listado de casas de estudio obtenido exitosamente",
            data: casas,
        });
    } catch (error) {
        console.error("Error al obtener casa(s) de estudio:", error);
        return errorResponse({ message: "Error al obtener casa(s) de estudio" });
    }
};

export default obtenerCasaEstudio;
