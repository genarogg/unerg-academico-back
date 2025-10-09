import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "@fn";
import { AccionesBitacora, EstatusDocumento } from "@prisma/client";

interface CrearEstudioArgs {
    token: string;
    expedienteId: number;
    nivelEstudioId: number;
    casaEstudioId: number;
    titulo: string;
    fecha: string;
    imgDocumento: string;
    notas: string;
}

const crearEstudio = async (_: any, args: CrearEstudioArgs) => {
    const { token, expedienteId, nivelEstudioId, casaEstudioId, titulo, fecha, imgDocumento, notas } = args;

    try {
        // 🔐 Verificar token
        const { isAuthenticated, id: usurioId } = await verificarToken(token);

        if (isAuthenticated) return errorResponse({ message: "Token inválido" });

        // ✅ Crear el registro de estudio
        const nuevoEstudio = await prisma.estudio.create({
            data: {
                expedienteId,
                nivelEstudioId,
                casaEstudioId,
                titulo,
                fecha: new Date(fecha),
                imgDocumento,
                notas,
                estatus: EstatusDocumento.PENDIENTE,
            },
            include: {
                nivelEstudio: true,
                casaEstudio: true,
                expediente: true,
            },
        });

        // 🧾 Registrar en bitácora
        await crearBitacora({
            usuarioId: usurioId,
            accion: `Creó un registro de estudio (${titulo})`,
            type: AccionesBitacora.REGISTRO_ESTUDIO,
        });

        return successResponse({ message: "Estudio creado correctamente", data: nuevoEstudio });
    } catch (error: any) {
        console.error("Error al crear estudio:", error);
        return errorResponse({ message: "Error al crear el estudio" });
    }
};

export default crearEstudio;
