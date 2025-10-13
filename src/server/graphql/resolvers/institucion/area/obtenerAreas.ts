import { OBTENER_ESTADOS } from '@/query';
import {
  prisma,
  successResponse,
  errorResponse,
  verificarToken,
  crearBitacora,
} from "@fn";
import { AccionesBitacora } from "@prisma/client";

interface ObtenerAreasArgs {
  token: string;
}

const obtenerAreas = async (_: unknown, args: ObtenerAreasArgs) => {
  const { token } = args;

  if (!token) {
    return errorResponse({ message: "Token es obligatorio" });
  }

  // Validar token
  const { isAuthenticated, id: usuarioId } = await verificarToken(token);

  if (!isAuthenticated) {
    return errorResponse({ message: "Token inválido o expirado" });
  }

  try {
    // Construir el filtro dinámico
    const where: any = {};

    // Consultar las áreas
    const areas = await prisma.area.findMany({
      where,
      include: {
        campus: true,
        programa: true,
      },
    });

    // Registrar en la bitácora
    await crearBitacora({
      usuarioId: usuarioId,
      accion: "Obtener Áreas",
      type: AccionesBitacora.OBTENER_AREAS,
    });

    return successResponse({
      message: "Áreas obtenidas correctamente",
      data: areas,
    });
  } catch (error) {
    console.error("Error en obtenerAreas:", error);
    return errorResponse({
      message: "Error al obtener las áreas",
      error,
    });
  }
};

export default obtenerAreas;
