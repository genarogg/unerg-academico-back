import {
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    crearBitacora
} from "@fn";
import { Rol, AccionesBitacora } from "@prisma/client";

interface getUsuarioArgs {
    token: string;
    id?: number;
}

const { SUPER, ADMIN, AREA, DOCENTE } = Rol;

const getUsuario = async (_: unknown, args: getUsuarioArgs) => {
    const { token, id } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const {
            isAuthenticated,
            id: usuarioIdToken,
            email: emailToken,
            rol: rolSolicitante
        } = await verificarToken(token);

        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // 🧠 Si no se pasa id, devolver el usuario del token
        const idObjetivo = id ?? usuarioIdToken;

        const usuario = await prisma.usuario.findUnique({
            where: { id: idObjetivo },
            include: { datosPersonales: true },
            omit: { password: true }
        });

        if (!usuario) {
            return errorResponse({ message: "Usuario no encontrado" });
        }

        // 🔐 Verificar permisos si intenta ver a otro usuario
        if (usuario.id !== usuarioIdToken) {
            const puedeVerUsuario = verificarPermisosUsuario({
                rolSolicitante,
                rolObjetivo: usuario.rol
            });

            if (!puedeVerUsuario) {
                return errorResponse({ message: "No tienes permisos para ver este usuario" });
            }
        }

        // 🪶 Registrar en bitácora
        await crearBitacora({
            usuarioId: usuarioIdToken,
            accion:
                usuario.id === usuarioIdToken
                    ? `Consulta de su propia información por ${emailToken}`
                    : `Consulta de usuario (${usuario.email}) por ${emailToken}`,
            type: AccionesBitacora.OBTENER_USUARIO
        });

        return successResponse({
            message: "Usuario obtenido correctamente",
            data: usuario
        });

    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return errorResponse({ message: "Error al obtener usuario" });
    }
};

// 🔒 Verificación de permisos
const verificarPermisosUsuario = ({
    rolSolicitante,
    rolObjetivo
}: {
    rolSolicitante: Rol;
    rolObjetivo: Rol;
}): boolean => {
    switch (rolSolicitante) {
        case SUPER:
            return [SUPER, ADMIN, AREA, DOCENTE].includes(rolObjetivo);
        case ADMIN:
            return ([ADMIN, AREA, DOCENTE] as Rol[]).includes(rolObjetivo);
        case AREA:
            return ([AREA, DOCENTE] as Rol[]).includes(rolObjetivo);
        case DOCENTE:
        default:
            return false;
    }
};

export default getUsuario
