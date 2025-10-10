import {
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    crearBitacora
} from "src/server/functions";
import { AccionesBitacora } from "@prisma/client";

const obtenerUsuario = async (_: unknown, args: { token: string }) => {
    const { token } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        // 🔐 Verificar token y obtener información del usuario autenticado
        const {
            isAuthenticated,
            id: usuarioId,
            email
        } = await verificarToken(token);

        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // 🔍 Buscar el usuario con sus datos personales
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            omit: { password: true },
            include: {
                DatosPersonales: true
            }
        });

        if (!usuario) {
            return errorResponse({ message: "Usuario no encontrado" });
        }

        // 🪶 Registrar la acción en la bitácora
        await crearBitacora({
            usuarioId,
            accion: `Consulta de datos personales de usuario (${email})`,
            type: AccionesBitacora.OBTENER_USUARIO
        });

        console.log("obtenerUsuario: ", usuario)

        return successResponse({
            message: "Usuario obtenido correctamente",
            data: usuario
        });

    } catch (error) {
        console.error("Error al obtener usuario por token:", error);
        return errorResponse({ message: "Error al obtener usuario por token" });
    }
};

export default obtenerUsuario;
