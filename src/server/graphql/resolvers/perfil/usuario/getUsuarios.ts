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
    page?: number;  
    limit?: number; 
}

const { SUPER, ADMIN, AREA, DOCENTE } = Rol;

const obtenerUsuarios = async (_: unknown, args: ObtenerUsuariosArgs) => {
    const { token, filtro, page = 1, limit = 20 } = args;
    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const {
            isAuthenticated,
            rol: rolUserSolicitante,
            id: usuarioIdSolicitante
        } = await verificarToken(token);

        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Si hay filtro, buscar un usuario específico
        if (filtro) {
            const filtroCleaned = filtro.trim().toLowerCase();

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

            const puedeVerUsuario = verificarPermisosUsuario({
                rolSolicitante: rolUserSolicitante,
                rolObjetivo: usuario.rol
            });

            if (!puedeVerUsuario) {
                return errorResponse({ message: "No tienes permisos para ver este usuario" });
            }

            crearBitacora({
                usuarioId: usuarioIdSolicitante,
                accion: `Consulta de usuario específico (${filtroCleaned})`,
                type: AccionesBitacora.OBTENER_USUARIO
            });

            return successResponse({
                message: "Usuario encontrado",
                data: usuario
            });
        }

        // Filtro según rol
        let whereCondition: any = {};

        switch (rolUserSolicitante) {
            case SUPER:
                whereCondition = { rol: { in: [SUPER, ADMIN, AREA, DOCENTE] } };
                break;
            case ADMIN:
                whereCondition = { rol: { in: [ADMIN, AREA, DOCENTE] } };
                break;
            case AREA:
                whereCondition = { rol: { in: [AREA, DOCENTE] } };
                break;
            default:
                return errorResponse({ message: "Rol no válido" });
        }

        // 📄 Paginación
        const skip = (page - 1) * limit;
        const take = limit;

        const [usuarios, totalUsuarios] = await Promise.all([
            prisma.usuario.findMany({
                where: whereCondition,
                omit: { password: true },
                orderBy: { createdAt: "desc" },
                include: { DatosPersonales: true },
                skip,
                take    // 👈 trae solo el límite definido
            }),
            prisma.usuario.count({ where: whereCondition })
        ]);

        crearBitacora({
            usuarioId: usuarioIdSolicitante,
            accion: `Consulta de usuarios - página ${page}`,
            type: AccionesBitacora.OBTENER_USUARIO
        });

        return successResponse({
            message: "Usuarios obtenidos correctamente",
            data: usuarios,
            meta: {
                total: totalUsuarios,  
                page,                   
                totalPages: Math.ceil(totalUsuarios / limit), 
                perPage: limit
            }
        });

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return errorResponse({ message: "Error al obtener usuarios" });
    }
};

// 🔒 Verificación de permisos
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
