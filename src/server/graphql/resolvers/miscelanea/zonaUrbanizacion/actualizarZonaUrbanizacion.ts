import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "src/server/functions";
import { AccionesBitacora, Rol, Vigencia } from "@prisma/client";

interface ActualizarZonaUrbanizacionArgs {
    token: string;
    id: number;
    estadoPaisId?: number;
    codigoPostal?: number;
    zona?: string;
    vigencia: Vigencia
}

const actualizarZonaUrbanizacion = async (_: unknown, args: ActualizarZonaUrbanizacionArgs) => {
    const { token, id, estadoPaisId, codigoPostal, zona, vigencia } = args;

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

        // Solo SUPER puede actualizar zonas
        if (rol !== Rol.SUPER) {
            return errorResponse({ message: "No tienes permisos para realizar esta acción" });
        }

        // Buscar la zona a actualizar
        const zonaExistente = await prisma.zonaUrbanizacion.findUnique({
            where: { id },
        });

        if (!zonaExistente) {
            return errorResponse({ message: "La zona especificada no existe" });
        }

        const zonaDuplicada = await prisma.zonaUrbanizacion.findFirst({
            where: { zona, estadoPaisId },
        });

        // Verificar duplicidad si se intenta cambiar el nombre o estadoPaisId
        if (zonaDuplicada) {
            return errorResponse({
                message: "Ya existe una zona con ese nombre en este estado o región",
            });
        }

        // Actualizar la zona
        const zonaActualizada = await prisma.zonaUrbanizacion.update({
            where: { id },
            data: {
                estadoPaisId,
                codigoPostal,
                zona,
                vigencia
            },
        });

        // Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: `Actualización de zona/urbanización '${zonaActualizada.zona}' (ID: ${zonaActualizada.id})`,
            type: AccionesBitacora.ACTUALIZACION_ZONA,
        });

        return successResponse({
            message: "Zona o urbanización actualizada exitosamente",
            data: zonaActualizada,
        });
    } catch (error) {
        console.error("Error al actualizar zona de urbanización:", error);
        return errorResponse({ message: "Error al actualizar zona de urbanización" });
    }
};

export default actualizarZonaUrbanizacion;
