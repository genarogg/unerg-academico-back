import { prisma } from "src/server/functions";
import { CedulaAutorizadaStatus } from "@prisma/client";

const seedCedulasAutorizadas = async () => {
    // Cédulas que quieres autorizar
    const cedulas = [25074591, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Buscar el usuario que se usará como creador/asociado
    const usuario = await prisma.usuario.findFirst({
        where: { email: "admin@admin.com" },
    });

    if (!usuario) {
        console.error("❌ No se encontró el usuario admin@admin.com. Ejecuta primero el seed de usuarios.");
        return;
    }

    for (const cedula of cedulas) {
        const existente = await prisma.cedulaAutorizada.findUnique({
            where: { cedula },
        });

        if (!existente) {
            await prisma.cedulaAutorizada.create({
                data: {
                    cedula,
                    estatus: CedulaAutorizadaStatus.ACTIVO,
                    usuarioId: usuario.id,
                },
            });
            console.log(`✅ Cédula ${cedula} autorizada`);
        } else {
            console.log(`⚠️ Cédula ${cedula} ya estaba autorizada`);
        }
    }

    console.log("✔️ Seed de Cédulas Autorizadas completado");
};

export default seedCedulasAutorizadas;
