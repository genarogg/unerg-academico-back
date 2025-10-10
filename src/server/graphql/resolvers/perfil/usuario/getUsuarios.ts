import {
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    crearBitacora
} from "@fn";

import { Rol, AccionesBitacora, Prisma } from "@prisma/client";

interface ObtenerUsuariosArgs {
    token: string;
    filtro?: string;
}

const { SUPER, ADMIN, AREA, DOCENTE } = Rol

const obtenerUsuarios = async (_: unknown, args: ObtenerUsuariosArgs) => {



    const { token, filtro } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        // Verificar token y obtener usuario autenticado
        const {
            isAuthenticated,
            rol: rolUserSolicitante,
            id: usuarioIdSolicitante
        } = await verificarToken(token);

        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }
        console.log("obtenerUsuarios: ", args)
        // Si se proporciona un email específico, buscar solo ese usuario
        if (filtro) {

            const filtroCleaned = filtro.trim().toLowerCase();

            // Buscar por email o número de cédula
            const condicionesOR: Prisma.UsuarioWhereInput[] = [{ email: filtroCleaned }];

            if (!isNaN(Number(filtroCleaned))) {
                condicionesOR.push({ DatosPersonales: { numeroCedula: Number(filtroCleaned) } });
            }

            const usuario = await prisma.usuario.findFirst({
                where: { OR: condicionesOR },
                include: { DatosPersonales: true },
                omit: { password: true }
            });

            if (!usuario) {
                return errorResponse({ message: "Usuario no encontrado" });
            }

            // Verificar permisos para ver este usuario específico
            const puedeVerUsuario = verificarPermisosUsuario({
                rolSolicitante: rolUserSolicitante,
                rolObjetivo: usuario.rol
            });

            if (!puedeVerUsuario) {
                return errorResponse({ message: "No tienes permisos para ver este usuario" });
            }

            crearBitacora({
                usuarioId: usuarioIdSolicitante,
                accion: `Consulta de usuario(s) (${filtroCleaned ? filtroCleaned : 'todos'})`,
                type: AccionesBitacora.OBTENER_USUARIO
            })

            console.log("obtenerUsuarios: ", usuario)

            return successResponse({
                message: "Usuario encontrado",
                data: usuario
            });
        }

        // Determinar qué usuarios puede ver según su rol
        let whereCondition: any = {};

        switch (rolUserSolicitante) {
            case SUPER:
                // Los ADMIN pueden ver todos los ADMIN y ASISTENTE
                whereCondition = {
                    rol: {
                        in: [SUPER, ADMIN, AREA, DOCENTE]
                    }
                };
                break;

            case ADMIN:
                // Los ASISTENTE pueden ver todos los ASISTENTE
                whereCondition = {
                    rol: {
                        in: [ADMIN, AREA, DOCENTE]
                    }
                };
                break;

            case AREA:
                // Los USER pueden ver todos los USER
                whereCondition = {
                    rol: {
                        in: [AREA, DOCENTE]
                    }
                };
                break;

            default:
                return errorResponse({ message: "Rol no válido" });
        }

        // Buscar usuarios según los permisos
        const usuarios = await prisma.usuario.findMany({
            where: whereCondition,
            omit: { password: true },
            orderBy: { createdAt: 'desc' },
            include: { DatosPersonales: true }
        });

        const totalUsuarios = await prisma.usuario.count();

        crearBitacora({
            usuarioId: usuarioIdSolicitante,
            accion: `Consulta de usuario(s)`,
            type: AccionesBitacora.OBTENER_USUARIO
        })

        console.log("21obtenerUsuarios: ", usuarios)

        return successResponse({
            message: "Usuarios obtenidos correctamente",
            data: usuarios,
            meta: {
                total: usuarios.length,
                page: totalUsuarios,
            }
        });

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return errorResponse({ message: "Error al obtener usuarios" });
    }
};

// Función auxiliar para verificar permisos sobre un usuario específico
const verificarPermisosUsuario = ({
    rolSolicitante,
    rolObjetivo
}: {
    rolSolicitante: Rol,
    rolObjetivo: Rol
}): boolean => {
    switch (rolSolicitante) {
        case SUPER:
            return rolObjetivo === SUPER || rolObjetivo === ADMIN || rolObjetivo === AREA || rolObjetivo === DOCENTE;

        case ADMIN:
            // Los ASISTENTE pueden ver solo ASISTENTE
            return rolObjetivo === ADMIN || rolObjetivo === AREA || rolObjetivo === DOCENTE;

        case AREA:
            // Los USER pueden ver solo USER
            return rolObjetivo === AREA || rolObjetivo === DOCENTE

        default:
            return false;
    }
};

export default obtenerUsuarios;