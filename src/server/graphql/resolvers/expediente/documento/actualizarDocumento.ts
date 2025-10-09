import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "src/server/functions";
import { AccionesBitacora, Rol, EstatusDocumento } from "@prisma/client";

interface ActualizarDocumentoArgs {
    token: string;
    documentoId: number;
    tipoDocumentoId?: number;
    url?: string;
    estatus?: EstatusDocumento;
}

const actualizarDocumento = async (_: unknown, args: ActualizarDocumentoArgs) => {
    const { token, documentoId, tipoDocumentoId, url, estatus } = args;

    // Validar campos obligatorios
    if (!token || !documentoId) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token
        const { isAuthenticated, id: usuarioId, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Buscar documento existente
        const documento = await prisma.documento.findUnique({
            where: { id: documentoId },
            include: {
                expediente: {
                    include: {
                        datosPersonales: {
                            include: { usuario: true },
                        },
                    },
                },
                tipoDocumento: true,
            },
        });

        if (!documento) {
            return errorResponse({ message: "El documento no existe" });
        }

        // Permisos:
        // - DOCENTE: solo puede actualizar documentos suyos y no puede cambiar estatus
        // - ADMIN/SUPER: pueden cambiar cualquier campo
        if (rol === Rol.DOCENTE) {
            const propietarioId = documento.expediente.datosPersonales.usuario.id;
            if (usuarioId !== propietarioId) {
                return errorResponse({
                    message: "No tienes permiso para actualizar este documento",
                });
            }

            // Un docente no puede modificar el estatus
            if (estatus && estatus !== documento.estatus) {
                return errorResponse({
                    message: "No tienes permiso para modificar el estatus del documento",
                });
            }
        }

        // Verificar que el tipoDocumentoId nuevo exista (si se proporciona)
        if (tipoDocumentoId) {
            const tipoExistente = await prisma.tipoDocumento.findUnique({
                where: { id: tipoDocumentoId },
            });
            if (!tipoExistente) {
                return errorResponse({ message: "El tipo de documento no existe" });
            }
        }

        // Actualizar documento
        const documentoActualizado = await prisma.documento.update({
            where: { id: documentoId },
            data: {
                tipoDocumentoId: tipoDocumentoId ?? documento.tipoDocumentoId,
                url: url ?? documento.url,
                estatus: estatus ?? documento.estatus,
            },
        });

        // Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: `Actualización del documento ID ${documentoId}`,
            type: AccionesBitacora.ACTUALIZACION_ZONA, // puedes crear un tipo más específico si deseas
        });

        return successResponse({
            message: "Documento actualizado exitosamente",
            data: documentoActualizado,
        });
    } catch (error) {
        console.error("Error al actualizar documento:", error);
        return errorResponse({ message: "Error al actualizar documento" });
    }
};

export default actualizarDocumento;
