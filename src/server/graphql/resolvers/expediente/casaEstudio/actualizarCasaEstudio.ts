import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "@fn";
import { AccionesBitacora } from "@prisma/client";

interface ActualizarCasaEstudioArgs {
    token: string;
    id: number;
    nombre: string;
}

const actualizarCasaEstudio = async (_: unknown, args: ActualizarCasaEstudioArgs) => {
    const { token, id, nombre } = args;

    // Validar campos obligatorios
    if (!token || !id || !nombre) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token
        const { isAuthenticated, id: usuarioId, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Solo SUPER y ADMIN pueden actualizar casas de estudio
        if (rol !== "SUPER" && rol !== "ADMIN") {
            return errorResponse({
                message: "No tienes permisos para actualizar una casa de estudio",
            });
        }

        // Verificar si la casa de estudio existe
        const casaExistente = await prisma.casaEstudio.findUnique({ where: { id } });
        if (!casaExistente) {
            return errorResponse({ message: "La casa de estudio no existe" });
        }

        // Verificar si ya existe otra con el mismo nombre (case-insensitive)
        const duplicada = await prisma.casaEstudio.findFirst({
            where: {
                nombre: {
                    equals: nombre,
                },
                NOT: { id },
            },
        });

        if (duplicada) {
            return errorResponse({
                message: `Ya existe otra casa de estudio con el nombre "${nombre}"`,
            });
        }

        // Actualizar casa de estudio
        const casaActualizada = await prisma.casaEstudio.update({
            where: { id },
            data: { nombre },
        });

        // Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: `Actualización de casa de estudio (ID: ${id}) - Nuevo nombre: ${nombre}`,
            type: AccionesBitacora.ACTUALIZACION_ESTADO, // Puedes crear un tipo más específico
        });

        return successResponse({
            message: "Casa de estudio actualizada exitosamente",
            data: casaActualizada,
        });
    } catch (error) {
        console.error("Error al actualizar casa de estudio:", error);
        return errorResponse({ message: "Error al actualizar casa de estudio" });
    }
};

export default actualizarCasaEstudio;
