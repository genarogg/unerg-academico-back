import { prisma } from "@fn";
import { TipoEmpleo, CategoriaLaboral } from "@prisma/client";

/**
 * Crea registros en la tabla EstatusLaboral para todos los docentes
 * que aún no tengan un estatus laboral registrado.
 */
const seedEstatusLaboral = async () => {
  try {
    const docentes = await prisma.docente.findMany({
      include: { EstatusLaboral: true, usuario: true },
    });

    if (!docentes.length) {
      console.log("⚠️ No hay docentes registrados en la base de datos.");
      return;
    }

    const tiposEmpleo = Object.values(TipoEmpleo);
    const categorias = Object.values(CategoriaLaboral);

    for (const docente of docentes) {
      if (!docente.EstatusLaboral.length) {
        await prisma.estatusLaboral.create({
          data: {
            docenteId: docente.id,
            tipoEmpleo:
              tiposEmpleo[Math.floor(Math.random() * tiposEmpleo.length)],
            categoriaLaboral:
              categorias[Math.floor(Math.random() * categorias.length)],
          },
        });

        console.log(
          `✅ Estatus laboral creado para docente (usuario: ${docente.usuario?.email})`
        );
      } else {
        console.log(
          `⚠️ Docente (usuario: ${docente.usuario?.email}) ya tiene estatus laboral.`
        );
      }
    }

    console.log("✨ Proceso de carga de estatus laboral completado.");
  } catch (error) {
    console.error("❌ Error al sembrar estatus laboral:", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedEstatusLaboral;
