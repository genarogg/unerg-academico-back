import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "src/server/functions";
import { AccionesBitacora } from "@prisma/client";

interface CrearCasaEstudioArgs {
    token: string;
    nombre: string;
}

const crearCasaEstudio = async (_: unknown, args: CrearCasaEstudioArgs) => {
    const { token, nombre } = args;

    // Validar campos obligatorios
    if (!token || !nombre) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token del usuario
        const { isAuthenticated, id: usuarioId, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Solo roles autorizados pueden registrar nuevas casas de estudio
        if (rol !== "SUPER" && rol !== "ADMIN") {
            return errorResponse({
                message: "No tienes permisos para registrar una casa de estudio",
            });
        }

        // Verificar si ya existe una casa de estudio con el mismo nombre
        const existeCasa = await prisma.casaEstudio.findFirst({
            where: {
                nombre
            },
        });

        if (existeCasa) {
            return errorResponse({
                message: `Ya existe una casa de estudio con el nombre "${nombre}"`,
            });
        }

        // Crear la nueva casa de estudio
        const nuevaCasa = await prisma.casaEstudio.create({
            data: { nombre },
        });

        // Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: `Creación de casa de estudio: ${nombre}`,
            type: AccionesBitacora.REGISTRO_ESTADO, // puedes crear un tipo específico si deseas
        });

        return successResponse({
            message: "Casa de estudio creada exitosamente",
            data: nuevaCasa,
        });
    } catch (error) {
        console.error("Error al crear casa de estudio:", error);
        return errorResponse({ message: "Error al crear casa de estudio" });
    }
};

export default crearCasaEstudio;
