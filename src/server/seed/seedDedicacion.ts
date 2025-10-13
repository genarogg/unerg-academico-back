import { prisma } from "@fn";
import { TipoDedicacion } from "@prisma/client";

/**
 * Crea registros en la tabla Dedicacion para todos los docentes
 * que aún no tengan una dedicación asignada.
 */
const seedDedicacion = async () => {
  try {
    const docentes = await prisma.docente.findMany({
      include: { Dedicacion: true, usuario: true },
    });

    if (!docentes.length) {
      console.log("⚠️ No hay docentes registrados en la base de datos.");
      return;
    }

    const tipos = Object.values(TipoDedicacion);

    // Asigna horas por tipo de dedicación
    const horasPorTipo: Record<TipoDedicacion, number> = {
      DEDICACION_EXCLUSIVA: 40,
      TIEMPO_COMPLETO: 36,
      MEDIO_TIEMPO: 20,
      TIEMPO_CONVENCIONAL: 12,
    };

    for (const docente of docentes) {
      if (!docente.Dedicacion.length) {
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];

        await prisma.dedicacion.create({
          data: {
            docenteId: docente.id,
            nombre: tipo,
            horas: horasPorTipo[tipo],
          },
        });

        console.log(
          `✅ Dedicación (${tipo}) creada para docente (usuario: ${docente.usuario?.email})`
        );
      } else {
        console.log(
          `⚠️ Docente (usuario: ${docente.usuario?.email}) ya tiene dedicación registrada.`
        );
      }
    }

    console.log("✨ Proceso de carga de dedicaciones completado.");
  } catch (error) {
    console.error("❌ Error al sembrar dedicaciones:", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedDedicacion;
