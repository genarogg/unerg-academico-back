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
    numeroCedula: string;
    numeroBancario?: string;
    telefono?: string;
    direccionId?: number;
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
        direccionId,
    } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    // Campos obligatorios
    if (
        !primerNombre ||
        !segundoNombre ||

        !primerApellido ||
        !segundoApellido ||

        !sexo ||
        !telefono ||
        !fechaNacimiento ||
        !numeroCedula) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    try {
        // Verificar token y obtener usuario
        const { isAuthenticated, id: usuarioId } = await verificarToken(token);

        if (!isAuthenticated) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Verificar si ya tiene datos personales registrados
        const existeDatos = await prisma.datosPersonales.findUnique({
            where: { usuarioId },
        });

        if (existeDatos) {
            return errorResponse({ message: "Los datos personales ya están registrados" });
        }

        // Crear los datos personales
        const nuevosDatos = await prisma.datosPersonales.create({
            data: {
                usuarioId,
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
                direccionId,
            },
            include: {
                direccion: true,
            },
        });

        // Registrar en la bitácora
        await crearBitacora({
            usuarioId,
            accion: "Registro de datos personales",
            type: AccionesBitacora.REGISTRAR_USUARIO,
        });

        return successResponse({
            message: "Datos personales registrados exitosamente",
            data: nuevosDatos,
        });
    } catch (error) {
        console.error("Error al registrar datos personales:", error);
        return errorResponse({ message: "Error al registrar datos personales" });
    } finally {
        await prisma.$disconnect();
    }
};

export default crearDatosPersonales;
