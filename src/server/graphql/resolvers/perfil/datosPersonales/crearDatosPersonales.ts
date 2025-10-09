import {
    prisma,
    verificarToken,
    successResponse,
    errorResponse,
    crearBitacora,
} from "src/server/functions";
import { AccionesBitacora, Sex } from "@prisma/client";

interface CrearDatosPersonalesArgs {
    token: string;
    primerNombre: string;
    segundoNombre?: string;
    tercerNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    sexo: Sex;
    fechaNacimiento: string;
    numeroCedula: number;
    numeroBancario?: string;
    telefono: string;

    // Datos de dirección
    zonaUrbanizacionId: number;
    calle: string;
    numeroCasa: number;
}

const crearDatosPersonales = async (_: unknown, args: CrearDatosPersonalesArgs) => {
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

    // Validar campos obligatorios
    if (
        !token ||
        !primerNombre ||
        !primerApellido ||
        !sexo ||
        !telefono ||
        !fechaNacimiento ||
        !numeroCedula ||
        !zonaUrbanizacionId ||
        !calle ||
        !numeroCasa
    ) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token
        const { isAuthenticated, id: usuarioId } = await verificarToken(token);
        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Verificar si ya existen datos personales
        const existeDatos = await prisma.datosPersonales.findUnique({
            where: { usuarioId },
        });

        if (existeDatos) {
            return errorResponse({ message: "Los datos personales ya están registrados" });
        }

        // Verificar que la zona exista
        const zona = await prisma.zonaUrbanizacion.findUnique({
            where: { id: zonaUrbanizacionId },
        });
        if (!zona) {
            return errorResponse({ message: "Zona o urbanización no encontrada" });
        }

        // Crear todo dentro de una transacción
        const resultado = await prisma.$transaction(async (tx) => {
            // Crear la dirección
            const direccion = await tx.direccion.create({
                data: {
                    zonaUrbanizacionId,
                    calle,
                    numeroCasa,
                },
            });

            // Crear los datos personales vinculados
            const datos = await tx.datosPersonales.create({
                data: {
                    usuarioId,
                    direccionId: direccion.id,
                    primerNombre,
                    segundoNombre,
                    tercerNombre,
                    primerApellido,
                    segundoApellido,
                    sexo,
                    fechaNacimiento: new Date(fechaNacimiento),
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

            return datos;
        });

        // Registrar en bitácora
        await crearBitacora({
            usuarioId,
            accion: "Registro de datos personales con dirección",
            type: AccionesBitacora.REGISTRO_USUARIO,
        });

        return successResponse({
            message: "Datos personales registrados exitosamente",
            data: resultado,
        });
    } catch (error) {
        console.error("Error al registrar datos personales:", error);
        return errorResponse({ message: "Error al registrar datos personales" });
    }
};

export default crearDatosPersonales;
