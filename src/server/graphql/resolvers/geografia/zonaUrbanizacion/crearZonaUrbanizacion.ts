import { prisma, verificarToken, successResponse, errorResponse, crearBitacora } from "@fn";
import { AccionesBitacora } from "@prisma/client";

interface CrearZonaUrbanizacionArgs {
    token: string;
    estadoPaisId: number;
    codigoPostal: number;
    zona: string;
}

const crearZonaUrbanizacion = async (_: unknown, args: CrearZonaUrbanizacionArgs) => {
    const { token, estadoPaisId, codigoPostal, zona } = args;

    if (!token) return errorResponse({ message: "Token requerido" });
    if (!estadoPaisId || !codigoPostal || !zona) {
        return errorResponse({ message: "Todos los campos son obligatorios" });
    }

    try {
        // Verificar token y obtener usuario
        const usuario = await verificarToken(token);
        if (!usuario) return errorResponse({ message: "Token inválido" });

        // Crear la zonaUrbanizacion en la base de datos
        const nuevaZona = await prisma.zonaUrbanizacion.create({
            data: {
                estadoPaisId,
                codigoPostal,
                zona,
            },
        });

        // Registrar en la bitácora
        await crearBitacora({
            usuarioId: usuario.id,
            accion: `Creación de zonaUrbanizacion: ${zona}`,
            type: AccionesBitacora.REGISTRO_ZONA_URBANIZACION,
        });

        return successResponse({ message: "ZonaUrbanizacion creada exitosamente", data: nuevaZona });
    } catch (error: any) {
        console.error("Error creando zonaUrbanizacion:", error);
        return errorResponse({ message: error.message || "Error desconocido" });
    }
};

export default crearZonaUrbanizacion;
