import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "@fn";
import { AccionesBitacora } from "@prisma/client";

interface ObtenerDatosPersonalesArgs {
    token: string;
}

const obtenerDatosPersonales = async (_: unknown, args: ObtenerDatosPersonalesArgs) => {
    const { token } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        // 🔹 Verificar token
        const { isAuthenticated, id: usuarioId } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // 🔹 Buscar los datos personales del usuario
        const datosPersonales = await prisma.datosPersonales.findUnique({
            where: { usuarioId },
            include: {
                direccion: {
                    include: {
                        zonaUrbanizacion: {
                            include: {
                                estadoPais: true,
                            },
                        },
                    },
                },
            },
        });

        if (!datosPersonales) {
            return errorResponse({ message: "No se encontraron datos personales para este usuario" });
        }

        console.log("datosPersonales", datosPersonales);

        // 🔹 Registrar acción en bitácora
        await crearBitacora({
            usuarioId,
            accion: "Consulta de datos personales",
            type: AccionesBitacora.OBTENER_USUARIO,
        });

        // 🔹 Respuesta exitosa
        return successResponse({
            message: "Datos personales obtenidos correctamente",
            data: datosPersonales,
        });
    } catch (error) {
        console.error("Error al obtener datos personales:", error);
        return errorResponse({ message: "Error al obtener datos personales" });
    }
};

export default obtenerDatosPersonales;
