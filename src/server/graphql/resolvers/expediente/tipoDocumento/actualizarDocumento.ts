import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "@fn";
import { AccionesBitacora, Rol } from "@prisma/client";

interface ActualizarTipoDocumentoArgs {
    token: string;
    id: number;
    nombre?: string;
    vigencia?: string; // ACTIVO | INACTIVO
}

const actualizarTipoDocumento = async (_: unknown, args: ActualizarTipoDocumentoArgs) => {
    const { token, id, nombre, vigencia } = args;

    // Validar campos obligatorios
    if (!token || !id) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token
        const { isAuthenticated, id: usuarioId, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Solo SUPER o ADMIN pueden actualizar tipos de documento
        if (rol !== Rol.SUPER && rol !== Rol.ADMIN) {
            return errorResponse({ message: "No tienes permisos para realizar esta acción" });
        }

        // Verificar si el tipo de documento existe
        const tipoDocumentoExistente = await prisma.tipoDocumento.findUnique({
            where: { id },
        });

        if (!tipoDocumentoExistente) {
            return errorResponse({ message: "El tipo de documento no existe" });
        }

        // Evitar duplicados de nombre
        if (nombre) {
            const nombreDuplicado = await prisma.tipoDocumento.findFirst({
                where: {
                    nombre,
                    NOT: { id },
                },
            });

            if (nombreDuplicado) {
                return errorResponse({ message: "Ya existe otro tipo de documento con ese nombre" });
            }
        }

        // Actualizar tipo de documento
        const tipoDocumentoActualizado = await prisma.tipoDocumento.update({
            where: { id },
            data: {
                nombre: nombre ?? tipoDocumentoExistente.nombre,
                vigencia: vigencia ?? tipoDocumentoExistente.vigencia,
            },
        });

        // Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: `Actualización de tipo de documento: ${tipoDocumentoActualizado.nombre}`,
            type: AccionesBitacora.ACTUALIZACION_ZONA, // Puedes crear un enum específico como ACTUALIZACION_TIPO_DOCUMENTO si lo prefieres
        });

        return successResponse({
            message: "Tipo de documento actualizado exitosamente",
            data: tipoDocumentoActualizado,
        });
    } catch (error) {
        console.error("Error al actualizar tipo de documento:", error);
        return errorResponse({ message: "Error al actualizar tipo de documento" });
    }
};

export default actualizarTipoDocumento;
