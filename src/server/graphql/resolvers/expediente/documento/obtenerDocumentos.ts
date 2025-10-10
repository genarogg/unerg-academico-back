import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
} from "@fn";
import { Rol } from "@prisma/client";

interface ObtenerDocumentosArgs {
    token: string;
    documentoId?: number;
}

const obtenerDocumentos = async (_: unknown, args: ObtenerDocumentosArgs) => {
    const { token, documentoId } = args;

    // Validar token
    if (!token) {
        return errorResponse({ message: "Token no proporcionado" });
    }

    try {
        // Verificar autenticación
        const { isAuthenticated, id: usuarioId, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Si viene un ID de documento específico
        if (documentoId) {
            const documento = await prisma.documento.findUnique({
                where: { id: documentoId },
                include: {
                    tipoDocumento: true,
                    expediente: {
                        include: {
                            datosPersonales: {
                                include: { usuario: true },
                            },
                        },
                    },
                },
            });

            if (!documento) {
                return errorResponse({ message: "El documento no existe" });
            }

            // Si el usuario es DOCENTE, solo puede ver sus propios documentos
            if (rol === Rol.DOCENTE && documento.expediente.datosPersonales.usuario.id !== usuarioId) {
                return errorResponse({
                    message: "No tienes permiso para ver este documento",
                });
            }

            return successResponse({
                message: "Documento obtenido exitosamente",
                data: documento,
            });
        }

        // Si no se pasa documentoId → obtener lista de documentos
        let documentos;

        if (rol === Rol.DOCENTE) {
            // Un docente solo ve sus documentos
            documentos = await prisma.documento.findMany({
                where: {
                    expediente: {
                        datosPersonales: {
                            usuarioId,
                        },
                    },
                },
                include: {
                    tipoDocumento: true,
                    expediente: true,
                },
                orderBy: { createdAt: "desc" },
            });
        } else {
            // SUPER, ADMIN, AREA → pueden ver todos
            documentos = await prisma.documento.findMany({
                include: {
                    tipoDocumento: true,
                    expediente: {
                        include: {
                            datosPersonales: {
                                include: { usuario: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        }

        return successResponse({
            message: "Documentos obtenidos exitosamente",
            data: documentos,
        });
    } catch (error) {
        console.error("Error al obtener documentos:", error);
        return errorResponse({ message: "Error al obtener documentos" });
    }
};

export default obtenerDocumentos;
