import {
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    crearBitacora
} from "@fn";

import { Rol, AccionesBitacora, Prisma } from "@prisma/client";

interface getUsuariosArgs {
    token: string;
    filtro?: string;
    page?: number;
    limit?: number;
}

const { SUPER, ADMIN, AREA, DOCENTE } = Rol;

const getUsuarios = async (_: unknown, args: getUsuariosArgs) => {
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

        // Si hay filtro, buscar usuarios que coincidan
        if (filtro) {
            const filtroCleaned = filtro.trim().toLowerCase();

            console.log("filtroCleaned: ", filtroCleaned)

            const condicionesOR: Prisma.UsuarioWhereInput[] = [
                {
                    email: {
                        contains: filtroCleaned,
                    }
                }
            ];

            if (!isNaN(Number(filtroCleaned))) {
                condicionesOR.push({
                    datosPersonales: {
                        numeroCedula: Number(filtroCleaned)
                    }
                });
            }

            const usuarios = await prisma.usuario.findMany({
                where: { OR: condicionesOR },
                include: { datosPersonales: true },
                omit: { password: true }
            });


            console.log("usuarios: ", usuarios)


            if (usuarios.length === 0) {
                return errorResponse({ message: "No se encontraron usuarios" });
            }

            // Verificar permisos para cada usuario encontrado
            const usuariosFiltrados = usuarios.filter(usuario =>
                verificarPermisosUsuario({
                    rolSolicitante: rolUserSolicitante,
                    rolObjetivo: usuario.rol
                })
            );

            if (usuariosFiltrados.length === 0) {
                return errorResponse({ message: "No tienes permisos para ver estos usuarios" });
            }

            console.log("usuariosFiltrados: ", usuariosFiltrados)

            crearBitacora({
                usuarioId: usuarioIdSolicitante,
                accion: `Consulta de usuarios por filtro (${filtroCleaned})`,
                type: AccionesBitacora.OBTENER_USUARIO
            });

            return successResponse({
                message: `${usuariosFiltrados.length} usuario(s) encontrado(s)`,
                data: usuariosFiltrados
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
                include: { datosPersonales: true },
                skip,
                take
            }),
            prisma.usuario.count({ where: whereCondition })
        ]);

        crearBitacora({
            usuarioId: usuarioIdSolicitante,
            accion: `Consulta de usuarios - página ${page}`,
            type: AccionesBitacora.OBTENER_USUARIO
        });

        console.log("usuarios: ", usuarios)
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


export default getUsuarios;
