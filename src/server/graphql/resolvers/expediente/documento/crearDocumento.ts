import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "@fn";
import { AccionesBitacora, EstatusDocumento } from "@prisma/client";

interface CrearDocumentoArgs {
    token: string;
    tipoDocumentoId: number;
    expedienteId: number;
    url: string;
}

const crearDocumento = async (_: unknown, args: CrearDocumentoArgs) => {
    const { token, tipoDocumentoId, expedienteId, url } = args;

    // Validar campos obligatorios
    if (!token || !tipoDocumentoId || !expedienteId || !url) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token del usuario
        const { isAuthenticated, id: usuarioId, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Verificar existencia de tipo de documento
        const tipoDocumento = await prisma.tipoDocumento.findUnique({
            where: { id: tipoDocumentoId },
        });
        if (!tipoDocumento) {
            return errorResponse({ message: "El tipo de documento no existe" });
        }

        // Verificar existencia de expediente
        const expediente = await prisma.expediente.findUnique({
            where: { id: expedienteId },
            include: { datosPersonales: { include: { usuario: true } } },
        });
        if (!expediente) {
            return errorResponse({ message: "El expediente no existe" });
        }

        // Verificar si el usuario puede subir el documento
        // Si es DOCENTE, solo puede subir documentos de su propio expediente
        if (rol === "DOCENTE" && expediente.datosPersonales.usuario.id !== usuarioId) {
            return errorResponse({
                message: "No tienes permiso para agregar documentos a este expediente",
            });
        }

        // Crear documento
        const nuevoDocumento = await prisma.documento.create({
            data: {
                tipoDocumentoId,
                expedienteId,
                url,
                estatus: EstatusDocumento.PENDIENTE,
            },
        });

        // Registrar acción en la bitácora
        await crearBitacora({
            usuarioId,
            accion: `Creación de documento tipo ${tipoDocumento.nombre} para expediente ${expedienteId}`,
            type: AccionesBitacora.REGISTRO_ZONA, // Puedes crear un tipo más específico si lo deseas
        });

        return successResponse({
            message: "Documento creado exitosamente",
            data: nuevoDocumento,
        });
    } catch (error) {
        console.error("Error al crear documento:", error);
        return errorResponse({ message: "Error al crear documento" });
    }
};

export default crearDocumento;
