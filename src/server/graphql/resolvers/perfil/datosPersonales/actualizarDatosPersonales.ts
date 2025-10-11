import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "@fn";
import { AccionesBitacora, Sex } from "@prisma/client";

interface ActualizarDatosPersonalesArgs {
    token: string;
    primerNombre?: string;
    segundoNombre?: string;
    tercerNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    sexo?: Sex;
    fechaNacimiento?: string;
    numeroCedula?: number;
    numeroBancario?: string;
    telefono?: string;

    // Datos de dirección
    zonaUrbanizacionId?: number;
    calle?: string;
    numeroCasa?: number;
}

const actualizarDatosPersonales = async (_: unknown, args: ActualizarDatosPersonalesArgs) => {
    const {
        token,
        primerNombre,
        segundoNombre,
        tercerNombre,
        primerApellido,
        segundoApellido,
        sexo,
        fechaNacimiento,
        numeroCedula,
        numeroBancario,
        telefono,
        zonaUrbanizacionId,
        calle,
        numeroCasa,
    } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        // Verificar token
        const { isAuthenticated, id: usuarioId } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Verificar existencia de datos personales
        const datosExistentes = await prisma.datosPersonales.findUnique({
            where: { usuarioId },
            include: { direccion: true },
        });

        if (!datosExistentes) {
            return errorResponse({ message: "No se encontraron datos personales para este usuario" });
        }

        // Ejecutar todo dentro de una transacción
        const resultado = await prisma.$transaction(async (tx) => {
            // Actualizar datos personales
            const datosActualizados = await tx.datosPersonales.update({
                where: { usuarioId },
                data: {
                    primerNombre,
                    segundoNombre,
                    tercerNombre,
                    primerApellido,
                    segundoApellido,
                    sexo,
                    fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
                    numeroCedula,
                    numeroBancario,
                    telefono,
                },
                include: {
                    direccion: {
                        include: {
                            zonaUrbanizacion: true,
                        },
                    },
                },
            });

            // Si hay campos de dirección, actualizarlos
            if (zonaUrbanizacionId || calle || numeroCasa) {
                await tx.direccion.update({
                    where: { id: datosExistentes.id },
                    data: {
                        zonaUrbanizacionId,
                        calle,
                        numeroCasa,
                    },
                });
            }

            return datosActualizados;
        });

        console.log("resultado", resultado);


        // Registrar en bitácora (fuera de la transacción)
        await crearBitacora({
            usuarioId,
            accion: "Actualización de datos personales y dirección",
            type: AccionesBitacora.ACTUALIZACION_USUARIO,
        });

        return successResponse({
            message: "Datos personales actualizados correctamente",
            data: resultado,
        });
    } catch (error) {
        console.error("Error al actualizar datos personales:", error);
        return errorResponse({ message: "Error al actualizar datos personales" });
    }
};

export default actualizarDatosPersonales;
