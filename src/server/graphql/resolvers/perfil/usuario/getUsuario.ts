import {
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    crearBitacora
} from "@fn";
import { Rol, AccionesBitacora, Prisma } from "@prisma/client";

interface ObtenerUsuarioArgs {
    token: string;
    filtro?: string;
}

const { SUPER, ADMIN, AREA, DOCENTE } = Rol;

const obtenerUsuario = async (_: unknown, args: ObtenerUsuarioArgs) => {
    const { token, filtro } = args;

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

        // 🔍 Validar filtro
        if (!filtro || filtro.trim() === "") {
            return errorResponse({ message: "Debe proporcionar un filtro (email o número de cédula)" });
        }

        const filtroCleaned = filtro.trim().toLowerCase();

        // 🔎 Buscar por email o número de cédula
        const condicionesOR: Prisma.UsuarioWhereInput[] = [{ email: filtroCleaned }];
        if (!isNaN(Number(filtroCleaned))) {
            condicionesOR.push({
                DatosPersonales: { numeroCedula: Number(filtroCleaned) }
            });
        }

        const usuario = await prisma.usuario.findFirst({
            where: { OR: condicionesOR },
            include: { DatosPersonales: true },
            omit: { password: true }
        });

        if (!usuario) {
            return errorResponse({ message: "Usuario no encontrado" });
        }

        // 🧩 Verificar permisos
        const puedeVerUsuario = verificarPermisosUsuario({
            rolSolicitante,
            rolObjetivo: usuario.rol
        });

        if (!puedeVerUsuario && usuario.id !== usuarioIdToken) {
            return errorResponse({ message: "No tienes permisos para ver este usuario" });
        }

        // 🪶 Registrar en bitácora
        await crearBitacora({
            usuarioId: usuarioIdToken,
            accion: `Consulta de usuario (${filtroCleaned}) por ${emailToken}`,
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
            return false;
        default:
            return false;
    }
};

export default obtenerUsuario;
