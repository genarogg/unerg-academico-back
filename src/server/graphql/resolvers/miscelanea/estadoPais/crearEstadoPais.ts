import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "src/server/functions";
import { AccionesBitacora, Rol } from "@prisma/client";

interface CrearEstadoPaisArgs {
    token: string;
    estado: string;
}

const crearEstadoPais = async (_: unknown, args: CrearEstadoPaisArgs) => {
    const { token, estado } = args;

    // Validar campos obligatorios
    if (!token || !estado) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token
        const { isAuthenticated, id: usuarioId, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        if (rol !== Rol.SUPER){
            return errorResponse({ message: "No tienes permisos para realizar esta acción" });
        }

        // Verificar si el estado ya existe
        const estadoExistente = await prisma.estadoPais.findFirst({
            where: { estado },
        });

        if (estadoExistente) {
            return errorResponse({ message: "El estado o región ya existe" });
        }

        // Crear estado
        const nuevoEstado = await prisma.estadoPais.create({
            data: { estado },
        });

        // Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: `Creación de estado o región: ${estado}`,
            type: AccionesBitacora.REGISTRO_ESTADO,
        });

        return successResponse({
            message: "Estado o región creado exitosamente",
            data: nuevoEstado,
        });
    } catch (error) {
        console.error("Error al crear estado o país:", error);
        return errorResponse({ message: "Error al crear estado o país" });
    }
};

export default crearEstadoPais;
