import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "@fn";
import { AccionesBitacora, EstatusDocumento } from "@prisma/client";

interface ActualizarEstudioArgs {
    token: string;
    id: number;
    expedienteId?: number;
    nivelEstudioId?: number;
    casaEstudioId?: number;
    titulo?: string;
    fecha?: string;
    imgDocumento?: string;
    notas?: string;
    estatus?: EstatusDocumento;
}

const actualizarEstudio = async (_: any, args: ActualizarEstudioArgs) => {
    const { token, id, expedienteId, nivelEstudioId, casaEstudioId, titulo, fecha, imgDocumento, notas, estatus } = args;

    try {
        // 🔐 Verificar token
        const { isAuthenticated, id: usuarioId } = await verificarToken(token);
        if (isAuthenticated) return errorResponse({ message: "Token inválido" });

        // 🔎 Verificar si el estudio existe
        const estudioExistente = await prisma.estudio.findUnique({ where: { id } });
        if (!estudioExistente) return errorResponse({ message: "El estudio no existe" });

        // ✅ Actualizar el registro
        const estudioActualizado = await prisma.estudio.update({
            where: { id },
            data: {
                expedienteId,
                nivelEstudioId,
                casaEstudioId,
                titulo,
                fecha: fecha ? new Date(fecha) : undefined,
                imgDocumento,
                notas,
                estatus,
            },
            include: {
                nivelEstudio: true,
                casaEstudio: true,
                expediente: true,
            },
        });

        // 🧾 Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: `Actualizó un estudio (${titulo || estudioExistente.titulo})`,
            type: AccionesBitacora.REGISTRO_ESTUDIO,
        });

        return successResponse({ message: "Estudio actualizado correctamente", data: estudioActualizado });
    } catch (error: any) {
        console.error("Error al actualizar estudio:", error);
        return errorResponse({ message: "Error al actualizar el estudio" });
    }
};

export default actualizarEstudio;
