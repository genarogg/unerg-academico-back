import { prisma } from "@fn";
import { EstatusActividad } from "@prisma/client";

/**
 * Crea registros en la tabla ActividadDocente para todos los docentes
 * que aún no tengan una actividad registrada.
 */
const seedActividadDocente = async () => {
  try {
    const docentes = await prisma.docente.findMany({
      include: { ActividadDocente: true, usuario: true },
    });

    if (!docentes.length) {
      console.log("⚠️ No hay docentes registrados en la base de datos.");
      return;
    }

    for (const docente of docentes) {
      if (!docente.ActividadDocente.length) {
        const fechaInicio = new Date(
          2020 + Math.floor(Math.random() * 4), // entre 2020 y 2024
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        );

        const fechaFin = new Date(fechaInicio);
        fechaFin.setFullYear(fechaInicio.getFullYear() + 1);

        await prisma.actividadDocente.create({
          data: {
            docenteId: docente.id,
            estatus:
              Math.random() > 0.3
                ? EstatusActividad.ACTIVO
                : EstatusActividad.INACTIVO,
            motivo:
              Math.random() > 0.5
                ? "Actividad académica regular"
                : "Permiso temporal",
            fechaInicio,
            fechaFin,
          },
        });

        console.log(`✅ Actividad creada para docente (usuario: ${docente.usuario?.email})`);
      } else {
        console.log(
          `⚠️ Docente (usuario: ${docente.usuario?.email}) ya tiene una actividad registrada.`
        );
      }
    }

    console.log("✨ Proceso de carga de actividades docentes completado.");
  } catch (error) {
    console.error("❌ Error al sembrar actividades docentes:", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedActividadDocente;
