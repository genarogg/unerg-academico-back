import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "@fn";

interface ObtenerEstudiosArgs {
    token: string;
    id?: number; // Opcional: obtener un estudio por ID
    expedienteId?: number; // Opcional: filtrar por expediente
}

const obtenerEstudios = async (_: any, args: ObtenerEstudiosArgs) => {
    const { token, id, expedienteId } = args;

    try {
        // 🔐 Verificar token
        const { isAuthenticated } = await verificarToken(token);
        if (isAuthenticated) return errorResponse({ message: "Token inválido o expirado" });

        // 🔎 Si se pasa un ID, traer solo ese estudio
        if (id) {
            const estudio = await prisma.estudio.findUnique({
                where: { id },
                include: {
                    nivelEstudio: true,
                    casaEstudio: true,
                    expediente: true,
                },
            });

            if (!estudio) return errorResponse({ message: "El estudio no existe" });

            return successResponse({ message: "Estudio obtenido correctamente", data: estudio });
        }

        // 🔎 Filtrar por expedienteId si se pasa
        const filtros: any = {};
        if (expedienteId) filtros.expedienteId = expedienteId;

        const estudios = await prisma.estudio.findMany({
            where: filtros,
            orderBy: { fecha: "desc" },
            include: {
                nivelEstudio: true,
                casaEstudio: true,
                expediente: true,
            },
        });

        return successResponse({ message: "Estudios obtenidos correctamente", data: estudios });
    } catch (error: any) {
        console.error("Error al obtener estudios:", error);
        return errorResponse({ message: "Error al obtener los estudios" });
    }
};

export default obtenerEstudios;
