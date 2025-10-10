import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "@fn";
import { AccionesBitacora, Rol } from "@prisma/client";

interface CrearTipoDocumentoArgs {
    token: string;
    nombre: string;
}

const crearTipoDocumento = async (_: unknown, args: CrearTipoDocumentoArgs) => {
    const { token, nombre } = args;

    // Validar campos obligatorios
    if (!token || !nombre) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token
        const { isAuthenticated, id: usuarioId, rol } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Permitir solo roles con privilegios altos
        if (rol !== Rol.SUPER && rol !== Rol.ADMIN) {
            return errorResponse({ message: "No tienes permisos para realizar esta acción" });
        }

        // Verificar si el tipo de documento ya existe
        const tipoDocumentoExistente = await prisma.tipoDocumento.findFirst({
            where: { nombre },
        });

        if (tipoDocumentoExistente) {
            return errorResponse({ message: "El tipo de documento ya existe" });
        }

        // Crear nuevo tipo de documento
        const nuevoTipoDocumento = await prisma.tipoDocumento.create({
            data: { nombre },
        });

        // Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: `Creación de tipo de documento: ${nombre}`,
            type: AccionesBitacora.REGISTRO_ZONA, // Puedes crear un nuevo tipo si deseas algo más específico
        });

        return successResponse({
            message: "Tipo de documento creado exitosamente",
            data: nuevoTipoDocumento,
        });
    } catch (error) {
        console.error("Error al crear tipo de documento:", error);
        return errorResponse({ message: "Error al crear tipo de documento" });
    }
};

export default crearTipoDocumento;
