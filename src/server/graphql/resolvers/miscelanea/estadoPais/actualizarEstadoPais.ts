import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "@fn";
import { AccionesBitacora, Rol, Vigencia } from "@prisma/client";

interface ActualizarEstadoPaisArgs {
    token: string;
    id: number;
    estado: string;
    vigencia: Vigencia
}

const actualizarEstadoPais = async (_: unknown, args: ActualizarEstadoPaisArgs) => {
    const { token, id, estado, vigencia } = args;

    // Validar campos obligatorios
    if (!token || !id || (!estado && !vigencia)) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token
        const { isAuthenticated, id: usuarioId, rol } = await verificarToken(token);

        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Validar permisos
        if (rol !== Rol.SUPER) {
            return errorResponse({ message: "No tienes permisos para realizar esta acción" });
        }

        // Verificar si el estado existe
        const estadoExistente = await prisma.estadoPais.findUnique({
            where: { id },
        });

        if (!estadoExistente) {
            return errorResponse({ message: "El estado o región no existe" });
        }

        // Verificar si el nuevo nombre ya existe
        const duplicado = await prisma.estadoPais.findFirst({
            where: {
                estado: estado,
                NOT: { id },
            },
        });

        if (duplicado) {
            return errorResponse({ message: "Ya existe otro estado con ese nombre" });
        }

        // Actualizar registro
        const estadoActualizado = await prisma.estadoPais.update({
            where: { id },
            data: {
                estado: estado,
                vigencia: vigencia,
            },
        });

        // Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: `Actualización de estado o región: ${estadoExistente.estado} → ${estado}`,
            type: AccionesBitacora.ACTUALIZACION_ESTADO,
        });

        return successResponse({
            message: "Estado o región actualizado exitosamente",
            data: estadoActualizado,
        });
    } catch (error) {
        console.error("Error al actualizar estado o país:", error);
        return errorResponse({ message: "Error al actualizar estado o país" });
    }
};

export default actualizarEstadoPais;
