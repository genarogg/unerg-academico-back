import { prisma } from "@fn";

/**
 * Crea registros en la tabla Docente para todos los usuarios con rol DOCENTE
 * que aún no tengan su registro correspondiente.
 */
const seedDocentes = async () => {
    try {
        const usuariosDocentes = await prisma.usuario.findMany({
            where: { rol: "DOCENTE" },
            include: { docente: true },
        });

        if (!usuariosDocentes.length) {
            console.log("No hay usuarios con rol DOCENTE en la base de datos.");
            return;
        }

        for (const usuario of usuariosDocentes) {
            if (!usuario.docente) {
                await prisma.docente.create({
                    data: {
                        usuarioId: usuario.id,
                    },
                });
                console.log(`✅ Registro de docente creado para usuario: ${usuario.email}`);
            } else {
                console.log(`⚠️ Usuario ${usuario.email} ya tiene un registro de docente.`);
            }
        }

        console.log("✨ Proceso de carga de docentes completado.");
    } catch (error) {
        console.error("❌ Error al sembrar docentes:", error);
    } finally {
        await prisma.$disconnect();
    }
};

export default seedDocentes;
